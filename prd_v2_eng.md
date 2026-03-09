# PRD v2
## Couple Shared Map App MVP Final v2

Document Status: Finalized  
Document Principle: Going forward, only this document should be modified. This document is the single source of truth for screens, policy, and UX.  
UI Language Note: User-facing UI language is Korean. In this English version, literal Korean labels are preserved in backticks where the exact UI copy is already fixed.

---

## 1. Document Purpose
This document defines the app scope, domain rules, user flows, screen structure, `page_id`, popups/bottom sheets, and global UX principles at a level that an agent can implement directly.

Core goals:
1. Release-ready MVP completeness
2. The simplest possible, but polished and graceful UX
3. Minimal implementation complexity

## 1-1. Agent Working Principles
1. This document is the reference document for product behavior, screen responsibility, data semantics, and state ownership.
2. Environment-dependent implementation details such as external integration strategy, storage format, and test framework are not fixed in this document.
3. Environment-dependent implementation details must be isolated in the service layer or infrastructure configuration, and must not change the `page_id`, screen responsibility, or domain rules defined here.
4. If a new screen, popup, bottom sheet, or domain rule is needed but not defined here, update this document first and implement afterward.
5. If an undocumented UI choice is required, prefer reusing an existing screen/state/component instead of introducing a new concept.
6. Route parameter transport, storage implementation, and network library selection are implementation freedoms, but the inputs and outputs defined here must remain stable.

---

## 2. One-line Product Definition
A record-keeping app where couples save places they want to go and places they have visited on a shared map, and accumulate visit records, photos, and notes per place.

---

## 3. Product Principles
1. Only Google social login is supported.
2. The app is blocked in the logged-out state.
3. Auto-login is always retained.
4. A personal map is automatically created immediately after the first login.
5. Onboarding prioritizes `초대하기` and `초대받기`.
6. Solo usage is allowed before partner connection is completed.
7. The Map tab and List tab share saved-place-based search query and filter state, but the Map tab additionally shows map API results for the current visible region for the same query.
8. Popups are used only for simple confirmation or binary decisions.
9. Bottom sheets are used only when multiple pieces of content or choices must be shown.
10. Platform scope includes mobile phone apps only (iOS/Android).

---

## 4. Goals and Non-goals
### 4-1. Goals
1. Provide an immediately usable map-based record experience after login
2. Provide a simple couple connection experience through invite codes
3. Provide place registration, visit records, photos, and notes in a single flow
4. Provide rediscovery through search, filters, map, and list views
5. Preserve relationship history through read-only snapshots after disconnection

### 4-2. Non-goals
1. Email or phone number login
2. Web or tablet optimization
3. Avatars, decoration, payments, recommendations
4. Multiple active maps at the same time

---

## 5. Information Architecture
### 5-1. Bottom Tabs
1. Map
2. List
3. My Page / Settings

### 5-2. Top-level Entry Branching
1. No session -> Login
2. Valid session -> Splash gate, then onboarding or main entry
3. For first-login users, a personal map is automatically created after session restoration
4. Immediately after disconnection -> Snapshot is shown automatically

### 5-3. Screen Structure Principles
1. The Map tab and List tab share saved-place data and search/filter state, but the Map tab adds current-viewport map API search results as an extra layer.
2. All invite-related functionality is consolidated into a single Invite Center screen.
3. Photo-based registration splits `photo selection` and `new place creation` to keep responsibility clear.
4. Visit records use a single form experience and branch by mode for create/edit.

---

## 6. Domain Rules
## 6-1. Map / Relationship
1. A user can have only one active map.
2. A single map can contain at most two connected users.
3. The owner and the participant have identical permissions.
4. Joining another map completely deletes the current active map.
5. A final confirmation popup must be shown before deletion.
6. Solo map usage is allowed before invite completion.

## 6-2. Invite Code
1. Invite codes are 8-character alphanumeric strings.
2. No password is used.
3. Only one active invite code is kept per map.
4. If the current map already has two connected users, invite code generation/reissue is not allowed.
5. Reissuing a code invalidates the previous code immediately.
6. The code expires immediately on successful join.
7. The code expires automatically 24 hours after issuance.

## 6-3. Place
1. There are two place types: `official place` and `custom pin place`.
2. Official places cannot be duplicated.
3. If a duplicate official place is selected, no new place is created and the user moves to the existing detail page.
4. Custom pins can be duplicated.

## 6-4. Place Status
1. There are three statuses: `wishlist`, `visited`, and `orphan`.
2. When the first visit record is created, the status becomes `visited`.
3. When the last visit record is deleted, the status becomes `orphan`.
4. `orphan` can be reactivated by setting wishlist again or adding a new visit record.

## 6-5. Visit Records / Images
1. Visit records are stored by date.
2. Time is not stored.
3. Future dates are allowed.
4. Images are stored per visit record.
5. The total number of images per place is capped at 99.
6. The 99-image limit is enforced as a storage rule, and UI count display is not required.
7. The first image automatically becomes the hero image.
8. The hero image can be changed manually by the user.

## 6-6. Thread
1. Notes are managed as a single shared thread per place.
2. Messages allow text, links, and emoji only.
3. The maximum message length is 500 characters.
4. Only the author can edit or delete a message.
5. Edit history is not stored.

## 6-7. Search / Filter / Sort
1. All search targets are limited to place names only.
2. Map-tab search targets include all saved places in `wishlist` or `visited` state plus map API results within the current visible map region.
3. `wishlist` and `visited` places outside the current visible map region are also included in Map-tab search.
4. Map-tab search results are shown in a bottom sheet.
5. The Map-tab search result order is `saved places -> additional map API results within the current region`.
6. In the Map tab, an official place already saved in the app must not be shown again as a duplicate map API result.
7. List-tab search targets include saved places in `wishlist` or `visited` state only.
8. Filters are provided through a bottom sheet.
9. Status filters provide only `위시리스트` and `갔다 온 곳`.
10. Category filters provide `맛집`, `여행`, `놀거리`, and `특별한 장소`.
11. Default sorting is `most recently updated`.

## 6-8. Auto Classification
1. Auto classification applies only when the place is an official place and the status is `visited`.
2. `특별한 장소` is never auto-classified and can only be set manually.
3. The default category of a custom pin is `미분류`.
4. A category manually changed by the user must not be overwritten later by auto classification.

## 6-9. Place Deletion Request
1. Any user can request place deletion.
2. A deletion request does not delete the place immediately.
3. The scheduled deletion time is 3 days after the request.
4. If the partner approves it, deletion happens immediately.
5. The partner can reject it.
6. The requester can cancel the request.
7. The place remains usable during the grace period.
8. Final deletion removes the place, visit records, images, and thread together.
9. Expiration must be checked on app start, app foreground resume, and place load.

## 6-10. Disconnection / Snapshot
1. Any user can trigger relationship disconnection.
2. A read-only snapshot is created on disconnection.
3. The snapshot is shown automatically immediately after disconnection.
4. The snapshot remains as a fixed record of that relationship.
5. When reconnecting with the same partner, the user can choose `스냅샷 복구` or `새로 시작`.

## 6-11. Account / Settings
1. Logout is supported.
2. Account withdrawal is supported.
3. Withdrawal cannot be executed while the user is still connected.
4. If a connected user attempts withdrawal, they must be required to disconnect first.
5. Withdrawal is executed only after a two-step confirmation.
6. Withdrawal immediately deletes the account, session, profile, personal settings, and snapshots.
7. Account recovery is impossible after withdrawal.
8. Notification events are divided into six categories: `초대/연결`, `방문기록`, `메모`, `플레이스 삭제`, `연결 해제`, and `기념일`.
9. Notifications support per-event ON/OFF.
10. The default notification state is all ON.
11. Profile editing scope includes nickname and profile image.
12. Nickname is trimmed and limited to 1-12 characters.
13. Profile image supports both camera capture and gallery selection.
14. Only one anniversary is managed.
15. Anniversary can be edited only while connected. Solo users see guidance state only.

## 6-12. Core Data Model
The models below are logical models. Regardless of whether the actual storage is local storage, mock data, API, or DB, the field semantics and relationships must remain the same.

### UserProfile
1. `userId: string`
2. `nickname: string`
3. `profileImageUri: string | null`
4. `createdAt: string`
5. `updatedAt: string`

### SharedMap
1. `mapId: string`
2. `memberUserIds: string[]`
3. `activeInviteCodeId: string | null`
4. `anniversaryDate: string | null`
5. `anniversaryLabel: string | null`
6. `createdAt: string`
7. `updatedAt: string`

### InviteCode
1. `inviteCodeId: string`
2. `mapId: string`
3. `code: string`
4. `status: InviteCodeStatus`
5. `expiresAt: string`
6. `usedByUserId: string | null`
7. `usedAt: string | null`
8. `createdAt: string`

### Place
1. `placeId: string`
2. `mapId: string`
3. `sourceType: PlaceSourceType`
4. `externalPlaceId: string | null`
5. `name: string`
6. `latitude: number`
7. `longitude: number`
8. `addressText: string | null`
9. `category: PlaceCategory`
10. `status: PlaceStatus`
11. `heroImageId: string | null`
12. `deleteRequest: DeleteRequest | null`
13. `createdByUserId: string`
14. `createdAt: string`
15. `updatedAt: string`

### DeleteRequest
1. `requestedByUserId: string`
2. `requestedAt: string`
3. `expiresAt: string`
4. `status: DeleteRequestStatus`

### Visit
1. `visitId: string`
2. `placeId: string`
3. `visitDate: string`
4. `createdByUserId: string`
5. `createdAt: string`
6. `updatedAt: string`

### VisitImage
1. `imageId: string`
2. `visitId: string`
3. `uri: string`
4. `width: number | null`
5. `height: number | null`
6. `createdAt: string`

### ThreadMessage
1. `messageId: string`
2. `placeId: string`
3. `authorUserId: string`
4. `body: string`
5. `createdAt: string`
6. `updatedAt: string | null`

### Snapshot
1. `snapshotId: string`
2. `sourceMapId: string`
3. `partnerUserId: string`
4. `createdAt: string`
5. `places: Place[]`
6. `visits: Visit[]`
7. `visitImages: VisitImage[]`
8. `threadMessages: ThreadMessage[]`

### NotificationSettings
1. `userId: string`
2. `inviteAndConnection: boolean`
3. `visit: boolean`
4. `threadMessage: boolean`
5. `placeDelete: boolean`
6. `disconnect: boolean`
7. `anniversary: boolean`
8. `updatedAt: string`

## 6-13. Canonical Enum
1. `PlaceSourceType = official | custom_pin`
2. `PlaceStatus = wishlist | visited | orphan`
3. `PlaceCategory = food | travel | activity | special | uncategorized`
4. `InviteCodeStatus = active | used | expired | revoked`
5. `DeleteRequestStatus = pending | approved | rejected | canceled | expired`

---
## 7. Global UX Rules
1. Global loading is handled with an overlay.
2. Success/failure feedback is handled with toasts.
3. Empty states must be explicitly defined on all major screens.
4. Network errors must be shown together with a retry action.
5. When camera or album permission is denied, an alternative path must be shown.
6. If OS notification permission is turned off, the Notifications screen must show dedicated guidance.
7. When navigating away with unsaved changes, a confirmation popup must be shown.
8. In read-only snapshot screens, all edit actions must be blocked and visually differentiated from regular screens.

---

## 8. Page ID Rules
1. Regular screens use `PG_*`
2. Bottom sheets use `BTM_*`
3. Popups use `POP_*`
4. One `page_id` must own exactly one screen responsibility.
5. If create/edit share the same UX structure, branch within the same `page_id` through `mode`.

---

## 9. Screen System
## 9-1. Regular Screen List
| page_id | Screen Name | Recommended Route | Core Purpose |
|---|---|---|---|
| `PG_AUTH_SPLASH_GATE` | Splash / Session Gate | `/` | Restore session and branch entry |
| `PG_AUTH_LOGIN_GOOGLE` | Google Login | `/(auth)/login` | Block logged-out users and authenticate |
| `PG_ONBOARDING_HUB` | Onboarding Hub | `/(auth)/welcome` | Drive invite actions and allow solo start |
| `PG_INVITE_CENTER` | Invite Center | `/(main)/invite-center` | Generate / copy / share / enter invite code |
| `PG_HOME_MAP` | Map Tab Home | `/(tabs)/map` | Map-based exploration |
| `PG_HOME_LIST` | List Tab Home | `/(tabs)/list` | List-based exploration |
| `PG_PLACE_DETAIL` | Place Detail | `/(main)/place/[id]` | Place-level record hub |
| `PG_PLACE_ADD_SEARCH` | Add Place - Search | `/(main)/place/add/search` | Search and register official places |
| `PG_PLACE_ADD_PIN` | Add Place - Pin | `/(main)/place/add/pin` | Register custom pin places |
| `PG_PLACE_ADD_PHOTO` | Add Place - Photo | `/(main)/place/add/photo` | Start photo-based registration |
| `PG_PLACE_CREATE_FROM_PHOTO` | Create New Place from Photo | `/(main)/place/add/photo/create` | Create a new place during photo registration |
| `PG_VISIT_FORM` | Visit Record Create/Edit | `/(main)/visit/form` | Date/photo-based visit management |
| `PG_MY_HOME` | My Page / Settings Home | `/(tabs)/my` | Settings hub |
| `PG_SETTINGS_NOTIFICATIONS` | Notification Settings | `/(main)/settings/notifications` | Per-event notification toggles |
| `PG_SETTINGS_PROFILE` | Edit Profile | `/(main)/settings/profile` | Edit nickname / profile image |
| `PG_SETTINGS_ANNIVERSARY` | Add/Edit Anniversary | `/(main)/settings/anniversary` | Manage one anniversary |
| `PG_RELATIONSHIP_DISCONNECT` | Disconnect Relationship | `/(main)/settings/disconnect` | Execute relationship disconnection |
| `PG_SNAPSHOT_READONLY` | Read-only Snapshot | `/snapshot/[id]` | View the map at the moment of disconnection |
| `PG_RECONNECT_RESTORE_DECISION` | Reconnect Restore Decision | `/(main)/reconnect/restore` | Choose restore snapshot vs start fresh |

## 9-2. Bottom Sheet List
| page_id | Purpose |
|---|---|
| `BTM_PLACE_FILTER` | Status / category filters |
| `BTM_MAP_SEARCH_RESULTS` | Map home search results |
| `BTM_PLACE_ADD_ENTRY` | Search / pin / photo entry selector |
| `BTM_PLACE_CATEGORY_PICKER` | Category picker |
| `BTM_PLACE_HERO_PICKER` | Hero image picker |
| `BTM_PHOTO_PLACE_SELECTOR` | Existing place selector during photo registration |

## 9-3. Popup List
| page_id | Purpose |
|---|---|
| `POP_JOIN_MAP_DESTRUCTIVE_CONFIRM` | Final warning before joining another map |
| `POP_INVITE_CODE_INVALID` | Invite code invalid / expired guidance |
| `POP_PLACE_DELETE_REQUEST_CONFIRM` | Confirm place deletion request |
| `POP_PLACE_DELETE_APPROVE_CONFIRM` | Confirm place deletion approval |
| `POP_VISIT_DELETE_CONFIRM` | Confirm visit deletion |
| `POP_DISCONNECT_CONFIRM` | Final confirmation for relationship disconnection |
| `POP_LOGOUT_CONFIRM` | Logout confirmation |
| `POP_WITHDRAW_STEP1` | Withdrawal warning step 1 |
| `POP_WITHDRAW_STEP2` | Withdrawal final confirmation step 2 |
| `POP_UNSAVED_EXIT_CONFIRM` | Confirm exit with unsaved changes |

## 9-4. Structural Reinforcement Rules
1. Bottom-tab roots must contain only `PG_HOME_MAP`, `PG_HOME_LIST`, and `PG_MY_HOME`.
2. `PG_INVITE_CENTER` is treated as a shared authenticated stack screen entered from both onboarding and My Page.
3. Place creation, place detail, visit form, settings subpages, disconnection, and reconnect restore decision are all common stack screens pushed over the tabs.
4. `PG_SNAPSHOT_READONLY` and `PG_RECONNECT_RESTORE_DECISION` are not always-visible general navigation pages. They are relationship-state-only pages entered only when conditions are met.
5. Input/edit screens return to the previous context by default after completion. If a new entity is created, the default destination is the created detail page.

## 9-5. Navigation & Params Matrix
The `required input` and `optional input` below are logical inputs. The actual transport mechanism can be chosen based on the implementation environment, such as route params, store state, or navigation params.

| page_id | required input | optional input | Default destination after success/completion |
|---|---|---|---|
| `PG_AUTH_SPLASH_GATE` | none | none | Login, onboarding, or tab home |
| `PG_AUTH_LOGIN_GOOGLE` | none | none | `PG_ONBOARDING_HUB` or tab home |
| `PG_ONBOARDING_HUB` | none | none | `PG_INVITE_CENTER` or tab home |
| `PG_INVITE_CENTER` | none | `entrySource` | Tab home after join success |
| `PG_HOME_MAP` | none | none | Place detail or add flow |
| `PG_HOME_LIST` | none | none | Place detail or add flow |
| `PG_PLACE_DETAIL` | `placeId` | none | Previous home context on back |
| `PG_PLACE_ADD_SEARCH` | none | `initialQuery` | `PG_PLACE_DETAIL(placeId)` after selection |
| `PG_PLACE_ADD_PIN` | none | `initialRegion` | `PG_PLACE_DETAIL(placeId)` after save |
| `PG_PLACE_ADD_PHOTO` | none | none | `PG_VISIT_FORM` after selecting an existing place, `PG_PLACE_CREATE_FROM_PHOTO` after choosing new place creation |
| `PG_PLACE_CREATE_FROM_PHOTO` | `draftImageIds` | `initialLatitude`, `initialLongitude` | `PG_PLACE_DETAIL(placeId)` after save |
| `PG_VISIT_FORM` | `placeId` | `visitId`, `draftImageIds` | `PG_PLACE_DETAIL(placeId)` after save |
| `PG_MY_HOME` | none | none | Settings subpage or relationship action |
| `PG_SETTINGS_NOTIFICATIONS` | none | none | Immediate apply, then back |
| `PG_SETTINGS_PROFILE` | none | none | Immediate apply, then back |
| `PG_SETTINGS_ANNIVERSARY` | none | none | Immediate apply, then back |
| `PG_RELATIONSHIP_DISCONNECT` | none | none | `PG_SNAPSHOT_READONLY(snapshotId)` after completion |
| `PG_SNAPSHOT_READONLY` | `snapshotId` | none | `PG_MY_HOME` when closed |
| `PG_RECONNECT_RESTORE_DECISION` | `snapshotId` | none | Tab home depending on the selected outcome |

---

## 10. Detailed Screen Specs
## 10-0. Shared Reinforcement Rules
1. Input/edit screens (`PG_PLACE_ADD_PIN`, `PG_PLACE_ADD_PHOTO`, `PG_PLACE_CREATE_FROM_PHOTO`, `PG_VISIT_FORM`, `PG_SETTINGS_PROFILE`, `PG_SETTINGS_ANNIVERSARY`) are all subject to `POP_UNSAVED_EXIT_CONFIRM`.
2. Every regular screen must define `default`, `loading`, `empty`, `error`, and `read-only` states where applicable.
3. Non-tab screens are entered through stack push, and after completion they return to the previous context or the created detail screen.
4. If screen responsibility stays the same and only behavior changes due to permission, read-only state, or relationship state, do not create a new `page_id`; branch through state inside the same screen.

## 10-1. State Ownership Principles
| State Key | Ownership Scope | Description |
|---|---|---|
| `homeSearchQuery` | shared | Saved-place search query shared by Map and List tabs |
| `homeStatusFilter` | shared | Shared status filter for Map/List |
| `homeCategoryFilter` | shared | Shared category filter for Map/List |
| `mapRegion` | map-only | Map camera center / zoom state |
| `mapVisibleBounds` | map-only | Current visible bounds used for map API search |
| `mapApiResults` | map-only | External search results for the current region |
| `mapSearchSheetOpen` | map-only | Visibility state of the map search results bottom sheet |
| `selectedPlaceId` | page-local | Currently selected place detail target |
| `photoDraftImageIds` | flow-local | Temporary images kept only inside the photo registration flow |
| `visitFormDraft` | page-local | Visit form input values kept only until save |
| `inviteCodeInput` | page-local | Invite Center input value |

Additional principles:
1. `shared` state must persist across tab switches.
2. `map-only` state does not need to persist when moving to the List tab.
3. `flow-local` state is discarded when leaving the flow.
4. Persisted entity data and temporary draft data must not be mixed into the same storage key or same type.

## `PG_AUTH_SPLASH_GATE`
Purpose:
Restore the session and handle the first entry branching.

Required elements:
1. Session restoration loading
2. Main entry when the session is valid
3. Login entry when no session exists
4. Fallback when session restoration fails
5. Automatic personal map creation for first-login users

Review and refinement:
1. This screen does not ask about invite state directly. Its responsibility is limited to session check and initial branching.
2. Automatic map creation is simplest and most consistent at this stage.

## `PG_AUTH_LOGIN_GOOGLE`
Purpose:
Resolve the logged-out state and start app usage.

Required elements:
1. Google login button
2. Loading state during login
3. Failure message and retry
4. Terms / privacy policy links

Review and refinement:
1. Limiting login to one method removes choice fatigue.
2. Since only social login is supported, account creation and login are treated as a single action.

## `PG_ONBOARDING_HUB`
Purpose:
Drive connection behavior while still allowing solo entry.

Required elements:
1. `초대하기` (Invite Partner)
2. `초대받기` (Join with Invite)
3. `나중에 연결하고 먼저 시작` (Start Solo for Now)
4. Copy explaining that solo usage is allowed
5. A policy note for re-entry after connection is completed
6. Prevent re-entry for already connected users

Review and refinement:
1. No map-name input screen is used. It is unnecessary in the MVP.
2. It must clearly communicate that the app is usable before connection to reduce drop-off.
3. Already connected users should not remain on this screen and must be sent to main.

## `PG_INVITE_CENTER`
Purpose:
Handle invite code generation, copy, share, and input in one screen.

Required elements:
1. My code card
2. Code generation / reissue
3. Code copy button
4. Code share button
5. Code input area
6. Join button
7. Expiration time display
8. Copy/share success toast
9. Distinct messages for invalid / expired / already used states
10. `POP_JOIN_MAP_DESTRUCTIVE_CONFIRM` when joining another map
11. `8-character alphanumeric` input validation
12. Screen state branches (`solo`, `connected`, `joining in progress`)
13. Hide the code generation/share area when the relationship is already fully connected

Review and refinement:
1. It is more elegant to place generation and input together in a single screen than to split them.
2. Connected users can view current relationship status at the top and still attempt joining another map through the lower input area.
3. Joining is allowed, but a destructive warning must always appear first.
4. Onboarding and My Page should reuse the same screen so invite policy stays centralized.
5. To preserve the two-user maximum rule, code generation/share must be hidden when the map is already fully connected.

## `PG_HOME_MAP`
Purpose:
Act as the main hub for map-based exploration and fast entry.

Required elements:
1. Full-screen map canvas excluding the safe area
2. Floating search box fixed at the top of the screen
3. Floating filter button
4. Floating active-filter chip strip
5. `BTM_MAP_SEARCH_RESULTS`
6. Search result priority (`saved places -> additional map API results in current region`)
7. Map markers
8. Floating add button
9. Loading / error / empty states
10. Delete-requested place marker treatment
11. Orphan marker treatment
12. Search/filter state restoration
13. Empty-state CTA (`플레이스 추가`)

Review and refinement:
1. The map must not be placed inside a card layout; it should be the primary canvas occupying most of the screen.
2. Search results should be shown in a bottom sheet rather than an inline list to preserve map visibility.
3. Map-tab search works only by place name and shows saved `wishlist` / `visited` places first, followed by current-region map API results in the same list.
4. The saved-place-based query/filter state must be shared with the List tab so the user can switch views without losing exploration context.
5. Active filters must always be summarized on top of the map so users understand why results changed.

## `PG_HOME_LIST`
Purpose:
Handle list-based rediscovery.

Required elements:
1. Shared saved-place-based search query / filter state with the Map tab
2. Search bar
3. Search only `wishlist` and `visited` places
4. Restrict search to place names only
5. Filter button
6. Active-filter chip strip
7. Place card list
8. Floating add button
9. Display rules for deletion request / visit count / category
10. Loading / error / empty states
11. Empty-state CTA (`플레이스 추가`)

Review and refinement:
1. Map and List are not designed as separate features.
2. They provide only different representations of the same data, which is the simplest and most consistent structure.
3. The List tab should keep the same search entry pattern as the Map tab to reduce learning cost during tab switches.
4. List search is fixed to a fast lookup experience over already saved `wishlist` / `visited` places and must not mix in external map API results.

## `PG_PLACE_DETAIL`
Purpose:
The single hub for all place-level records.

Required elements:
1. Basic information
2. Hero image
3. Entry point for changing the hero image
4. Entry point for changing the category
5. Summary of visit count / latest visit date
6. Visit record list
7. Image gallery view
8. Shared thread input field
9. Author-only message edit/delete actions
10. Orphan-specific CTA
11. Deletion request / approval / rejection banner
12. Loading / error / exit rule after deletion completion
13. Definition of the difference between regular and read-only versions

Review and refinement:
1. Hero image change exists only on this screen. It must not be scattered across other screens.
2. Orphan is not an ambiguous state. It is a manageable state that can be reactivated.
3. Snapshot mode should reuse the same screen structure but remove all edit CTAs.
4. The shared thread handles both reading and input on the same screen, and permission differences are limited to message-level actions.

## `PG_PLACE_ADD_SEARCH`
Purpose:
Search and register official places.

Required elements:
1. Search input
2. Search result list
3. No-result state
4. Immediate navigation to existing detail for duplicate places
5. Guidance copy before duplicate redirection
6. Immediate save and navigation to detail when a new place is selected

Review and refinement:
1. Recent search and recommendations are excluded in the MVP.
2. Even with mock-data-based search, duplicate handling UX must still be designed at real-service quality.

## `PG_PLACE_ADD_PIN`
Purpose:
Create a custom place by dropping a pin on the map.

Required elements:
1. Pin selection on the map
2. Pin confirmation UX
3. Place name input
4. Prevent save when the name is empty
5. Default map starting point when location permission is denied

Review and refinement:
1. Do not save immediately when the pin is dropped. The user must confirm the name first.
2. Address is treated only as supporting information and is not a required save field.

## `PG_PLACE_ADD_PHOTO`
Purpose:
Start the photo-based registration flow.

Required elements:
1. Camera capture
2. Gallery selection
3. Permission-denied handling
4. Selected photo preview
5. Re-select / remove photo
6. Guidance for metadata read result
7. `기존 장소 선택` (Select Existing Place)
8. `새 장소 생성` (Create New Place)
9. Unsaved-exit handling

Review and refinement:
1. It is better to separate photo selection and new place creation into different screens.
2. Temporary photo retention exists only during the current registration session and is discarded on exit.
3. To avoid unnecessary complexity, no temporary draft preservation feature is provided.

## `PG_PLACE_CREATE_FROM_PHOTO`
Purpose:
Create a new place after a photo has already been selected.

Required elements:
1. Selected photo preview
2. Place name input
3. Location selection
4. Fallback when no location metadata exists
5. Official/custom handling model
6. Timing of initial hero image confirmation

Review and refinement:
1. If photo registration and new place creation are solved in one screen, the number of fields becomes too large.
2. Splitting this into a separate screen is simpler and less error-prone.
3. Saving a new place also creates its first visit record at the same time.

## `PG_VISIT_FORM`
Purpose:
Provide visit record creation and editing as a single form experience.

Required elements:
1. Create/edit mode branching
2. Target place summary header
3. Visit date input
4. Add/delete photos
5. Delete button in edit mode only
6. Validation for the per-place total 99-image limit
7. Guidance that future dates are allowed
8. Return to place detail after save completion
9. `POP_UNSAVED_EXIT_CONFIRM`

Review and refinement:
1. A single form screen is more maintainable than splitting create and edit into two screens.
2. Delete should appear only in edit mode to reduce accidental actions.

## `PG_MY_HOME`
Purpose:
The hub for My Page and Settings.

Required elements:
1. Profile card
2. Relationship status card
3. Relationship-state-specific card variants (`solo`, `connected`, `disconnected with snapshot retained`)
4. Entry to invite / connection management
5. Entry to notification settings
6. Entry to anniversary settings
7. CTA to re-enter snapshot
8. Logout
9. Withdrawal
10. Danger-level UI separation
11. Guidance that withdrawal is blocked while connected

Review and refinement:
1. Invite management and relationship disconnection should both be accessed under the relationship status card on this screen.
2. Snapshot re-entry is also most natural from this screen.
3. Card composition and CTAs on My Page must change based on relationship state.
4. Withdrawal is easy to misinterpret from a data-processing perspective, so the flow is simplified by blocking it while connected and requiring disconnection first.

## `PG_SETTINGS_NOTIFICATIONS`
Purpose:
Control notifications per event.

Required elements:
1. `초대/연결` toggle
2. `방문기록` toggle
3. `메모` toggle
4. `플레이스 삭제` toggle
5. `연결 해제` toggle
6. `기념일` toggle
7. Default all ON
8. OS-notification-permission-off guidance banner
9. Action to move to system settings

Review and refinement:
1. If only in-app toggles exist, users cannot understand why delivery does not work in reality.
2. OS permission state must be connected and shown within the screen.

## `PG_SETTINGS_PROFILE`
Purpose:
Edit nickname and profile image.

Required elements:
1. Nickname input
2. Nickname validation (`trimmed 1-12 chars`)
3. Camera capture for profile image
4. Gallery selection for profile image
5. Image replacement policy
6. Permission failure handling

Review and refinement:
1. Profile image deletion is not considered mandatory in the MVP.
2. Only replacement is supported; the default image is handled through automatic fallback.

## `PG_SETTINGS_ANNIVERSARY`
Purpose:
Manage one couple anniversary.

Required elements:
1. Date input
2. Label input (optional)
3. Connection-guidance empty state for solo usage
4. D-day preview
5. Edit policy

Review and refinement:
1. Since only one anniversary is managed, a list UI is unnecessary.
2. A `change date` centered flow is simpler than supporting deletion.
3. In solo mode, connection guidance takes priority over showing the edit form.

## `PG_RELATIONSHIP_DISCONNECT`
Purpose:
Execute relationship disconnection.

Required elements:
1. Accessible only for connected users
2. Impact summary
3. Display of place count / visit count
4. Snapshot creation guidance
5. `POP_DISCONNECT_CONFIRM`
6. Fallback when snapshot creation fails
7. Guidance that the partner will be notified

Review and refinement:
1. Relationship disconnection is a destructive action, so impact summary is mandatory.
2. Automatically showing the snapshot after completion is better than sending the user back to the home screen.

## `PG_SNAPSHOT_READONLY`
Purpose:
Allow read-only viewing of the map at the moment of disconnection.

Required elements:
1. Read-only badge
2. Header with created date and partner name
3. Guidance on whether restore is possible
4. Definition of visible ranges for places / visits / thread
5. Read-only UI differentiated from regular detail UI

Review and refinement:
1. Reuse the regular detail structure, but remove all input/edit actions.
2. Users should perceive this screen as an archived relationship record, not as an active storage space.

## `PG_RECONNECT_RESTORE_DECISION`
Purpose:
Decide whether to restore when reconnecting with the same partner.

Required elements:
1. Entry condition: detect reconnection with the same partner
2. Snapshot preview
3. `복구` CTA
4. `새로 시작` CTA
5. Explanation of the difference between both choices
6. Definition of the next destination after selection
7. Non-reversible warning

Review and refinement:
1. Compressing this decision into a popup does not provide enough information.
2. In a relationship-recovery context, a dedicated screen is the better choice.
3. The document must fix the downstream behavior: `복구` restores the snapshot as the active map, and `새로 시작` enters a new shared map, so implementation cannot diverge.

---

## 11. Bottom Sheet Details
## `BTM_PLACE_FILTER`
Required elements:
1. Status filter
2. Category filter
3. Reset
4. Apply

## `BTM_MAP_SEARCH_RESULTS`
Required elements:
1. Search query header
2. `저장된 플레이스` section (`wishlist`, `visited`)
3. `이 구역의 추가 결과` section (map API results for the current visible region)
4. Saved places shown first
5. Duplicate removal between already-saved official places and additional results
6. No-result state
7. Tap on a saved place -> navigate to detail
8. Tap on a new map API result -> save as official place, then navigate to detail

## `BTM_PLACE_ADD_ENTRY`
Required elements:
1. Add via search
2. Add via map pin
3. Add via photo

## `BTM_PLACE_CATEGORY_PICKER`
Required elements:
1. `맛집`
2. `여행`
3. `놀거리`
4. `특별한 장소`
5. `미분류`

## `BTM_PLACE_HERO_PICKER`
Required elements:
1. Current place image list
2. Tap to change the hero image

## `BTM_PHOTO_PLACE_SELECTOR`
Required elements:
1. Existing place list
2. Search
3. After selection, move to visit form

---

## 12. Popup Details
## `POP_JOIN_MAP_DESTRUCTIVE_CONFIRM`
Message core:
The current active map will be completely deleted and cannot be restored.

## `POP_INVITE_CODE_INVALID`
Message core:
The invite code is invalid, expired, or already used.

## `POP_PLACE_DELETE_REQUEST_CONFIRM`
Message core:
It will be deleted automatically after 3 days, and will be deleted immediately if the partner approves.

## `POP_PLACE_DELETE_APPROVE_CONFIRM`
Message core:
Related visit records, images, and thread messages will also be deleted together.

## `POP_VISIT_DELETE_CONFIRM`
Message core:
If the last visit record is deleted, the place remains in `orphan` state.

## `POP_DISCONNECT_CONFIRM`
Message core:
A read-only snapshot is created after relationship disconnection.

## `POP_LOGOUT_CONFIRM`
Message core:
Auto-login on the current device will be cleared.

## `POP_WITHDRAW_STEP1`
Message core:
Warn that account withdrawal is starting, and guide that disconnection is required first when the user is still connected.

## `POP_WITHDRAW_STEP2`
Message core:
Final confirmation that account, session, profile, personal settings, and snapshots are deleted immediately after withdrawal and cannot be recovered.

## `POP_UNSAVED_EXIT_CONFIRM`
Message core:
Unsaved changes will be lost.

---

## 13. Functional Requirements
## 13-1. Authentication
1. The app must allow access to the main features only after successful Google login.
2. If the session is valid, the login screen must be skipped.
3. If session restoration fails, the user must be sent to the login screen.

## 13-2. Invite / Join
1. Invite code generation, copy, share, and input must all be handled in one Invite Center screen.
2. If a user already connected as a couple attempts to join another map, they must see a destructive warning first.
3. Successful join must immediately reflect invite-code expiration.

## 13-3. Home Exploration
1. The Map tab and List tab must share saved-place-based query and filter state.
2. The Map tab must use a full-screen map with a top floating search box as its default layout.
3. Map-tab search must show `wishlist` / `visited` saved places at the top and current-region map API results below them inside a bottom sheet.
4. List-tab search must target saved `wishlist` / `visited` places only and must not include external map API results.
5. Home screens must define loading, error, and empty states.
6. Delete-requested places must be identifiable in home cards and/or markers.

## 13-4. Place Registration
1. Search-based registration, pin-based registration, and photo-based registration must all be supported.
2. Photo registration must provide both `기존 장소 선택` and `새 장소 생성`.
3. `새 장소 생성` must use a separate screen for name and location input.

## 13-5. Visit Records
1. Visit record creation/editing must be designed as one form experience.
2. Delete action must appear only in edit mode.
3. Saving must validate the total 99-image-per-place limit.

## 13-6. Thread
1. Empty-thread state and first-message encouragement must be explicitly defined.
2. Read-only snapshots must block input and edit/delete actions.

## 13-7. Settings
1. My Page / Settings home must provide access to invite / connection management, notifications, profile, anniversary, logout, and withdrawal.
2. Snapshot re-entry CTA must be provided from My Page or the relationship status card.
3. Withdrawal CTA must be disabled or blocked with prerequisite guidance while still connected.

---

## 14. Acceptance Criteria
1. Main features are blocked in the logged-out state.
2. The Map tab is composed of a full-screen map and a top floating search box.
3. The Map and List tabs share saved-place-based search query and filter state.
4. During Map-tab search, `wishlist` / `visited` saved places appear on top and current-region map API results appear below them in a single bottom sheet.
5. List-tab search targets only `wishlist` / `visited` saved places and does not include external map API results.
6. No duplicate official places are created.
7. The existing-map deletion warning is always shown before joining another map.
8. Final place deletion removes related visits, images, and thread data together.
9. There is no thread edit/delete permission violation.
10. After disconnection, a snapshot is shown automatically and remains read-only.
11. Reconnecting with the same partner allows the user to choose whether to restore.
12. Every screen satisfies the `page_id` and required elements defined in this document.
13. Withdrawal cannot execute while connected and must require disconnection first.

## 14-1. Implementation Review Checklist
The following items are product-level review criteria that do not depend on any specific test tool or dependency.

1. Automatic personal map creation happens only once after the first login.
2. All three onboarding paths work: `초대하기`, `초대받기`, and `나중에 연결하고 먼저 시작`.
3. Reissuing an invite code immediately invalidates the previous one.
4. Joining another map is performed only after the destructive warning.
5. Search results in the Map tab appear in the order `saved places -> current-region additional results`.
6. External map API results do not appear in List-tab search.
7. Selecting a duplicate official place does not create a new place and instead navigates to the existing detail page.
8. After deleting the last visit record, the place remains as `orphan` and can be reactivated.
9. Final place deletion removes visits, images, and thread data together.
10. After disconnection, the snapshot is shown automatically and remains read-only.
11. On reconnecting with the same partner, `복구` and `새로 시작` produce different results.
12. Withdrawal is blocked while connected.

---

## 15. Implementation Priority
1. Authentication / session / onboarding / Invite Center
2. Tab structure and the 3 home screens
3. 4 place-add screens and the visit form
4. Place detail / thread / deletion grace period
5. My Page / notifications / profile / anniversary
6. Disconnection / snapshot / reconnect restore

---
## 16. Design System / Visual Language

### 16.1 Design Intent

The UI of this product should aim for the following visual impression.

- Overall tone: clean, rounded, soft, premium, calm
- Core impression: uncluttered minimalism + large round geometry + subtle glass texture
- Texture direction: not full glassmorphism, but a soft-glass style where only some floating layers are semi-transparent on top of a `solid base`
- Screen impression: spacious, breathable, softly separated, and tactile with rounded interface shapes
- Brand impression: prioritize an organized, lifestyle-friendly, premium feeling over a cold or technical feeling

This design system prioritizes `cleanliness and consistency` over `showiness`.  
In other words, avoid overusing special effects and build quality through spacing, proportion, radius, transparency, and shadow quality.

---

### 16.2 Core Principles

#### Principle 1. Large Round Geometry
- All major interactive elements must feel sufficiently rounded.
- Avoid sharp boxy UI.
- Buttons, cards, inputs, bottom sheets, and tab bars all follow the same radius system.

#### Principle 2. Clean Surface Hierarchy
- Most information is placed on opaque or semi-opaque solid surfaces.
- Glass effects are used only where emphasis or a floating feeling is needed.
- A single screen must not contain too many glass surfaces.

#### Principle 3. Airy Layout
- Do not pack elements too tightly together.
- Spacing is a core tool for revealing information structure.
- It is acceptable for the screen to feel intentionally spacious.

#### Principle 4. Low-Noise Visual Language
- Minimize the number of colors.
- Shadows, borders, blurs, and gradients should all be used lightly.
- A `well-organized impression` takes priority over visible effects.

#### Principle 5. Tactile Interaction
- Every touchable element must have a subtle pressed response.
- Hover / press / focus / disabled states must be clear.
- Reactions must be fast but never exaggerated.

---

### 16.3 Theme Strategy

Default implementation prioritizes Light Mode.

- MVP default: Light theme only
- Dark mode: lower priority. It is not part of the required MVP scope unless explicitly requested.

Core Light theme combination:
- Warm neutral backgrounds
- White / off-white surfaces
- Black or dark charcoal text
- Restrained accent color
- Semi-transparent white layers with subtle blur

---

### 16.4 Color Tokens

The values below are default tokens. Even if brand colors change later, the structure must remain the same.

#### Base
- `color.bg.canvas = #F6F4EF`
- `color.bg.subtle = #F2EFE9`
- `color.surface.primary = #FFFFFF`
- `color.surface.secondary = #FBFAF7`
- `color.surface.tertiary = #F4F1EB`

#### Text
- `color.text.primary = #111111`
- `color.text.secondary = #5F6368`
- `color.text.tertiary = #8B9096`
- `color.text.inverse = #FFFFFF`

#### Border
- `color.border.soft = rgba(17, 17, 17, 0.06)`
- `color.border.strong = rgba(17, 17, 17, 0.12)`
- `color.border.glass = rgba(255, 255, 255, 0.45)`

#### Accent
- `color.accent.primary = #111111`
- `color.accent.secondary = #E9E2D5`
- `color.accent.success = #1F8F5F`
- `color.accent.warning = #C9871A`
- `color.accent.danger = #D64545`

#### Overlay / Glass
- `color.glass.fill = rgba(255, 255, 255, 0.62)`
- `color.glass.fill.strong = rgba(255, 255, 255, 0.78)`
- `color.glass.shadow = rgba(17, 17, 17, 0.08)`
- `color.overlay.dim = rgba(17, 17, 17, 0.18)`

#### Usage Rules
- Body text should always use `color.text.primary` or `color.text.secondary`.
- Do not place long paragraphs directly on glass backgrounds.
- `danger`, `success`, and `warning` colors are for status communication only and must not be overused decoratively.
- A single screen should use only one strong accent color.

---

### 16.5 Typography

#### Font Family
- Default fonts
- iOS: SF Pro
- Android / Web fallback: Pretendard, Inter, system-ui, sans-serif
- In Korean-first environments, Pretendard-family fonts are treated as the default.

#### Type Scale
- `display.l = 32 / 40 / 700`
- `heading.l = 24 / 32 / 700`
- `heading.m = 20 / 28 / 700`
- `title.l = 18 / 26 / 600`
- `title.m = 16 / 24 / 600`
- `body.l = 16 / 24 / 400`
- `body.m = 14 / 22 / 400`
- `body.s = 13 / 20 / 400`
- `caption = 12 / 18 / 500`
- `button.l = 16 / 16 / 600`
- `button.m = 14 / 14 / 600`

#### Typography Rules
- Limit a single screen to roughly four text styles.
- Create title/body contrast through weight and spacing more than size alone.
- Avoid excessive letter-spacing adjustments.
- Tabular numbers may be used for readability on numeric values, prices, and quantities.

---

### 16.6 Spacing System

Use a 4pt-based spacing system.

- `space.1 = 4`
- `space.2 = 8`
- `space.3 = 12`
- `space.4 = 16`
- `space.5 = 20`
- `space.6 = 24`
- `space.8 = 32`
- `space.10 = 40`
- `space.12 = 48`

#### Layout Defaults
- Default horizontal page padding: `20`
- Default internal card padding: `16`
- Section gap: `24`
- Gap between cards: `12`
- Gap between small inline elements: `8`

#### Rules
- Prefer preserving spacing rather than tightening it.
- Inside components, vertical padding should not become tighter than horizontal padding.
- Dense layouts should not be used unless there is a strong reason.

---

### 16.7 Radius System

This product defaults to a strongly rounded interface.

- `radius.xs = 10`
- `radius.sm = 14`
- `radius.md = 18`
- `radius.lg = 24`
- `radius.xl = 28`
- `radius.pill = 9999`

#### Component Radius Rules
- Default button: `18`
- Large CTA button: `20` or `pill`
- Input field: `16`
- Card: `20`
- Large card/panel: `24`
- Bottom sheet top radius: `28`
- FAB / icon button: `pill`

#### Rules
- Do not mix too many radius values within one screen.
- Small elements should stay in the `14~18` range, large panels in the `24~28` range.
- Sharp corners are disallowed by default.

---

### 16.8 Elevation, Shadow, and Glass

#### Shadow Tokens
- `shadow.sm = 0 4 12 rgba(17, 17, 17, 0.06)`
- `shadow.md = 0 10 24 rgba(17, 17, 17, 0.08)`
- `shadow.lg = 0 20 40 rgba(17, 17, 17, 0.10)`

#### Glass Tokens
- `glass.blur = 16px`
- `glass.blur.strong = 24px`
- `glass.saturation = 1.1`
- `glass.border = 1px solid rgba(255,255,255,0.45)`
- `glass.fill = rgba(255,255,255,0.62)`

#### Glass Usage Rules
glass effects are allowed only on the following layers.
- floating tab bar
- search/filter chip container
- modal / bottom sheet header
- overlay card
- mini cart / mini player / floating action surface
- small info badges over images

glass effects must not be used on the following.
- long-form content cards
- entire list cells with dense data
- full input form backgrounds
- table-like screens
- management screens with complex information structure

#### Quality Rules
- Ensure sufficient text contrast on top of glass panels.
- If the background behind a glass panel is too visually busy, increase opacity or switch to a solid surface.
- Do not stack glass panels in double or triple layers.
- On Android or low-performance environments, use a solid fallback if blur is unstable.

#### Fallback
When blur is unsupported, fall back to the following.
- background: `rgba(255,255,255,0.92)`
- border: `1px solid rgba(17,17,17,0.06)`
- shadow: `shadow.sm`

---

### 16.9 Iconography and Imagery

#### Icons
- Style: outline first
- Stroke weight: `1.75 ~ 2.0`
- Use rounded cap/join
- Default icon sizes
- small: 16
- default: 20
- large: 24

#### Images
- Most image corners use `20~24` radius.
- Product/place/profile images use rounded rectangles or circles.
- Minimize text overlays on images.
- Badges or actions over images may use glass mini-surfaces.

---

### 16.10 Component Standards

#### Buttons

##### Primary Button
- Usage: most important CTA
- Height: `52`
- Padding: `0 20`
- Background: `#111111`
- Text: `#FFFFFF`
- Radius: `20` or `pill`
- Shadow: none or `shadow.sm`

##### Secondary Button
- Usage: secondary CTA
- Height: `48`
- Background: `#FFFFFF`
- Text: `#111111`
- Border: `1px solid rgba(17,17,17,0.08)`
- Radius: `18`

##### Glass Button
- Usage: floating action, overlay action
- Height: `44 ~ 48`
- Background: `color.glass.fill`
- Blur: `glass.blur`
- Border: `color.border.glass`
- Radius: `pill`

##### Ghost Button
- Usage: text-like secondary action
- Background: transparent
- Text: `color.text.primary`
- On pressed, reveal only a subtle background

##### Disabled
- Opacity: `0.45`
- Non-clickable
- Remove shadow in disabled state

#### Icon Buttons
- Size: `40 / 44 / 48`
- Shape: circle or rounded square
- Floating actions may use glass
- Default icon size: `20`

#### Inputs
- Height: `48`
- Background: `rgba(255,255,255,0.78)` or `#FFFFFF`
- Border: `1px solid rgba(17,17,17,0.06)`
- Radius: `16`
- Internal horizontal padding: `14~16`
- Placeholder: `color.text.tertiary`
- Focus border: `rgba(17,17,17,0.16)`
- Focus outer ring: `0 0 0 4 rgba(17,17,17,0.05)`

#### Cards
- Background: solid surface first
- Radius: `20`
- Padding: `16`
- Shadow: `shadow.sm`
- Border: optional `color.border.soft`
- Keep card internals simple in the order `image / title / supporting info / action`

#### Chips / Filters
- Height: `36 ~ 40`
- Radius: `pill`
- Unselected: soft surface
- Selected: dark fill or accent fill
- Filter chip groups may sit on a glass container

#### Bottom Tab Bar
- Prefer a floating style
- Height: `64 ~ 72`
- Floating placement with horizontal margins
- Background: glass surface
- Blur: `16 ~ 24`
- Radius: `24 ~ 28`
- Only active icon/label should be emphasized strongly
- Maximum number of tabs: 5

#### Modal / Bottom Sheet
- Backdrop: `color.overlay.dim`
- Sheet background: `#FFFFFF` or strong glass
- Top corner radius: `28`
- Drag handle required
- Internal sheet padding: `20`
- Respect bottom safe area

#### Toast / Snackbar
- Provide only short and clear feedback
- Use dark solid or soft glass without being overly loud
- Radius: `16`
- Maximum 1-2 lines of text

---

### 16.11 Layout Rules

#### Page Layout
- Keep the top area spacious rather than cramped.
- Use card-based UI by default, but avoid stacking cards too densely.
- When content is sparse, prefer top alignment with generous top spacing over centered alignment.

#### List
- Default list row height: `64+`
- Row internal padding: `16`
- Use dividers only when necessary
- Prefer expressing structure through spacing and card separation over dividers

#### Grid
- Default to a 2-column mobile grid
- Gutter: `12`
- Prevent card heights from becoming too inconsistent
- Keep image ratios consistent

---

### 16.12 Motion System

Animation is used to improve finish quality, not to create spectacle.

#### Timing
- fast: `120ms`
- normal: `180ms`
- emphasis: `240ms`
- bottom sheet / modal entrance: `280 ~ 320ms`

#### Easing
- Default: `ease-out`
- Entering: soft deceleration
- Exiting: quick cleanup
- Springs should be used only in limited cases such as bottom sheets, card expansion, or toggle transitions

#### Interaction Rules
- Button press scale: `0.98`
- Increase icon-button background opacity on press
- On card tap, use a subtle scale-down and shadow reduction
- Avoid exaggerated parallax or bounce in screen transitions

---

### 16.13 States

All interactive elements must support the following states.

- default
- pressed
- focused
- disabled
- loading
- selected
- error (when needed)

#### State Rules
- pressed: subtle response through size or background
- focused: clearly visible for keyboard / accessibility navigation
- loading: keep the layout stable and show spinner or skeleton
- error: communicate not only with color, but also with message or icon

---

### 16.14 Accessibility Rules

- Aim for WCAG AA contrast or better for body text against background.
- Text on glass surfaces must achieve stronger contrast than on solid surfaces.
- Do not use fonts smaller than 12px except for tiny captions.
- Touch targets must be at least `44x44`.
- If blur/transparency interferes with information delivery, reduce it immediately.
- Do not rely on color alone to communicate state.
- Modals and bottom sheets must provide focus trap behavior and a clear dismissal path.

---

### 16.15 Do / Don't

#### Do
- Keep generous spacing.
- Use radius consistently.
- Use glass only in limited floating layers.
- Keep card/button/input proportions consistent.
- Reveal information structure through spacing rather than borders.

#### Don't
- Do not make every surface semi-transparent.
- Do not combine strong shadows and strong blur on the same element.
- Do not mix many radius systems on one screen.
- Do not overuse gray until the whole UI looks washed out.
- Do not overuse decorative gradients.

---

### 16.16 AI Implementation Rules

An AI coding agent implementing this design system must follow the rules below.

- Do not invent a new color system arbitrarily.
- Do not improvise radius/shadow/spacing values. Always use tokens.
- Apply glass effects only on the designated layers.
- If text readability suffers, prefer solid surfaces over glass.
- When creating a new component, reuse and compose the existing button/card/input styles.
- Do not run different visual experiments per screen. The visual language must remain consistent across the entire app.
- When the design is ambiguous, decide toward `simpler and more organized`, not `more decorative`.

---

### 16.17 Default Screen Composition Pattern

The default screen composition pattern follows the order below.

1. A header with generous top spacing
2. Core action or state summary
3. Main content cards / lists
4. Floating filter / search / action when needed
5. Bottom CTA or floating tab bar

In short, this product uses a `header - content - floating action` structure by default, and avoids complex toolbars and excessive supporting information.

---

## 17. Final Review Summary
Key calibrations reflected in the final integrated version:
1. Integrated `page_id`, bottom sheets, popups, and per-screen required elements from previously split documents into this single document.
2. Fixed `PG_PLACE_CREATE_FROM_PHOTO` as a separate screen to isolate responsibility in the photo registration flow.
3. Fixed `PG_RECONNECT_RESTORE_DECISION` as a separate screen so reconnect restore decisions can be made with sufficient information.
4. Fixed `PG_INVITE_CENTER` as an integrated generation/input screen to simplify invite UX.
5. Fixed Map/List tabs as a dual-view structure sharing the same core state.
6. Promoted permission denied, OS notification OFF, network disconnection, and read-only differentiation rules into common UX rules.
7. Clarified the boundaries among tab roots, common stack screens, and conditional relationship-state-only screens to reduce routing interpretation differences.
8. Reinforced Invite Center state branching, active-filter summaries in home, thread permissions in place detail, and notification/nickname/anniversary states in settings.
9. Fixed the map home as a full-screen map plus top floating search structure to remove wasted layout space.
10. Clarified search purpose by splitting map-home search into `saved places first + current region map API results` and list-home search into saved places only.
11. Added implementation-environment-light sections for `Agent Working Principles`, `Core Data Model`, `Navigation & Params Matrix`, `State Ownership`, and `Implementation Review Checklist` to reduce interpretation gaps even when the agent works only from this document.

Implementation and review should proceed using this document as the sole source of truth, without additional documents.
