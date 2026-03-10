# PRD Improvement v1
## Couple Shared Map App Follow-up Work Document 2026-03-10

Document Status: Follow-up work document  
Document Principle: This document is a follow-up work document for `prd_v2_eng.md`. It does not replace the main PRD. It defines the implementation gaps and mandatory reinforcement items as of 2026-03-10.  
Language Principle: This is the English-only version. Code identifiers, file paths, types, and API names remain in their original form.

---

## 1. Document Purpose

This document defines the areas where the current implementation does not sufficiently satisfy `prd_v2_eng.md`, and provides implementation scope, behavioral rules, completion criteria, and verification guidance at a level Claude Code can execute directly.

Core goals:
1. Resolve the 9 primary issues identified in review.
2. Explicitly include the related rules that must be corrected together when fixing each issue.
3. Provide an implementation order that aligns domain rules and screen responsibility, rather than isolated screen patches.

## 1-1. Agent Working Principles

1. The single source of truth for product behavior is `prd_v2_eng.md`.
2. This document is a follow-up reinforcement document. If it conflicts with the PRD, the PRD wins.
3. UI-only fixes are not acceptable when the service rules remain incorrect.
4. Permissions, limits, state transitions, and data cleanup should be enforced in the service/store layer whenever possible.
5. Even in a mock environment, input semantics, output semantics, and state transitions must remain aligned with real service behavior.
6. If a new rule is required during implementation, update the PRD or this document first, then implement.

---

## 2. Document Scope

## 2-1. First-pass Scope

The first-pass scope of this document is the following 9 primary issues.

1. Thread author permissions are not enforced in the service layer
2. Connected users have no path to rejoin another map
3. `joinMap` does not actually switch to the target map
4. Final place deletion does not remove visits, images, and thread together
5. Disconnect, snapshot creation, and automatic snapshot entry do not match the PRD
6. The Map tab search lacks a bottom sheet, external results, ordering, and deduplication rules
7. Photo-based registration drops selected images when the user chooses an existing place
8. The per-place total 99-image cap is not enforced as a storage rule
9. Withdrawal is not blocked while connected and has no two-step confirmation

## 2-2. User-confirmed Decisions

As of 2026-03-10, the following decisions are confirmed by the user.

1. The mock data structure may be refactored significantly in this work.
2. Snapshot restore is supported only when the exact same two people reconnect after a breakup.
3. The map search result UI should be extracted into a dedicated component.
4. Destructive confirmation UI should be unified under the same confirm-component family whenever possible.

## 2-3. Out of Scope for This Pass

The following items are intentionally left as follow-up work and are not part of this first pass.

1. Real Apple Maps search integration
2. Full design system rework
3. New testing framework adoption
4. New screen concepts not already defined in the PRD

---

## 3. Improvement Goals

## 3-1. Goals

1. Make invite, join, map switching, deletion, snapshot, restore, and withdrawal rules consistent across UI and service layers.
2. Align `PG_INVITE_CENTER`, `PG_HOME_MAP`, `PG_PLACE_DETAIL`, `PG_VISIT_FORM`, `PG_RELATIONSHIP_DISCONNECT`, `PG_SNAPSHOT_READONLY`, `PG_RECONNECT_RESTORE_DECISION`, and `PG_MY_HOME` with their PRD responsibilities.
3. Refactor mock structures and state ownership so later backend integration can swap services without rewriting product behavior.

## 3-2. What This Pass Does Not Attempt

1. Real Apple Maps search integration
2. Full visual redesign
3. Test framework introduction
4. New screen concepts outside the PRD

---

## 4. Structural Reinforcement Principles

## 4-1. State Ownership Reinforcement

State ownership should be aligned to the PRD in at least the following direction.

1. Entity data belongs in `usePlaceStore`, `useVisitStore`, `useThreadStore`, `useMapStore`, and `useSnapshotStore`.
2. Home search and filter state should be separated as shared state.
3. Map-only state should be separated from shared home state.
4. Temporary flow data and persisted entity data must not be mixed into the same responsibility or storage key.

## 4-2. Confirmation UI Reinforcement

Destructive confirmations and unsaved-exit confirmations should be unified under the same confirm-component family whenever possible.

Recommended:

1. reuse `ConfirmModal`
2. destructive rejoin warning
3. withdrawal step 1 and step 2
4. visit-form unsaved-exit confirmation

## 4-3. Search-provider Isolation Rule

The current code uses `react-native-maps` and does not explicitly set a `provider`, so iOS follows the default provider path.

However, map rendering and place search are not the same responsibility.

Rules for this pass:

1. Complete the search UX using a `mock search service`.
2. Keep the real search provider hidden behind the service layer.
3. In a later production phase, replace the mock layer with one of:
   - a native iOS bridge to `MKLocalSearch`
   - a server-side Apple Maps Server API integration
4. Do not assume the map rendering provider and the place search provider must be the same implementation.

---

## 5. Domain Rule Reinforcement

## 5-1. Map, Relationship, and Invite Code Reinforcement

Related PRD areas:

1. `6-1. Map / Relationship`
2. `6-2. Invite Code`
3. `PG_ONBOARDING_HUB`
4. `PG_INVITE_CENTER`

### Current Problems

1. Connected users cannot enter another invite code from Invite Center.
2. `joinMap` ignores the requested target map.
3. There is no rule that deletes the current active map and switches to the target map.
4. The one-active-map rule and the two-members-per-map rule are not reliably enforced in the service layer.

### Mandatory Reinforcement Rules

1. `PG_INVITE_CENTER` must keep the join input area visible even when the user is already connected.
2. Joining another map must show a destructive warning before execution.
3. A user can have only one active map.
4. A single map can contain at most two members.
5. A successful join must immediately invalidate the used invite code.
6. If the current map already has two users, the code generation and reissue area must be hidden.

### Implementation Notes

The current `mapService` stores only a single `currentMap`, so it cannot represent a world where multiple maps exist at the same time.

Refactor the mock structure into:

1. `maps: SharedMap[]`
2. `activeMapIdByUserId: Record<string, string | null>`
3. `inviteCodes: InviteCode[]`

`joinMap(targetMapId, userId)` must follow this order:

1. load the user’s current active map
2. validate target map existence
3. validate target map member count
4. if the current active map is different, delete the current active map completely
5. switch the user’s active map to the target map
6. add the user to the target map
7. invalidate the used invite code

The onboarding path must also be corrected.

1. `Invite Partner` creates a map
2. then enters `PG_INVITE_CENTER`
3. it does not jump directly to `PG_HOME_MAP`

### Affected Files

- `src/app/(auth)/welcome.tsx`
- `src/app/(main)/invite-center.tsx`
- `src/services/mapService.ts`
- `src/services/inviteService.ts`
- `src/stores/useMapStore.ts`
- `src/stores/useInviteStore.ts`
- `src/mock/data/*` if needed

### Done When

1. Connected users can still attempt another join.
2. A destructive confirmation always appears before switching maps.
3. The active map becomes the target map after join.
4. The previous active map is deleted.
5. The used invite code cannot be reused.
6. The two-members-per-map rule is enforced.

## 5-2. Final Place Deletion Reinforcement

Related PRD areas:

1. `6-9. Place Deletion Request`
2. `PG_PLACE_DETAIL`

### Current Problems

1. Final deletion removes only the place record.
2. Visits, visit images, and thread messages remain as orphaned data.
3. Expired deletion requests do not result in real final deletion.

### Mandatory Reinforcement Rules

1. Final deletion must remove the place, visits, images, and thread together.
2. The 3-day grace period and immediate partner-approved deletion must remain intact.
3. Expiration checks must run on app start, foreground resume, and place load.

### Implementation Notes

Create a single orchestration responsibility for cascading deletion.

Recommended order:

1. find `visitIds` for the `placeId`
2. delete visit images for those `visitIds`
3. delete thread messages for the `placeId`
4. delete the place

`checkExpiredDeleteRequests` must not remain a passive helper. It must trigger actual final deletion.

### Affected Files

- `src/services/placeService.ts`
- `src/services/visitService.ts`
- `src/services/threadService.ts`
- `src/stores/usePlaceStore.ts`
- `src/app/(main)/place/[id].tsx`
- `src/app/_layout.tsx` if needed

### Done When

1. Final deletion removes visits, images, and thread together.
2. Expired delete requests are actually processed.
3. No orphaned related data is visible after re-entry.

## 5-3. Disconnect, Snapshot, and Restore Reinforcement

Related PRD areas:

1. `6-10. Disconnection / Snapshot`
2. `PG_RELATIONSHIP_DISCONNECT`
3. `PG_SNAPSHOT_READONLY`
4. `PG_RECONNECT_RESTORE_DECISION`

### Current Problems

1. Snapshot creation omits visit images and thread messages.
2. The app routes back to onboarding after disconnect.
3. The snapshot is not shown automatically right after disconnect.
4. `Restore` and `Start Fresh` do not create meaningfully different outcomes.

### Mandatory Reinforcement Rules

1. Disconnect must create a read-only snapshot.
2. The snapshot must be shown automatically immediately after disconnect.
3. The snapshot must include places, visits, images, and thread messages for that relationship.
4. Snapshot restore is allowed only when the exact same two people reconnect.
5. If the user connects to a different person, the restore option must not be shown.

### Implementation Notes

Before disconnect, collect all of the following into the snapshot.

1. places in the current map
2. visits belonging to those places
3. visit images belonging to those visits
4. thread messages belonging to those places

After disconnect, use this navigation rule:

1. create the snapshot
2. disconnect the relationship
3. `router.replace('/snapshot/[snapshotId]')`
4. remove `setOnboarded(false)`

Restore eligibility must be determined by `same partner pair`.

Even in mock mode, `Restore` and `Start Fresh` must produce clearly different resulting states.

### Affected Files

- `src/app/(main)/settings/disconnect.tsx`
- `src/app/snapshot/[id].tsx`
- `src/app/(main)/reconnect/restore.tsx`
- `src/services/snapshotService.ts`
- `src/services/visitService.ts`
- `src/services/threadService.ts`
- `src/stores/useSnapshotStore.ts`

### Done When

1. The app routes to snapshot immediately after disconnect.
2. The snapshot contains visit images and thread messages.
3. The snapshot behaves as read-only.
4. The restore branch appears only for reconnection of the same pair.
5. `Restore` and `Start Fresh` lead to different real states.

## 5-4. Photo Registration, Visit Form, Hero Image, and 99-image Cap Reinforcement

Related PRD areas:

1. `6-5. Visit Records / Images`
2. `PG_PLACE_ADD_PHOTO`
3. `PG_PLACE_CREATE_FROM_PHOTO`
4. `PG_VISIT_FORM`

### Current Problems

1. Selected photos do not carry into the visit form when the user chooses an existing place.
2. The per-place total 99-image cap is not enforced at save time.
3. Edit-mode image changes are not persisted correctly.
4. Photo-based new place creation stores an invalid hero image id.

### Mandatory Reinforcement Rules

1. Selected photos must carry into the visit form for the existing-place path.
2. The total 99-image cap must be validated at save time using place-level totals.
3. The first image must automatically become the hero image.
4. `heroImageId` must use a real stored image id.

### Implementation Notes

`PG_VISIT_FORM` must accept `draftImageUris` and merge it into the initial create-mode image state.

Validate the 99-image cap at save time.

1. create mode:
   - `existingPlaceImageCount + newImages <= 99`
2. edit mode:
   - recalculate using the current visit’s existing image count

Edit mode must actually perform:

1. existing visit image lookup
2. deleted image removal
3. newly added image creation
4. final persistence that matches the form state

For photo-based new place creation:

1. get the actual first created `imageId` from `addImages`
2. store that value as `heroImageId`

### Affected Files

- `src/app/(main)/place/add/photo/index.tsx`
- `src/app/(main)/visit/form.tsx`
- `src/app/(main)/place/add/photo/create.tsx`
- `src/stores/useVisitStore.ts`
- `src/services/visitService.ts`
- `src/stores/usePlaceStore.ts`

### Done When

1. Selected photos remain visible in the visit form for the existing-place path.
2. The per-place total 99-image cap is enforced at save time.
3. Edit-mode image add/remove changes persist correctly.
4. The hero image after photo-based creation is displayed correctly.

## 5-5. Map Tab Search, Shared Search State, and Result Sheet Reinforcement

Related PRD areas:

1. `6-7. Search / Filter / Sort`
2. `10-1. State Ownership Principles`
3. `PG_HOME_MAP`
4. `PG_HOME_LIST`
5. `BTM_MAP_SEARCH_RESULTS`

### Current Problems

1. The Map tab shows only saved place markers.
2. There is no search result bottom sheet.
3. There are no current-region external results.
4. There is no saved-first ordering or duplicate filtering.

### Mandatory Reinforcement Rules

1. Map and List must share saved-place-based query and filter state.
2. The Map tab must additionally hold current visible-region external results.
3. Results must be shown in the order `Saved Places -> Additional Results in This Area`.
4. Already saved official places must not appear again as duplicated external results.

### Implementation Notes

Split state at least as follows.

1. shared state
   - `homeSearchQuery`
   - `homeStatusFilter`
   - `homeCategoryFilter`
2. map-only state
   - `mapRegion`
   - `mapVisibleBounds`
   - `mapApiResults`
   - `mapSearchSheetOpen`

Recommended:

1. keep `usePlaceStore` focused on entity data
2. add `useHomeStore` or `useSearchStore`

Search implementation strategy:

1. complete the search UX in this pass with a `mock search service`
2. extract the search result UI into a dedicated component
3. suggested filename:
   - `src/components/map/MapSearchResultsSheet.tsx`
4. keep the map screen focused on input and state management
5. let the sheet component render the `Saved Places` and `Additional Results in This Area` sections

List-tab rule:

1. no external results in List
2. keep List limited to saved `wishlist` and `visited`

### Affected Files

- `src/app/(tabs)/map.tsx`
- `src/app/(tabs)/list.tsx`
- `src/hooks/useFilteredPlaces.ts`
- `src/services/mapService.ts`
- `src/stores/*` if needed
- `src/components/map/*` if needed

### Done When

1. Map search opens a bottom sheet.
2. Saved results appear first.
3. External results are limited to the visible region.
4. Saved official places are not duplicated in the external section.
5. List search never shows external results.

## 5-6. My Page and Withdrawal Reinforcement

Related PRD areas:

1. `6-11. Account / Settings`
2. `PG_MY_HOME`

### Current Problems

1. Withdrawal CTA remains available while connected.
2. There is only a single confirmation step.
3. The store and service layer do not block withdrawal while connected.

### Mandatory Reinforcement Rules

1. Withdrawal must be blocked while connected.
2. The user must be required to disconnect first.
3. Withdrawal must use a two-step confirmation flow.
4. Withdrawal must delete account, session, profile, personal settings, and snapshots.

### Implementation Notes

UI rules:

1. while connected, present withdrawal as disabled or blocked guidance
2. clicking it should only show `disconnect first` guidance
3. connected users must not enter the two-step withdrawal flow

Confirmation UI rules:

1. fix the direction to `ConfirmModal` reuse
2. step 1: withdrawal start warning
3. step 2: irreversible final confirmation

Service rules:

1. `authStore.withdraw()` or the service layer must reject withdrawal while connected
2. remove snapshots and notification settings during withdrawal

### Affected Files

- `src/app/(tabs)/my.tsx`
- `src/stores/useAuthStore.ts`
- `src/services/authService.ts`
- `src/stores/useMapStore.ts` if needed

### Done When

1. Withdrawal cannot execute while connected.
2. Disconnect-first guidance is shown.
3. Only solo or disconnected users can complete withdrawal after two steps.

## 5-7. Place Detail Thread Permission and Edit Reinforcement

Related PRD areas:

1. `6-6. Thread`
2. `PG_PLACE_DETAIL`

### Current Problems

1. The service layer allows message update and delete without author verification.
2. The UI partially hides delete but has no edit flow.

### Mandatory Reinforcement Rules

1. Only the author can edit and delete.
2. Edit history must not be stored.
3. The app must preserve one shared thread per place.

### Implementation Notes

Service signature changes:

1. `updateMessage(messageId, actorUserId, body)`
2. `deleteMessage(messageId, actorUserId)`

Validation rules:

1. load the target message
2. fail when `authorUserId !== actorUserId`
3. allow edit/delete only for the author

UI rules:

1. show edit and delete CTA only for the current user’s own messages
2. update the body on edit save
3. a simple modal or inline input is acceptable

### Affected Files

- `src/services/threadService.ts`
- `src/stores/useThreadStore.ts`
- `src/app/(main)/place/[id].tsx`

### Done When

1. Non-authors cannot edit or delete.
2. Authors can edit and delete.
3. `updatedAt` changes after edit.
4. No edit history is stored.

---

## 6. Screen and System Reinforcement Rules

## 6-1. Onboarding Path Reinforcement

1. `Invite Partner` creates a map and enters `PG_INVITE_CENTER`
2. `Join with Invite` enters `PG_INVITE_CENTER`
3. Only `Start Solo for Now` goes directly to `PG_HOME_MAP`

## 6-2. Snapshot Screen Reinforcement

1. partner name
2. created date
3. read-only guidance
4. visual differentiation for archived mode

## 6-3. Visit Form Unsaved-exit Confirmation

It is strongly recommended to add `POP_UNSAVED_EXIT_CONFIRM` to `PG_VISIT_FORM` while the visit form is already being modified.

## 6-4. Map Search Result Sheet Responsibility

`BTM_MAP_SEARCH_RESULTS` must own the following responsibilities.

1. query header
2. `Saved Places` section
3. `Additional Results in This Area` section
4. saved-first ordering
5. official-place deduplication

---

## 7. Acceptance Criteria

## 7-1. Product Acceptance Criteria

This work is complete only when all of the following are true.

1. The one-active-map rule is enforced.
2. A destructive confirmation always appears before joining another map.
3. Final place deletion removes visits, images, and thread together.
4. Disconnect automatically shows a read-only snapshot.
5. `Restore` and `Start Fresh` are available only for reconnection of the same pair.
6. Map search uses a saved-first bottom-sheet structure.
7. Selected photos remain available in the existing-place visit flow.
8. The per-place total 99-image cap is enforced.
9. Withdrawal is blocked while connected.
10. Thread edit and delete are author-only.

## 7-2. Implementation Review Checklist

1. Invite code generation, reissue, join, and used-state handling all work.
2. Rejoin input remains available while connected.
3. Joining another map removes the previous active map.
4. Final deletion leaves no orphaned related data.
5. Disconnect routes immediately to snapshot.
6. Snapshot includes visit images and notes.
7. Restore eligibility is based on same partner pair.
8. Map search includes external results, but List search does not.
9. Edit-mode image behavior matches the final saved result.
10. Withdrawal is blocked while connected and requires two-step confirmation when eligible.
11. Thread author permissions are enforced in the service layer.

---

## 8. Implementation Priority

1. redesign mock map and invite data structures
2. fix Invite Center and rejoin rules
3. implement place deletion orchestration
4. complete snapshot creation, disconnect flow, and restore branching
5. fix photo flow and visit form
6. implement shared search state and map result sheet
7. enforce withdrawal guard and two-step confirmation
8. enforce thread permissions and add edit support
9. run verification and cleanup

---

## 9. Verification Method

## 9-1. Required Commands

```bash
npm install
./node_modules/.bin/tsc --noEmit
```

## 9-2. Manual Verification Items

1. verify all three onboarding paths
2. verify invite generation, reissue, join, and used-state handling
3. verify destructive rejoin warning while connected
4. verify cascading final deletion
5. verify automatic snapshot entry after disconnect
6. verify read-only snapshot behavior
7. verify restore vs start-fresh divergence
8. verify draft-image carry-over in the existing-place photo flow
9. verify enforcement of the 99-image cap
10. verify map search bottom sheet, ordering, and deduplication
11. verify withdrawal blocking while connected and two-step confirmation
12. verify author-only thread edit and delete

---

## 10. Direct Instructions for Claude Code

Implement under the following rules.

1. Read `prd_v2_eng.md` and this document before starting
2. Do not patch screens superficially; fix the store and service rules first
3. Even in mock mode, design signatures and responsibilities so real API replacement is easy later
4. When fixing one issue, also preserve adjacent PRD constraints in the same flow
5. Unify destructive confirmation UI under the same confirm component whenever practical
6. Keep map search results in a dedicated component
7. Show and execute snapshot restore only for reconnection of the exact same two people
8. In the completion report, focus on PRD acceptance criteria rather than a raw file-by-file change list
