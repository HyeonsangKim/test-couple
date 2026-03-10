# PRD 개선안 v1
## 커플 공유 지도 앱 후속 작업 문서 2026-03-10

문서 상태: 후속 작업 문서  
문서 원칙: 이 문서는 `prd_v2.md`의 후속 작업 문서다. 이 문서는 본 PRD를 대체하지 않고, 2026-03-10 기준 구현 불일치와 필수 보강 사항을 정의한다.  
언어 원칙: 이 문서는 한글 전용 문서다. 코드 식별자, 파일 경로, 타입, API 이름만 원문 표기를 유지한다.

---

## 1. 문서 목적

이 문서는 현재 프로젝트가 `prd_v2.md`를 충분히 만족하지 못하는 영역을 정리하고, Claude Code가 바로 구현할 수 있는 수준으로 수정 범위, 구현 규칙, 완료 조건, 검증 기준을 명시한다.

핵심 목표:
1. 리뷰에서 식별된 9개 핵심 이슈를 PRD 기준으로 해소한다.
2. 한 이슈를 고치는 과정에서 반드시 함께 정리해야 하는 연관 규칙을 명시한다.
3. 화면별 수정 지시가 아니라, 도메인 규칙과 화면 책임이 함께 정렬되도록 작업 순서를 제공한다.

## 1-1. 에이전트 작업 원칙

1. 제품 동작의 단일 기준은 `prd_v2.md`다.
2. 이 문서는 PRD의 후속 보강 문서이며, PRD와 충돌하면 PRD를 우선한다.
3. UI만 수정하고 서비스 규칙을 남겨두는 방식은 허용하지 않는다.
4. 권한, 제한, 상태 전환, 데이터 정리는 가능하면 service/store 레이어에서 보장한다.
5. mock 환경이라도 입력값, 출력값, 상태 전환 의미는 실제 서비스 수준으로 유지한다.
6. 구현 중 새 규칙이 필요하면 먼저 PRD 또는 이 문서를 갱신한 뒤 작업한다.

---

## 2. 문서 적용 범위

## 2-1. 1차 작업 범위

이 문서의 1차 범위는 아래 9개 핵심 이슈다.

1. 스레드 작성자 권한이 서비스 레이어에서 강제되지 않음
2. 연결된 사용자가 다른 지도에 재합류할 수 있는 경로가 없음
3. `joinMap`이 실제로 대상 지도로 전환하지 않음
4. 플레이스 최종 삭제 시 방문기록, 이미지, 스레드가 함께 삭제되지 않음
5. 연결 해제 후 스냅샷 생성과 자동 진입 흐름이 PRD와 다름
6. 지도 탭 검색에 바텀시트, 외부 결과, 정렬, 중복 제거 규칙이 없음
7. 사진 기반 등록에서 기존 장소 선택 시 사진이 방문 폼으로 이어지지 않음
8. 플레이스당 총 99장 이미지 제한이 저장 규칙으로 강제되지 않음
9. 연결 중 회원탈퇴 차단과 2단계 확인이 없음

## 2-2. 사용자 확정 사항

2026-03-10 기준으로 아래 사항은 사용자와 합의되었다.

1. mock 데이터 구조는 이번 작업에서 크게 바꿔도 된다.
2. 스냅샷 복구는 `연결이 끊긴 동일한 두 사람`이 다시 재결합할 때만 지원한다.
3. 지도 검색 결과 UI는 별도 컴포넌트로 분리한다.
4. 파괴적 확인 UI는 가능한 한 동일한 confirm 컴포넌트 계열로 통일한다.

## 2-3. 이번 단계의 비범위

이번 문서의 1차 범위에는 포함하지 않지만, 후속 정렬 과제로 남겨둘 항목은 아래와 같다.

1. 프로필 화면의 카메라 촬영과 권한 거부 대응
2. 알림 설정 화면의 OS 알림 권한 꺼짐 안내
3. 기념일 화면의 solo 안내 상태 정교화
4. 실제 Apple 검색 연동

---

## 3. 개선 목표

## 3-1. 목표

1. 초대, 합류, 지도 전환, 삭제, 스냅샷, 탈퇴 같은 핵심 규칙이 UI와 서비스 양쪽에서 일치하도록 만든다.
2. `PG_INVITE_CENTER`, `PG_HOME_MAP`, `PG_PLACE_DETAIL`, `PG_VISIT_FORM`, `PG_RELATIONSHIP_DISCONNECT`, `PG_SNAPSHOT_READONLY`, `PG_RECONNECT_RESTORE_DECISION`, `PG_MY_HOME`이 PRD 책임에 맞게 동작하도록 만든다.
3. 이후 백엔드 연동 시 service 교체만으로 유지될 수 있도록 mock 구조와 상태 구조를 정리한다.

## 3-2. 이번 단계에서 하지 않는 것

1. 외부 검색을 실제 Apple Maps API에 붙이는 작업
2. 디자인 시스템 전면 개편
3. 테스트 프레임워크 신규 도입
4. PRD에 없는 새로운 화면 개념 추가

---

## 4. 구조 보강 원칙

## 4-1. 상태 소유권 보강

PRD state ownership에 맞춰 최소 아래 방향으로 정리한다.

1. entity data는 `usePlaceStore`, `useVisitStore`, `useThreadStore`, `useMapStore`, `useSnapshotStore`가 가진다.
2. 홈 검색과 필터는 shared state로 분리한다.
3. 지도 전용 상태는 map-only state로 분리한다.
4. 사진 플로우 임시 데이터와 영속 데이터는 같은 key나 같은 책임 안에 섞지 않는다.

## 4-2. 확인 UI 보강

파괴적 확인과 이탈 확인은 가능한 한 동일한 confirm 컴포넌트 계열로 통일한다.

권장:

1. `ConfirmModal` 재사용
2. 재합류 경고
3. 회원탈퇴 2단계 확인
4. 방문 폼 이탈 확인

## 4-3. 검색 provider 분리 원칙

현재 코드는 `react-native-maps`를 사용하고 있으며 `provider`를 명시하지 않았다. 따라서 iOS에서는 기본 provider 경로를 따른다.

하지만 지도 렌더링과 플레이스 검색은 같은 책임이 아니다.

이번 단계의 원칙:

1. 이번 작업에서는 `mock search service`로 검색 UX를 완성한다.
2. 실제 검색 provider는 service 레이어 뒤로 숨긴다.
3. 후속 실제 연동 시 아래 둘 중 하나로 교체한다.
   - native iOS bridge를 통한 `MKLocalSearch`
   - 서버를 통한 Apple Maps Server API
4. 지도 렌더링 provider와 검색 provider를 같은 구현으로 강제하지 않는다.

---

## 5. 도메인 규칙 보강

## 5-1. 지도, 연결, 초대 코드 보강

관련 PRD:

1. `6-1. 지도/연결`
2. `6-2. 초대 코드`
3. `PG_ONBOARDING_HUB`
4. `PG_INVITE_CENTER`

### 현재 문제

1. 연결된 사용자는 초대 센터에서 다른 초대 코드를 입력할 수 없다.
2. `joinMap`이 전달받은 대상 지도를 사용하지 않는다.
3. 기존 활성 지도를 삭제하고 대상 지도로 전환하는 규칙이 없다.
4. 지도당 최대 2명 제한과 활성 지도 1개 제한이 서비스에서 충분히 보장되지 않는다.

### 필수 보강 규칙

1. 연결된 상태에서도 `PG_INVITE_CENTER` 하단 입력 영역은 유지한다.
2. 다른 지도 합류 시 현재 활성 지도가 완전히 삭제된다는 경고를 먼저 보여야 한다.
3. 사용자는 활성 지도 1개만 가진다.
4. 하나의 지도는 최대 2명만 가진다.
5. 초대 성공 시 코드는 즉시 `used` 또는 이에 준하는 비활성 상태가 된다.
6. 현재 지도가 2명으로 연결된 경우 코드 생성과 재발급 영역은 숨긴다.

### 구현 메모

현재 `mapService`는 단일 `currentMap`만 가지고 있어 여러 지도 존재를 표현할 수 없다.

이번 작업에서는 mock 구조를 아래처럼 재설계한다.

1. `maps: SharedMap[]`
2. `activeMapIdByUserId: Record<string, string | null>`
3. `inviteCodes: InviteCode[]`

`joinMap(targetMapId, userId)`는 아래 순서를 따라야 한다.

1. 현재 사용자의 활성 지도 조회
2. 대상 지도 존재 여부 검증
3. 대상 지도 인원 수 검증
4. 현재 활성 지도와 대상 지도가 다르면 기존 활성 지도 완전 삭제
5. 사용자의 활성 지도를 대상 지도로 전환
6. 대상 지도에 사용자 추가
7. 사용한 초대 코드 비활성화

온보딩 경로도 함께 수정한다.

1. `초대하기` 선택 시 지도 생성
2. 생성 직후 `PG_INVITE_CENTER` 진입
3. 바로 `PG_HOME_MAP`으로 보내지 않음

### 영향 파일

- `src/app/(auth)/welcome.tsx`
- `src/app/(main)/invite-center.tsx`
- `src/services/mapService.ts`
- `src/services/inviteService.ts`
- `src/stores/useMapStore.ts`
- `src/stores/useInviteStore.ts`
- 필요 시 `src/mock/data/*`

### 완료 조건

1. 연결된 사용자도 다른 코드 입력 시도를 할 수 있다.
2. 다른 지도 합류 전 파괴적 확인이 항상 뜬다.
3. 합류 후 활성 지도는 대상 지도로 바뀐다.
4. 기존 활성 지도는 삭제된다.
5. 사용한 코드는 재사용되지 않는다.
6. 지도당 2명 제한이 유지된다.

## 5-2. 플레이스 최종 삭제 보강

관련 PRD:

1. `6-9. 플레이스 삭제 요청`
2. `PG_PLACE_DETAIL`

### 현재 문제

1. 최종 삭제 시 플레이스만 삭제된다.
2. 방문기록, 방문 이미지, 스레드 메시지가 고아 데이터로 남는다.
3. 만료된 삭제 요청이 실제 최종 삭제로 이어지지 않는다.

### 필수 보강 규칙

1. 최종 삭제는 플레이스, 방문기록, 이미지, 스레드를 함께 제거해야 한다.
2. 3일 유예 규칙과 상대 승인 즉시 삭제를 유지한다.
3. 만료 체크는 앱 시작, 앱 foreground 복귀, place load 시점에 반영한다.

### 구현 메모

연쇄 삭제를 단일 책임으로 묶는다.

권장 순서:

1. `placeId`에 연결된 `visitIds` 조회
2. 해당 `visitIds`에 속한 방문 이미지 삭제
3. 해당 `placeId`에 속한 스레드 메시지 삭제
4. 플레이스 삭제

`checkExpiredDeleteRequests`는 조회용 helper에 머물지 않고 실제 삭제 동작으로 연결한다.

### 영향 파일

- `src/services/placeService.ts`
- `src/services/visitService.ts`
- `src/services/threadService.ts`
- `src/stores/usePlaceStore.ts`
- `src/app/(main)/place/[id].tsx`
- 필요 시 `src/app/_layout.tsx`

### 완료 조건

1. 삭제 승인 후 연관 방문기록, 이미지, 스레드가 모두 함께 제거된다.
2. 만료된 삭제 요청은 실제로 자동 삭제된다.
3. 삭제 후 재진입 시 관련 고아 데이터가 보이지 않는다.

## 5-3. 연결 해제, 스냅샷, 재연결 복구 보강

관련 PRD:

1. `6-10. 연결 해제 / 스냅샷`
2. `PG_RELATIONSHIP_DISCONNECT`
3. `PG_SNAPSHOT_READONLY`
4. `PG_RECONNECT_RESTORE_DECISION`

### 현재 문제

1. 스냅샷 생성 시 방문 이미지와 스레드 메시지가 비어 있다.
2. 연결 해제 직후 온보딩으로 이동한다.
3. 스냅샷을 자동 표시하지 않는다.
4. `복구`와 `새로 시작`의 실제 결과가 분기되지 않는다.

### 필수 보강 규칙

1. 연결 해제 시 읽기 전용 스냅샷을 생성한다.
2. 연결 해제 직후 스냅샷 화면으로 자동 이동한다.
3. 스냅샷에는 해당 관계의 장소, 방문기록, 이미지, 메모가 함께 들어간다.
4. 스냅샷 복구는 `연결이 끊긴 동일한 두 사람`이 다시 재결합할 때만 허용한다.
5. 다른 사람과 새로 연결하는 경우 restore 선택지를 노출하지 않는다.

### 구현 메모

disconnect 전에 아래를 모두 수집해 snapshot에 넣는다.

1. 현재 지도에 속한 플레이스
2. 그 플레이스에 속한 방문기록
3. 그 방문기록에 속한 방문 이미지
4. 그 플레이스에 속한 스레드 메시지

disconnect 완료 후 이동 규칙:

1. snapshot 생성
2. 지도 연결 해제
3. `router.replace('/snapshot/[snapshotId]')`
4. `setOnboarded(false)` 제거

restore eligibility는 `same partner pair` 기준으로 판정한다.

`복구`와 `새로 시작`은 mock 단계에서도 결과 상태가 명확히 달라야 한다.

### 영향 파일

- `src/app/(main)/settings/disconnect.tsx`
- `src/app/snapshot/[id].tsx`
- `src/app/(main)/reconnect/restore.tsx`
- `src/services/snapshotService.ts`
- `src/services/visitService.ts`
- `src/services/threadService.ts`
- `src/stores/useSnapshotStore.ts`

### 완료 조건

1. 연결 해제 직후 스냅샷 화면으로 자동 이동한다.
2. 스냅샷에는 방문 이미지와 스레드 메시지가 포함된다.
3. 스냅샷은 읽기 전용으로만 동작한다.
4. 동일한 두 사람 재결합에서만 restore 분기가 노출된다.
5. `복구`와 `새로 시작`의 결과가 실제로 다르다.

## 5-4. 사진 기반 등록, 방문 폼, 대표 이미지, 99장 제한 보강

관련 PRD:

1. `6-5. 방문기록/이미지`
2. `PG_PLACE_ADD_PHOTO`
3. `PG_PLACE_CREATE_FROM_PHOTO`
4. `PG_VISIT_FORM`

### 현재 문제

1. 기존 장소 선택 시 사진이 방문 폼으로 이어지지 않는다.
2. 플레이스당 총 99장 제한이 저장 규칙으로 강제되지 않는다.
3. edit mode 이미지 변경이 실제 저장에 반영되지 않는다.
4. 사진 기반 신규 생성 시 대표 이미지 id를 잘못 저장한다.

### 필수 보강 규칙

1. 기존 장소 선택 시 선택한 사진이 방문 폼으로 이어져야 한다.
2. 플레이스 전체 기준 99장 제한을 저장 시점에서 검사해야 한다.
3. 첫 이미지는 자동 대표 이미지가 되어야 한다.
4. 대표 이미지 id는 실제 저장된 image id를 기준으로 써야 한다.

### 구현 메모

`PG_VISIT_FORM`은 `draftImageUris`를 받아 create mode 초기값에 병합한다.

99장 제한은 저장 시점 기준으로 계산한다.

1. create mode:
   - `existingPlaceImageCount + newImages <= 99`
2. edit mode:
   - 현재 visit의 기존 이미지 수를 감안해 재계산

edit mode는 아래 동작을 실제로 수행해야 한다.

1. 기존 visit 이미지 조회
2. 삭제된 이미지 제거
3. 새 이미지 추가
4. 폼 상태와 최종 저장 상태 일치

사진 기반 신규 생성 시:

1. `addImages` 반환값에서 실제 생성된 첫 번째 `imageId` 획득
2. 그 값을 `heroImageId`로 저장

### 영향 파일

- `src/app/(main)/place/add/photo/index.tsx`
- `src/app/(main)/visit/form.tsx`
- `src/app/(main)/place/add/photo/create.tsx`
- `src/stores/useVisitStore.ts`
- `src/services/visitService.ts`
- `src/stores/usePlaceStore.ts`

### 완료 조건

1. 기존 장소 선택 후 방문 폼에서 사진이 유지된다.
2. 플레이스 전체 기준 99장 제한이 저장 시 적용된다.
3. edit mode 이미지 추가와 삭제가 실제로 반영된다.
4. 사진 기반 신규 생성 후 대표 이미지가 정상 표시된다.

## 5-5. 지도 탭 검색, 검색 상태 공유, 검색 결과 시트 보강

관련 PRD:

1. `6-7. 검색 / 필터 / 정렬`
2. `10-1. 상태 소유권 원칙`
3. `PG_HOME_MAP`
4. `PG_HOME_LIST`
5. `BTM_MAP_SEARCH_RESULTS`

### 현재 문제

1. 지도 탭은 저장된 플레이스 마커만 보여준다.
2. 검색 결과 바텀시트가 없다.
3. 현재 지도 구역 기준 외부 결과가 없다.
4. 저장 결과 우선 정렬과 중복 제거가 없다.

### 필수 보강 규칙

1. 지도와 리스트는 저장 플레이스 기반 검색어와 필터 상태를 공유한다.
2. 지도 탭은 현재 보이는 구역의 외부 검색 결과를 추가로 가진다.
3. 결과는 `저장된 플레이스 -> 이 구역의 추가 결과` 순서로 바텀시트에 보인다.
4. 이미 저장된 공식 플레이스는 외부 결과에 중복 노출되면 안 된다.

### 구현 메모

상태를 아래처럼 분리한다.

1. shared state
   - `homeSearchQuery`
   - `homeStatusFilter`
   - `homeCategoryFilter`
2. map-only state
   - `mapRegion`
   - `mapVisibleBounds`
   - `mapApiResults`
   - `mapSearchSheetOpen`

권장:

1. `usePlaceStore`는 entity data 중심으로 유지
2. 새 `useHomeStore` 또는 `useSearchStore` 추가

검색 구현 전략:

1. 이번 단계에서는 `mock search service`로 검색 UX 완성
2. 검색 결과 UI는 별도 컴포넌트로 분리
3. 예시 파일명:
   - `src/components/map/MapSearchResultsSheet.tsx`
4. 지도 화면은 검색 입력과 상태 관리에 집중
5. 시트 컴포넌트가 `저장된 플레이스`와 `이 구역의 추가 결과` section을 렌더링

리스트 탭 규칙:

1. 리스트 탭에는 외부 결과를 섞지 않는다.
2. 리스트는 저장된 `wishlist`, `visited`만 대상으로 유지한다.

### 영향 파일

- `src/app/(tabs)/map.tsx`
- `src/app/(tabs)/list.tsx`
- `src/hooks/useFilteredPlaces.ts`
- `src/services/mapService.ts`
- 필요 시 `src/stores/*`
- 필요 시 `src/components/map/*`

### 완료 조건

1. 지도 검색 시 바텀시트가 열린다.
2. 저장된 결과가 먼저 나온다.
3. 외부 결과는 현재 지도 구역 기준이다.
4. 저장된 공식 플레이스는 외부 결과에 중복 노출되지 않는다.
5. 리스트 검색에는 외부 결과가 나오지 않는다.

## 5-6. 마이페이지와 회원탈퇴 보강

관련 PRD:

1. `6-11. 계정 / 설정`
2. `PG_MY_HOME`

### 현재 문제

1. 연결 중에도 회원탈퇴 CTA가 그대로 노출된다.
2. 단일 확인창만 있다.
3. store와 service 레벨에서 연결 중 탈퇴를 막지 않는다.

### 필수 보강 규칙

1. 연결 중에는 회원탈퇴를 실행할 수 없다.
2. 먼저 연결 해제를 요구해야 한다.
3. 탈퇴는 2단계 확인으로 진행해야 한다.
4. 탈퇴 시 계정, 세션, 프로필, 개인 설정, 스냅샷을 삭제해야 한다.

### 구현 메모

UI 규칙:

1. 연결 중이면 탈퇴 CTA를 disabled 또는 blocked guidance 형태로 제공
2. 클릭 시 `먼저 연결 해제가 필요` 안내만 표시
3. 연결 중에는 탈퇴 2단계 flow로 진입하지 않음

확인 UI 규칙:

1. `ConfirmModal` 재사용 방향으로 고정
2. 1단계: 탈퇴 시작 경고
3. 2단계: 복구 불가 최종 확인

서비스 규칙:

1. `authStore.withdraw()` 또는 service에서 연결 중 탈퇴를 예외 또는 실패로 처리
2. snapshots와 notification settings도 정리

### 영향 파일

- `src/app/(tabs)/my.tsx`
- `src/stores/useAuthStore.ts`
- `src/services/authService.ts`
- 필요 시 `src/stores/useMapStore.ts`

### 완료 조건

1. 연결 중에는 회원탈퇴가 실행되지 않는다.
2. 연결 해제 선행 안내가 뜬다.
3. solo 또는 disconnected 상태에서만 2단계 확인 후 탈퇴된다.

## 5-7. 플레이스 상세 스레드 권한과 수정 기능 보강

관련 PRD:

1. `6-6. 스레드`
2. `PG_PLACE_DETAIL`

### 현재 문제

1. service는 작성자 검증 없이 메시지 수정과 삭제를 허용한다.
2. UI는 delete만 부분적으로 숨기고 있고 edit 흐름은 없다.

### 필수 보강 규칙

1. 작성자만 edit와 delete가 가능해야 한다.
2. edit history는 저장하지 않는다.
3. 플레이스당 single shared thread를 유지한다.

### 구현 메모

service 시그니처 변경:

1. `updateMessage(messageId, actorUserId, body)`
2. `deleteMessage(messageId, actorUserId)`

검증 규칙:

1. 대상 메시지 조회
2. `authorUserId !== actorUserId`면 실패
3. 작성자일 때만 수정과 삭제 허용

UI 규칙:

1. 내 메시지에만 edit와 delete CTA 표시
2. edit 저장 시 body 갱신
3. 간단한 modal 또는 input 방식 허용

### 영향 파일

- `src/services/threadService.ts`
- `src/stores/useThreadStore.ts`
- `src/app/(main)/place/[id].tsx`

### 완료 조건

1. 비작성자는 수정과 삭제를 할 수 없다.
2. 작성자는 수정과 삭제를 할 수 있다.
3. 수정 후 `updatedAt`이 반영된다.
4. edit history는 별도 저장하지 않는다.

---

## 6. 화면 및 시스템 보강 규칙

## 6-1. 온보딩 경로 보강

1. `초대하기`는 지도 생성 후 `PG_INVITE_CENTER`로 진입
2. `초대받기`는 즉시 `PG_INVITE_CENTER`로 진입
3. `나중에 연결하고 먼저 시작`만 `PG_HOME_MAP`으로 간다

## 6-2. 스냅샷 화면 보강

1. 상대 이름
2. 생성 날짜
3. 읽기 전용 안내
4. 편집 불가 상태의 시각적 구분

## 6-3. 방문 폼 이탈 확인

`PG_VISIT_FORM`에는 `POP_UNSAVED_EXIT_CONFIRM`를 추가하는 것을 강하게 권장한다.

## 6-4. 검색 결과 시트 책임

`BTM_MAP_SEARCH_RESULTS`는 아래 책임을 가진다.

1. query header
2. `저장된 플레이스` section
3. `이 구역의 추가 결과` section
4. 저장 결과 우선 정렬
5. 공식 플레이스 중복 제거

---

## 7. 수용 기준

## 7-1. 제품 수용 기준

이번 작업은 아래 조건이 충족되어야 완료로 본다.

1. 활성 지도 1개 규칙이 지켜진다.
2. 다른 지도 합류 전 파괴적 확인이 항상 뜬다.
3. 플레이스 최종 삭제 시 방문기록, 이미지, 스레드가 함께 제거된다.
4. 연결 해제 후 스냅샷이 자동 표시되고 읽기 전용으로 유지된다.
5. 동일한 두 사람 재결합 시에만 `복구`와 `새로 시작` 분기가 제공된다.
6. 지도 검색은 저장 결과 우선 바텀시트 구조를 가진다.
7. 기존 장소 선택 시 사진이 방문 폼으로 유지된다.
8. 플레이스당 총 99장 제한이 강제된다.
9. 연결 중 회원탈퇴가 차단된다.
10. 작성자 전용 스레드 edit, delete가 보장된다.

## 7-2. 구현 리뷰 체크리스트

1. 초대 코드 생성, 재발급, 합류, used 처리가 모두 동작한다.
2. 연결 상태에서도 재합류 입력이 가능하다.
3. 다른 지도 합류 후 기존 활성 지도는 제거된다.
4. 최종 삭제 후 관련 고아 데이터가 남지 않는다.
5. disconnect 직후 snapshot route로 이동한다.
6. snapshot에 방문 이미지와 메모가 포함된다.
7. restore eligibility는 same partner pair 기준으로 동작한다.
8. Map 탭 검색에는 외부 결과가 포함되지만 List 탭 검색에는 포함되지 않는다.
9. edit mode 이미지 수정이 실제 저장 결과와 일치한다.
10. 탈퇴는 연결 중 차단되고 2단계 확인을 거친다.
11. 서비스 레이어에서도 스레드 작성자 권한이 강제된다.

---

## 8. 구현 우선순위

1. mock map, invite 데이터 구조 재설계
2. 초대 센터와 재합류 규칙 정비
3. 플레이스 연쇄 삭제 orchestration
4. 스냅샷 생성, 연결 해제, 복구 분기 정비
5. 사진 기반 등록과 방문 폼 정비
6. 지도 검색 상태와 결과 시트 구현
7. 회원탈퇴 차단과 2단계 확인
8. 스레드 권한과 수정 기능
9. 검증과 정리

---

## 9. 검증 방식

## 9-1. 필수 명령

```bash
npm install
./node_modules/.bin/tsc --noEmit
```

## 9-2. 수동 검증 항목

1. 로그인 후 온보딩 3개 경로 확인
2. 초대 코드 생성, 재발급, 합류, used 처리
3. 연결 상태 재합류 경고
4. 플레이스 연쇄 삭제
5. 연결 해제 후 스냅샷 자동 진입
6. 스냅샷 읽기 전용 유지
7. 복구와 새로 시작 결과 차이
8. 기존 장소 사진 흐름에서 draft image 유지
9. 99장 제한 강제
10. 지도 검색 바텀시트, 정렬, 중복 제거
11. 연결 중 회원탈퇴 차단과 2단계 확인
12. 스레드 작성자 전용 edit, delete

---

## 10. Claude Code 직접 지시

다음 원칙으로 구현한다.

1. 먼저 `prd_v2.md`와 이 문서를 함께 읽고 시작할 것
2. 화면만 부분 수정하지 말고 store와 service 규칙을 먼저 바로잡을 것
3. mock 단계라도 실제 API 교체를 고려해 함수 시그니처와 책임을 분리할 것
4. 한 이슈를 고치면서 인접 PRD 조건이 깨지지 않게 통합적으로 수정할 것
5. 파괴적 확인 UI는 가능한 한 동일한 confirm 컴포넌트로 통일할 것
6. 지도 검색 결과 UI는 별도 컴포넌트로 분리할 것
7. 스냅샷 복구는 동일한 두 사람의 재결합 경우에만 노출하고 실행할 것
8. 작업 완료 후에는 파일별 변경 목록보다 PRD 수용 기준 충족 여부 중심으로 보고할 것
