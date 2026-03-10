# PRD v2
## 커플 공유 지도 앱 MVP 최종본 v2

문서 상태: 최종 확정본  
문서 원칙: 앞으로 이 문서만 수정한다. 이 문서가 화면, 정책, UX의 단일 기준이다.

---

## 1. 문서 목적
이 문서는 에이전트가 바로 구현할 수 있는 수준으로 앱의 범위, 도메인 규칙, 사용자 흐름, 화면 구조, `page_id`, 팝업/바텀시트, 전역 UX 원칙을 확정한다.

핵심 목표:
1. 출시 가능한 MVP 수준의 완성도
2. 가장 간단하면서도 유려한 UX
3. 구현 난이도 최소화

## 1-1. 에이전트 작업 원칙
1. 이 문서는 제품 동작, 화면 책임, 데이터 의미, 상태 소유권의 기준 문서다.
2. 외부 연동 방식, 저장소 형태, 테스트 프레임워크 같은 구현 환경 의존 세부사항은 이 문서에서 고정하지 않는다.
3. 구현 환경 의존 세부사항은 서비스 레이어 또는 인프라 설정에 격리해야 하며, 이 문서의 `page_id`, 화면 책임, 도메인 규칙을 바꾸면 안 된다.
4. 문서에 없는 새로운 화면, 팝업, 바텀시트, 도메인 규칙이 필요하면 먼저 이 문서를 갱신한 뒤 구현한다.
5. 문서에 명시되지 않은 UI 세부 선택이 필요하면 새 개념을 추가하기보다 기존 화면/상태/컴포넌트의 재사용을 우선한다.
6. 라우트 전달 방식, 저장소 구현, 네트워크 라이브러리 선택은 구현 자유도에 속하지만, 여기서 정의한 입력값과 출력 결과는 유지해야 한다.

---

## 2. 제품 한 줄 정의
커플이 함께 가고 싶은 곳과 다녀온 곳을 하나의 공유 지도에 저장하고, 방문 기록, 사진, 메모를 장소 단위로 누적하는 기록 앱.

---

## 3. 제품 원칙
1. 로그인은 구글 소셜 로그인만 지원한다.
2. 비로그인 상태는 앱 사용을 허용하지 않는다.
3. 자동 로그인은 항상 유지한다.
4. 첫 로그인 직후 사용자의 개인 지도는 자동 생성된다.
5. 온보딩은 `초대하기`와 `초대받기`를 우선 노출한다.
6. 상대 연결 전에도 단독 사용은 가능하다.
7. 지도 탭과 리스트 탭은 저장 플레이스 기준의 검색어와 필터 상태를 공유하되, 지도 탭은 같은 검색어에 대해 현재 지도 구역의 지도 API 결과를 추가로 보여준다.
8. 팝업은 단순 확인/이중 선택에만 사용한다.
9. 바텀시트는 선택지가 여러 개인 경우에만 사용한다.
10. 플랫폼 범위는 모바일 폰 앱(iOS/Android)만 포함한다.

---

## 4. 목표와 비목표
### 4-1. 목표
1. 로그인 후 즉시 사용 가능한 지도 기반 기록 경험 제공
2. 초대 코드 기반의 간단한 커플 연결 경험 제공
3. 장소 등록, 방문 기록, 사진, 메모를 한 흐름 안에서 제공
4. 검색/필터/지도/리스트를 통한 재탐색 경험 제공
5. 연결 해제 후에도 읽기 전용 스냅샷으로 관계 기록 보존

### 4-2. 비목표
1. 이메일/전화번호 로그인
2. 웹/태블릿 최적화
3. 아바타, 꾸미기, 결제, 추천
4. 다중 지도 동시 운영

---

## 5. 정보 구조
### 5-1. 하단 탭
1. 지도
2. 리스트
3. 마이페이지/설정

### 5-2. 최상위 진입 분기
1. 세션 없음 -> 로그인
2. 세션 있음 -> 스플래시 게이트 후 온보딩 또는 메인 진입
3. 첫 로그인 사용자는 세션 복원 후 개인 지도 자동 생성
4. 연결 해제 직후 -> 스냅샷 자동 표시

### 5-3. 화면 구조 원칙
1. 지도 탭과 리스트 탭은 저장 플레이스 데이터와 검색어/필터 상태를 공유하지만, 지도 탭은 현재 화면 구역 기준의 지도 API 검색 결과를 추가 레이어로 보여준다.
2. 초대 관련 기능은 하나의 초대 센터 화면으로 통합한다.
3. 사진 등록은 `사진 선택`과 `새 장소 생성`을 분리해 책임을 명확히 한다.
4. 방문기록은 create/edit를 하나의 폼 경험 안에서 mode로 분기한다.

---

## 6. 도메인 규칙
## 6-1. 지도/연결
1. 사용자는 활성 지도 1개만 가진다.
2. 하나의 지도에는 최대 2명만 연결된다.
3. owner와 참여자의 권한은 동일하다.
4. 다른 지도에 참여하면 기존 활성 지도는 완전 삭제된다.
5. 삭제 전 최종 확인 팝업을 반드시 노출한다.
6. 초대 완료 전에도 혼자 지도를 사용할 수 있다.

## 6-2. 초대 코드
1. 초대 코드는 영문+숫자 8자리다.
2. 비밀번호는 사용하지 않는다.
3. 활성 초대 코드는 지도당 1개만 유지한다.
4. 현재 지도가 이미 2명으로 연결된 상태에서는 초대 코드 생성/재발급을 허용하지 않는다.
5. 재발급 시 기존 코드는 즉시 무효화된다.
6. 초대 성공 시 코드는 즉시 만료된다.
7. 발급 후 24시간이 지나면 자동 만료된다.

## 6-3. 플레이스
1. 플레이스 타입은 `공식 플레이스`와 `커스텀 핀 플레이스` 두 가지다.
2. 공식 플레이스는 중복 저장할 수 없다.
3. 중복 공식 플레이스를 선택하면 신규 생성하지 않고 기존 상세로 이동한다.
4. 커스텀 핀은 중복 생성할 수 있다.

## 6-4. 플레이스 상태
1. 상태는 `wishlist`, `visited`, `orphan` 세 가지다.
2. 첫 방문기록이 생기면 `visited`가 된다.
3. 마지막 방문기록이 삭제되면 `orphan`이 된다.
4. `orphan`은 다시 위시리스트 지정 또는 새 방문기록 추가가 가능하다.

## 6-5. 방문기록/이미지
1. 방문기록은 날짜 단위로 저장한다.
2. 시간은 저장하지 않는다.
3. 미래 날짜 입력을 허용한다.
4. 이미지는 방문기록 단위로 저장한다.
5. 플레이스당 총 이미지 수는 99장까지 허용한다.
6. 99장 제한은 저장 규칙으로 강제하고 UI 카운트는 필수로 노출하지 않는다.
7. 첫 이미지는 자동으로 대표 이미지가 된다.
8. 대표 이미지는 사용자가 수동으로 변경할 수 있다.

## 6-6. 스레드
1. 메모는 플레이스 단위 공유 스레드 1개로 관리한다.
2. 메시지는 텍스트, 링크, 이모지만 허용한다.
3. 메시지 최대 길이는 500자다.
4. 메시지 수정/삭제는 작성자 본인만 가능하다.
5. 수정 이력은 저장하지 않는다.

## 6-7. 검색/필터/정렬
1. 모든 검색은 장소명만 대상으로 한다.
2. 지도 탭 검색 대상은 `wishlist`, `visited` 상태의 저장 플레이스 전체와 현재 지도 화면 구역 내 지도 API 결과다.
3. 지도 화면 바깥에 있는 `wishlist`, `visited` 플레이스도 지도 탭 검색 대상에 포함한다.
4. 지도 탭 검색 결과는 바텀시트로 노출한다.
5. 지도 탭 검색 결과의 우선순위는 `저장 플레이스 -> 현재 구역의 추가 지도 API 결과` 순이다.
6. 지도 탭에서는 저장된 공식 플레이스와 동일한 지도 API 결과를 중복 노출하지 않는다.
7. 리스트 탭 검색 대상은 `wishlist`, `visited` 상태의 저장 플레이스만이다.
8. 필터는 바텀시트에서 제공한다.
9. 상태 필터는 `위시리스트`, `갔다 온 곳`만 제공한다.
10. 카테고리 필터는 `맛집`, `여행`, `놀거리`, `특별한 장소`를 제공한다.
11. 기본 정렬은 최근 업데이트순이다.

## 6-8. 자동 분류
1. 자동 분류는 공식 플레이스이면서 `visited` 상태일 때만 적용한다.
2. `특별한 장소`는 자동 분류하지 않고 수동 지정만 가능하다.
3. 커스텀 핀의 기본 카테고리는 `미분류`다.
4. 사용자가 수동 변경한 카테고리는 이후 자동 분류로 덮어쓰지 않는다.

## 6-9. 플레이스 삭제 요청
1. 누구나 플레이스 삭제를 요청할 수 있다.
2. 삭제 요청 즉시 실제 삭제되지는 않는다.
3. 삭제 예정 시점은 요청 후 3일 뒤다.
4. 상대방이 승인하면 즉시 삭제된다.
5. 상대방은 거절할 수 있다.
6. 요청자는 요청을 취소할 수 있다.
7. 유예 중에도 다른 사용은 가능하다.
8. 최종 삭제 시 플레이스, 방문기록, 이미지, 스레드를 함께 삭제한다.
9. 만료 여부는 앱 시작, 포그라운드 복귀, 플레이스 로드 시 검사한다.

## 6-10. 연결 해제/스냅샷
1. 누구나 연결 해제를 실행할 수 있다.
2. 연결 해제 시 읽기 전용 스냅샷을 생성한다.
3. 스냅샷은 연결 해제 직후 자동 노출한다.
4. 스냅샷은 해당 관계의 고정 기록으로 유지한다.
5. 동일 상대와 재연결 시 `스냅샷 복구` 또는 `새로 시작`을 선택할 수 있다.

## 6-11. 계정/설정
1. 로그아웃을 지원한다.
2. 회원탈퇴를 지원한다.
3. 연결 중 상태에서는 회원탈퇴를 실행할 수 없다.
4. 연결 중 사용자가 탈퇴를 시도하면 먼저 `연결 해제`를 요구한다.
5. 탈퇴는 2단계 확인 후 실행한다.
6. 탈퇴 시 계정, 세션, 프로필, 개인 설정, 스냅샷을 즉시 삭제한다.
7. 탈퇴 후 계정 복구는 불가능하다.
8. 알림 이벤트는 `초대/연결`, `방문기록`, `메모`, `플레이스 삭제`, `연결 해제`, `기념일` 6종으로 구분한다.
9. 알림은 이벤트별 ON/OFF를 제공한다.
10. 알림 기본값은 전체 ON이다.
11. 프로필 수정 범위는 닉네임과 프로필 이미지다.
12. 닉네임은 trim 후 1~12자로 제한한다.
13. 프로필 이미지는 카메라 촬영과 갤러리 선택을 모두 지원한다.
14. 기념일은 1개만 관리한다.
15. 기념일은 연결된 상태에서만 수정할 수 있고, 단독 사용자는 안내 상태만 본다.

## 6-12. 코어 데이터 모델
아래 모델은 논리 모델 기준이다. 실제 저장 방식이 로컬 스토리지, mock, API, DB 중 무엇이든 필드 의미와 관계는 유지해야 한다.

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

## 7. 전역 UX 규칙
1. 전역 로딩은 오버레이로 처리한다.
2. 성공/실패 피드백은 토스트로 처리한다.
3. 빈 상태는 모든 주요 화면에서 명시한다.
4. 네트워크 오류는 재시도 액션과 함께 보여준다.
5. 카메라/앨범 권한 거부 시 대체 경로를 보여준다.
6. OS 알림 권한이 꺼져 있으면 알림 설정 화면에서 별도 안내를 보여준다.
7. 미저장 상태로 이탈할 때는 확인 팝업을 보여준다.
8. 읽기 전용 스냅샷 화면에서는 모든 수정 행동을 막고 시각적으로도 일반 화면과 구분한다.

---

## 8. Page ID 규칙
1. 정규 화면은 `PG_*`
2. 바텀시트는 `BTM_*`
3. 팝업은 `POP_*`
4. 하나의 `page_id`는 하나의 화면 책임만 가진다.
5. create/edit가 같은 UX 구조면 같은 `page_id` 안에서 `mode`로 분기한다.

---

## 9. 화면 체계
## 9-1. 정규 화면 목록
| page_id | 화면명 | 권장 route | 핵심 목적 |
|---|---|---|---|
| `PG_AUTH_SPLASH_GATE` | 스플래시/세션 게이트 | `/` | 세션 복원 및 진입 분기 |
| `PG_AUTH_LOGIN_GOOGLE` | 구글 로그인 | `/(auth)/login` | 비로그인 차단 및 인증 |
| `PG_ONBOARDING_HUB` | 온보딩 허브 | `/(auth)/welcome` | 초대 유도 및 단독 시작 |
| `PG_INVITE_CENTER` | 초대 센터 | `/(main)/invite-center` | 코드 생성/복사/공유/입력 |
| `PG_HOME_MAP` | 지도 탭 홈 | `/(tabs)/map` | 지도 기반 탐색 |
| `PG_HOME_LIST` | 리스트 탭 홈 | `/(tabs)/list` | 리스트 기반 탐색 |
| `PG_PLACE_DETAIL` | 플레이스 상세 | `/(main)/place/[id]` | 장소 단위 기록 허브 |
| `PG_PLACE_ADD_SEARCH` | 플레이스 추가 - 검색 | `/(main)/place/add/search` | 공식 플레이스 검색 등록 |
| `PG_PLACE_ADD_PIN` | 플레이스 추가 - 핀 | `/(main)/place/add/pin` | 커스텀 핀 등록 |
| `PG_PLACE_ADD_PHOTO` | 플레이스 추가 - 사진 | `/(main)/place/add/photo` | 사진 기반 등록 시작 |
| `PG_PLACE_CREATE_FROM_PHOTO` | 사진 기반 새 장소 생성 | `/(main)/place/add/photo/create` | 사진 등록 중 새 장소 생성 |
| `PG_VISIT_FORM` | 방문기록 작성/수정 | `/(main)/visit/form` | 날짜/사진 기반 방문 관리 |
| `PG_MY_HOME` | 마이페이지/설정 홈 | `/(tabs)/my` | 설정 허브 |
| `PG_SETTINGS_NOTIFICATIONS` | 알림 설정 | `/(main)/settings/notifications` | 이벤트별 알림 토글 |
| `PG_SETTINGS_PROFILE` | 프로필 수정 | `/(main)/settings/profile` | 닉네임/프로필 이미지 수정 |
| `PG_SETTINGS_ANNIVERSARY` | 기념일 입력/수정 | `/(main)/settings/anniversary` | 기념일 1개 관리 |
| `PG_RELATIONSHIP_DISCONNECT` | 연결 해제 | `/(main)/settings/disconnect` | 연결 해제 실행 |
| `PG_SNAPSHOT_READONLY` | 스냅샷 읽기 전용 | `/snapshot/[id]` | 해제 시점 지도 열람 |
| `PG_RECONNECT_RESTORE_DECISION` | 재연결 복구 선택 | `/(main)/reconnect/restore` | 스냅샷 복구/새로 시작 결정 |

## 9-2. 바텀시트 목록
| page_id | 용도 |
|---|---|
| `BTM_PLACE_FILTER` | 상태/카테고리 필터 |
| `BTM_MAP_SEARCH_RESULTS` | 지도 홈 검색 결과 |
| `BTM_PLACE_ADD_ENTRY` | 검색/핀/사진 진입 선택 |
| `BTM_PLACE_CATEGORY_PICKER` | 카테고리 선택 |
| `BTM_PLACE_HERO_PICKER` | 대표 이미지 선택 |
| `BTM_PHOTO_PLACE_SELECTOR` | 사진 등록 시 기존 장소 선택 |

## 9-3. 팝업 목록
| page_id | 용도 |
|---|---|
| `POP_JOIN_MAP_DESTRUCTIVE_CONFIRM` | 다른 지도 참여 전 최종 경고 |
| `POP_INVITE_CODE_INVALID` | 초대 코드 만료/무효 안내 |
| `POP_PLACE_DELETE_REQUEST_CONFIRM` | 플레이스 삭제 요청 확인 |
| `POP_PLACE_DELETE_APPROVE_CONFIRM` | 플레이스 삭제 승인 확인 |
| `POP_VISIT_DELETE_CONFIRM` | 방문기록 삭제 확인 |
| `POP_DISCONNECT_CONFIRM` | 연결 해제 최종 확인 |
| `POP_LOGOUT_CONFIRM` | 로그아웃 확인 |
| `POP_WITHDRAW_STEP1` | 탈퇴 1차 경고 |
| `POP_WITHDRAW_STEP2` | 탈퇴 2차 최종 확인 |
| `POP_UNSAVED_EXIT_CONFIRM` | 미저장 이탈 확인 |

## 9-4. 구조 보완 규칙
1. 하단 탭 루트는 `PG_HOME_MAP`, `PG_HOME_LIST`, `PG_MY_HOME` 3개만 둔다.
2. `PG_INVITE_CENTER`는 온보딩과 마이페이지에서 공용 진입하는 인증 후 공통 스택 화면으로 취급한다.
3. 플레이스 추가, 플레이스 상세, 방문 폼, 설정 하위, 연결 해제, 재연결 복구 선택은 모두 탭 위에 push되는 공통 스택 화면으로 구성한다.
4. `PG_SNAPSHOT_READONLY`와 `PG_RECONNECT_RESTORE_DECISION`은 항상 노출되는 일반 내비게이션이 아니라 조건 충족 시에만 진입하는 관계 상태 전용 화면이다.
5. 입력/수정 화면은 저장 완료 후 기본적으로 직전 맥락으로 복귀하며, 신규 엔티티를 생성한 경우 생성된 상세 화면을 우선 목적지로 한다.

## 9-5. Navigation & Params Matrix
아래의 `required input`과 `optional input`은 논리 입력 기준이다. 실제 전달 방식은 route param, store state, navigation param 중 구현 환경에 맞게 선택할 수 있다.

| page_id | required input | optional input | 성공/완료 시 기본 이동 |
|---|---|---|---|
| `PG_AUTH_SPLASH_GATE` | 없음 | 없음 | 로그인 또는 온보딩 또는 탭 홈 |
| `PG_AUTH_LOGIN_GOOGLE` | 없음 | 없음 | `PG_ONBOARDING_HUB` 또는 탭 홈 |
| `PG_ONBOARDING_HUB` | 없음 | 없음 | `PG_INVITE_CENTER` 또는 탭 홈 |
| `PG_INVITE_CENTER` | 없음 | `entrySource` | 참여 성공 시 탭 홈 |
| `PG_HOME_MAP` | 없음 | 없음 | 플레이스 상세 또는 추가 흐름 |
| `PG_HOME_LIST` | 없음 | 없음 | 플레이스 상세 또는 추가 흐름 |
| `PG_PLACE_DETAIL` | `placeId` | 없음 | 뒤로 가기 시 직전 홈 맥락 |
| `PG_PLACE_ADD_SEARCH` | 없음 | `initialQuery` | 선택 완료 시 `PG_PLACE_DETAIL(placeId)` |
| `PG_PLACE_ADD_PIN` | 없음 | `initialRegion` | 저장 완료 시 `PG_PLACE_DETAIL(placeId)` |
| `PG_PLACE_ADD_PHOTO` | 없음 | 없음 | 기존 장소 선택 시 `PG_VISIT_FORM`, 새 장소 생성 시 `PG_PLACE_CREATE_FROM_PHOTO` |
| `PG_PLACE_CREATE_FROM_PHOTO` | `draftImageIds` | `initialLatitude`, `initialLongitude` | 저장 완료 시 `PG_PLACE_DETAIL(placeId)` |
| `PG_VISIT_FORM` | `placeId` | `visitId`, `draftImageIds` | 저장 완료 시 `PG_PLACE_DETAIL(placeId)` |
| `PG_MY_HOME` | 없음 | 없음 | 설정 하위 또는 관계 액션 |
| `PG_SETTINGS_NOTIFICATIONS` | 없음 | 없음 | 저장 즉시 반영 후 뒤로 가기 |
| `PG_SETTINGS_PROFILE` | 없음 | 없음 | 저장 즉시 반영 후 뒤로 가기 |
| `PG_SETTINGS_ANNIVERSARY` | 없음 | 없음 | 저장 즉시 반영 후 뒤로 가기 |
| `PG_RELATIONSHIP_DISCONNECT` | 없음 | 없음 | 완료 시 `PG_SNAPSHOT_READONLY(snapshotId)` |
| `PG_SNAPSHOT_READONLY` | `snapshotId` | 없음 | 닫기 시 `PG_MY_HOME` |
| `PG_RECONNECT_RESTORE_DECISION` | `snapshotId` | 없음 | 선택 결과에 따라 탭 홈 |

---

## 10. 화면별 상세 명세
## 10-0. 공통 보완 규칙
1. 입력/수정 성격 화면(`PG_PLACE_ADD_PIN`, `PG_PLACE_ADD_PHOTO`, `PG_PLACE_CREATE_FROM_PHOTO`, `PG_VISIT_FORM`, `PG_SETTINGS_PROFILE`, `PG_SETTINGS_ANNIVERSARY`)은 공통적으로 `POP_UNSAVED_EXIT_CONFIRM` 적용 대상이다.
2. 모든 정규 화면은 해당되는 범위에서 `default`, `loading`, `empty`, `error`, `read-only` 상태를 정의한다.
3. 탭 외 화면은 stack push로 진입하고, 저장 완료 시 직전 맥락 또는 생성된 상세 화면으로 복귀한다.
4. 권한 부족, 읽기 전용, 연결 상태 차이처럼 화면 책임은 같고 행동만 달라지는 경우 새 `page_id`를 만들지 않고 동일 화면 안에서 상태로 분기한다.

## 10-1. 상태 소유권 원칙
| 상태 키 | 소유 범위 | 설명 |
|---|---|---|
| `homeSearchQuery` | shared | 지도 탭과 리스트 탭이 공유하는 저장 플레이스 검색어 |
| `homeStatusFilter` | shared | 지도/리스트 공용 상태 필터 |
| `homeCategoryFilter` | shared | 지도/리스트 공용 카테고리 필터 |
| `mapRegion` | map-only | 지도 카메라 중심/줌 상태 |
| `mapVisibleBounds` | map-only | 지도 API 검색의 현재 화면 구역 |
| `mapApiResults` | map-only | 현재 구역의 외부 검색 결과 |
| `mapSearchSheetOpen` | map-only | 지도 검색 결과 바텀시트 노출 상태 |
| `selectedPlaceId` | page-local | 현재 선택한 플레이스 상세 대상 |
| `photoDraftImageIds` | flow-local | 사진 등록 플로우 안에서만 유지되는 임시 이미지 |
| `visitFormDraft` | page-local | 방문 폼 입력값. 저장 전까지만 유지 |
| `inviteCodeInput` | page-local | 초대 센터 입력값 |

추가 원칙:
1. `shared` 상태는 탭 전환 시 유지되어야 한다.
2. `map-only` 상태는 리스트 탭으로 이동해도 유지할 필요가 없다.
3. `flow-local` 상태는 해당 플로우를 벗어나면 폐기한다.
4. 저장된 엔티티 데이터와 임시 draft 데이터는 같은 저장소 키나 같은 타입으로 섞지 않는다.

## `PG_AUTH_SPLASH_GATE`
목적:
세션 복원과 첫 진입 분기를 처리한다.

필수 요소:
1. 세션 복원 로딩
2. 세션 유효 시 메인 진입
3. 세션 없음 시 로그인 진입
4. 세션 복원 실패 fallback
5. 첫 로그인 사용자의 자동 지도 생성 처리

검토 및 보정:
1. 이 화면에서 직접 초대 여부를 묻지 않는다. 책임은 세션 확인과 초기 분기까지만 가진다.
2. 자동 지도 생성은 이 시점이 가장 단순하고 일관적이다.

## `PG_AUTH_LOGIN_GOOGLE`
목적:
비로그인 상태를 해소하고 앱 사용을 시작한다.

필수 요소:
1. 구글 로그인 버튼
2. 로그인 진행 로딩
3. 실패 문구와 재시도
4. 약관/개인정보 처리방침 링크

검토 및 보정:
1. 로그인 방식을 하나로 제한해 선택 피로를 없앤다.
2. 소셜 로그인만 지원하므로 계정 생성과 로그인을 한 행동으로 취급한다.

## `PG_ONBOARDING_HUB`
목적:
연결 행동을 유도하면서도 단독 사용 진입을 허용한다.

필수 요소:
1. `초대하기`
2. `초대받기`
3. `나중에 연결하고 먼저 시작`
4. 단독 사용 가능 설명 카피
5. 연결 완료 후 재진입 정책 명시
6. 연결 완료 사용자의 재진입 차단

검토 및 보정:
1. 지도 이름 입력 화면은 두지 않는다. MVP에서 불필요하다.
2. 연결 전에도 사용 가능하다는 점을 분명히 써야 이탈을 줄일 수 있다.
3. 이미 연결된 사용자는 이 화면에 머물지 않고 메인으로 보낸다.

## `PG_INVITE_CENTER`
목적:
초대 코드 생성, 복사, 공유, 입력을 하나의 화면에서 처리한다.

필수 요소:
1. 내 코드 카드
2. 코드 생성/재발급
3. 코드 복사 버튼
4. 코드 공유 버튼
5. 코드 입력 영역
6. 참여 버튼
7. 만료 시간 표시
8. 복사/공유 성공 토스트
9. 무효/만료/사용완료 문구 구분
10. 다른 지도 참여 시 `POP_JOIN_MAP_DESTRUCTIVE_CONFIRM`
11. `8자리 영문+숫자` 입력 validation
12. 화면 상태 분기(`단독 사용`, `연결 중`, `참여 진행 중`)
13. 연결 완료 상태에서 코드 생성/공유 영역 비노출

검토 및 보정:
1. 기존 설계처럼 생성 화면과 입력 화면을 나누지 않고 한 화면에 병치하는 것이 더 우아하다.
2. 연결 중 사용자는 상단에 현재 관계 상태를 보고, 하단 입력으로 다른 지도 참여를 시도할 수 있다.
3. 참여는 허용하되 반드시 파괴적 경고를 먼저 보여준다.
4. 온보딩과 마이페이지가 같은 화면을 재사용해야 초대 정책이 한 곳에서 유지된다.
5. 최대 2인 규칙을 지키기 위해 연결 완료 상태에서는 초대 코드 발급/공유 기능을 숨긴다.

## `PG_HOME_MAP`
목적:
지도 기반 탐색과 빠른 진입 허브 역할을 한다.

필수 요소:
1. safe area를 제외한 풀스크린 지도 canvas
2. 화면 상단 고정 floating 검색 박스
3. floating 필터 버튼
4. floating 적용 중 필터 chip strip
5. `BTM_MAP_SEARCH_RESULTS`
6. 검색 결과 우선순위(`저장 플레이스 -> 현재 구역의 추가 지도 API 결과`)
7. 지도 마커
8. 플로팅 추가 버튼
9. 로딩/에러/빈 상태
10. 삭제 요청 플레이스 표시
11. orphan 마커 표현
12. 검색/필터 상태 복원
13. 빈 상태 CTA(`플레이스 추가`)

검토 및 보정:
1. 지도는 카드형 레이아웃 안에 넣지 않고 화면 대부분을 차지하는 기본 canvas로 사용한다.
2. 검색 결과는 인라인 리스트가 아니라 바텀시트로 노출해 지도 가시 영역을 최대한 보존한다.
3. 지도 탭 검색은 플레이스명 기준으로만 동작하며, `wishlist`/`visited` 저장 플레이스를 먼저 보여준 뒤 현재 구역의 지도 API 결과를 같은 리스트에 이어서 보여준다.
4. 리스트 탭과 저장 플레이스 기준 검색어/필터 상태를 공유해야 사용자가 보기만 바꿔도 탐색 맥락이 유지된다.
5. 활성 필터는 지도 위에서 항상 요약되어야 결과 변화의 이유를 사용자가 이해할 수 있다.

## `PG_HOME_LIST`
목적:
리스트 기반 재탐색을 담당한다.

필수 요소:
1. 저장 플레이스 기준 지도 탭과 동일한 검색어/필터 상태 공유
2. 검색바
3. `wishlist`, `visited` 플레이스만 검색
4. 플레이스명 검색만 허용
5. 필터 버튼
6. 적용 중 필터 chip strip
7. 플레이스 카드 리스트
8. 플로팅 추가 버튼
9. 삭제 요청/방문횟수/카테고리 표시 규칙
10. 로딩/에러/빈 상태
11. 빈 상태 CTA(`플레이스 추가`)

검토 및 보정:
1. 지도와 리스트를 별도 기능으로 설계하지 않는다.
2. 동일 데이터의 다른 표현만 제공하는 것이 가장 단순하고 일관적이다.
3. 리스트도 지도와 동일한 검색 진입부를 유지해야 탭 전환 시 학습 비용이 없다.
4. 리스트 검색은 외부 지도 API 결과를 섞지 않고, 이미 저장한 `wishlist`/`visited` 플레이스만 빠르게 찾는 용도로 고정한다.

## `PG_PLACE_DETAIL`
목적:
장소 단위 기록의 단일 허브다.

필수 요소:
1. 기본 정보
2. 대표 이미지
3. 대표 이미지 변경 진입
4. 카테고리 변경 진입
5. 방문 횟수/최근 방문일 요약
6. 방문기록 목록
7. 이미지 모아보기
8. 공유 스레드 입력창
9. 작성자 전용 메시지 수정/삭제 액션
10. orphan 전용 CTA
11. 삭제 요청/승인/거절 배너
12. 로딩/에러/삭제 완료 후 이탈 규칙
13. 읽기 전용 버전과 일반 버전 차이 정의

검토 및 보정:
1. 대표 이미지 변경 기능은 이 화면에만 둔다. 다른 화면에 분산하지 않는다.
2. orphan 상태는 애매한 상태가 아니라 재활성화 가능한 관리 상태로 설계한다.
3. 스냅샷 모드에서는 같은 화면 구조를 재사용하되 수정 CTA를 모두 제거한다.
4. 공유 스레드는 같은 화면에서 읽기와 입력을 모두 처리하고, 권한 차이는 메시지 단위 액션으로만 분기한다.

## `PG_PLACE_ADD_SEARCH`
목적:
공식 플레이스를 검색하여 등록한다.

필수 요소:
1. 검색 입력
2. 검색 결과 리스트
3. 결과 없음 상태
4. 중복 플레이스 즉시 상세 이동
5. 중복 진입 전 안내 문구
6. 신규 플레이스 선택 시 즉시 저장 후 상세 이동

검토 및 보정:
1. 최근 검색/추천은 MVP에서 제외한다.
2. 목업 데이터 기반 검색이라도 중복 처리 UX는 실제 서비스 수준으로 설계해야 한다.

## `PG_PLACE_ADD_PIN`
목적:
지도에 핀을 찍어 커스텀 플레이스를 만든다.

필수 요소:
1. 지도 위 핀 선택
2. 핀 확정 UX
3. 장소명 입력
4. 이름 미입력 저장 방지
5. 위치 권한 거부 시 기본 지도 시작점

검토 및 보정:
1. 핀을 찍는 순간 저장하지 않는다. 사용자가 이름까지 확정해야 저장된다.
2. 주소는 보조 정보로만 취급하고 저장 필수값으로 두지 않는다.

## `PG_PLACE_ADD_PHOTO`
목적:
사진으로 등록 흐름을 시작한다.

필수 요소:
1. 카메라 촬영
2. 갤러리 선택
3. 권한 거부 처리
4. 선택 사진 미리보기
5. 사진 재선택/제거
6. 메타데이터 읽기 결과 안내
7. `기존 장소 선택`
8. `새 장소 생성`
9. 미저장 이탈 처리

검토 및 보정:
1. 사진 선택 화면과 새 장소 생성 화면을 분리하는 것이 더 낫다.
2. 임시 사진 보관은 현재 등록 세션 안에서만 유지하고, 이탈 시 폐기한다.
3. 불필요한 복잡도를 피하기 위해 임시 드래프트 보관 기능은 두지 않는다.

## `PG_PLACE_CREATE_FROM_PHOTO`
목적:
사진을 이미 선택한 상태에서 새 장소를 생성한다.

필수 요소:
1. 선택 사진 미리보기
2. 장소명 입력
3. 위치 지정
4. 위치 메타데이터 없음 fallback
5. 공식/커스텀 처리 방식
6. 첫 이미지 대표 이미지 확정 시점

검토 및 보정:
1. 사진 등록에서 새 장소 생성까지 한 화면에서 모두 해결하려 하면 필드가 과도하게 많아진다.
2. 이 화면을 별도 분리하는 것이 더 단순하고 오류 가능성이 낮다.
3. 신규 장소 저장과 동시에 첫 방문기록이 생성된다.

## `PG_VISIT_FORM`
목적:
방문기록 작성과 수정을 하나의 폼 경험으로 제공한다.

필수 요소:
1. create/edit mode 분기
2. 대상 플레이스 요약 헤더
3. 방문 날짜 입력
4. 사진 추가/삭제
5. edit 모드 삭제 버튼
6. 플레이스 총 99장 제한 검사
7. 미래 날짜 허용 안내
8. 저장 완료 후 플레이스 상세 복귀
9. `POP_UNSAVED_EXIT_CONFIRM`

검토 및 보정:
1. create와 edit를 화면 2개로 나누기보다 하나의 form screen이 더 유지보수에 유리하다.
2. 삭제는 edit 모드에서만 보여야 실수 가능성이 줄어든다.

## `PG_MY_HOME`
목적:
마이페이지와 설정의 허브다.

필수 요소:
1. 프로필 카드
2. 관계 상태 카드
3. 관계 상태별 카드 변형(`단독 사용`, `연결 중`, `연결 해제 후 스냅샷 보유`)
4. 초대/연결 관리 진입
5. 알림 설정 진입
6. 기념일 진입
7. 스냅샷 재진입 CTA
8. 로그아웃
9. 회원탈퇴
10. 위험도 구분 UI
11. 연결 중 탈퇴 불가 안내

검토 및 보정:
1. 초대 관리와 연결 해제는 모두 이 화면의 관계 상태 카드 아래에서 접근시키는 편이 명확하다.
2. 스냅샷도 이 화면에서 재진입시키는 것이 자연스럽다.
3. 마이 화면은 관계 상태에 따라 카드 구성과 CTA가 달라져야 한다.
4. 탈퇴는 데이터 처리 해석이 갈리기 쉬우므로 연결 중에는 막고, 먼저 연결 해제를 요구하는 흐름으로 단순화한다.

## `PG_SETTINGS_NOTIFICATIONS`
목적:
이벤트별 알림을 제어한다.

필수 요소:
1. `초대/연결` 토글
2. `방문기록` 토글
3. `메모` 토글
4. `플레이스 삭제` 토글
5. `연결 해제` 토글
6. `기념일` 토글
7. 기본값 전체 ON
8. OS 권한 OFF 안내 배너
9. 시스템 설정 이동 액션

검토 및 보정:
1. 앱 내부 토글만 두면 실제 수신이 안 되는 상태를 사용자가 이해하지 못한다.
2. OS 권한 상태를 화면 안에서 반드시 연결해 보여줘야 한다.

## `PG_SETTINGS_PROFILE`
목적:
닉네임과 프로필 이미지를 수정한다.

필수 요소:
1. 닉네임 입력
2. 닉네임 validation(`trim 후 1~12자`)
3. 프로필 이미지 촬영
4. 프로필 이미지 선택
5. 이미지 교체 정책
6. 권한 실패 처리

검토 및 보정:
1. 프로필 이미지 삭제 기능은 MVP에서 필수 아님으로 본다.
2. 이미지 교체만 지원하고, 기본 이미지는 자동 fallback으로 처리한다.

## `PG_SETTINGS_ANNIVERSARY`
목적:
커플 기념일 1개를 관리한다.

필수 요소:
1. 날짜 입력
2. 라벨 입력(선택)
3. 단독 사용 시 연결 유도 empty state
4. D-day 미리보기
5. 수정 정책

검토 및 보정:
1. 기념일은 1개만 관리하므로 리스트 UI가 필요 없다.
2. 삭제보다 `날짜 수정` 중심이 더 단순하다.
3. 단독 사용 상태에서는 수정 폼보다 연결 안내가 우선이다.

## `PG_RELATIONSHIP_DISCONNECT`
목적:
연결 해제를 실행한다.

필수 요소:
1. 연결 중 사용자만 진입 가능
2. 영향 요약
3. 장소 수/방문 수 표시
4. 스냅샷 생성 안내
5. `POP_DISCONNECT_CONFIRM`
6. 스냅샷 생성 실패 fallback
7. 상대방 알림 안내

검토 및 보정:
1. 연결 해제는 파괴적 액션이므로 영향 요약이 꼭 필요하다.
2. 완료 후 홈으로 보내기보다 스냅샷 자동 표시가 더 낫다.

## `PG_SNAPSHOT_READONLY`
목적:
해제 시점 지도를 읽기 전용으로 열람한다.

필수 요소:
1. 읽기 전용 배지
2. 생성일/상대 이름 헤더
3. 복구 가능 여부 안내
4. 플레이스/방문/스레드 열람 범위 정의
5. 일반 상세와 차별화된 읽기 전용 UI

검토 및 보정:
1. 일반 상세 화면을 그대로 재사용하되 입력/수정 계열 행동만 모두 제거한다.
2. 사용자는 이 화면을 저장소가 아니라 관계 기록 아카이브로 인식해야 한다.

## `PG_RECONNECT_RESTORE_DECISION`
목적:
동일 상대와 재연결할 때 복구 여부를 결정한다.

필수 요소:
1. 진입 조건: 동일 상대 재연결 감지
2. 스냅샷 미리보기
3. `복구` CTA
4. `새로 시작` CTA
5. 두 선택의 결과 차이 설명
6. 선택 후 이동 결과 정의
7. 비가역 여부 안내

검토 및 보정:
1. 이 결정을 팝업으로 축약하면 정보가 부족하다.
2. 관계 회복 맥락에서는 별도 화면으로 보여주는 것이 더 낫다.
3. `복구`는 스냅샷을 활성 지도로 되돌리고, `새로 시작`은 새 공유 지도로 진입시키는 후속 동작까지 문서에 고정해야 구현 해석이 갈리지 않는다.

---

## 11. 바텀시트 상세
## `BTM_PLACE_FILTER`
필수 요소:
1. 상태 필터
2. 카테고리 필터
3. 초기화
4. 적용

## `BTM_MAP_SEARCH_RESULTS`
필수 요소:
1. 검색어 헤더
2. `저장된 플레이스` 섹션(`wishlist`, `visited`)
3. `이 구역의 추가 결과` 섹션(현재 지도 화면 구역의 지도 API 결과)
4. 저장 플레이스 우선 노출
5. 저장된 공식 플레이스와 추가 결과 간 중복 제거
6. 결과 없음 상태
7. 저장된 플레이스 탭 시 상세 이동
8. 신규 지도 API 결과 탭 시 공식 플레이스로 저장 후 상세 이동

## `BTM_PLACE_ADD_ENTRY`
필수 요소:
1. 검색으로 추가
2. 지도 핀으로 추가
3. 사진으로 추가

## `BTM_PLACE_CATEGORY_PICKER`
필수 요소:
1. 맛집
2. 여행
3. 놀거리
4. 특별한 장소
5. 미분류

## `BTM_PLACE_HERO_PICKER`
필수 요소:
1. 현재 플레이스 이미지 목록
2. 탭 시 대표 이미지 변경

## `BTM_PHOTO_PLACE_SELECTOR`
필수 요소:
1. 기존 플레이스 목록
2. 검색
3. 선택 후 방문 폼 이동

---

## 12. 팝업 상세
## `POP_JOIN_MAP_DESTRUCTIVE_CONFIRM`
메시지 핵심:
기존 활성 지도는 완전 삭제되며 복구할 수 없다.

## `POP_INVITE_CODE_INVALID`
메시지 핵심:
초대 코드가 무효, 만료, 또는 이미 사용되었다.

## `POP_PLACE_DELETE_REQUEST_CONFIRM`
메시지 핵심:
3일 후 자동 삭제되며, 상대가 승인하면 즉시 삭제된다.

## `POP_PLACE_DELETE_APPROVE_CONFIRM`
메시지 핵심:
관련 방문기록, 이미지, 스레드도 함께 삭제된다.

## `POP_VISIT_DELETE_CONFIRM`
메시지 핵심:
마지막 방문기록 삭제 시 플레이스는 `orphan` 상태로 남는다.

## `POP_DISCONNECT_CONFIRM`
메시지 핵심:
연결 해제 후 읽기 전용 스냅샷이 생성된다.

## `POP_LOGOUT_CONFIRM`
메시지 핵심:
현재 디바이스의 자동 로그인 상태가 해제된다.

## `POP_WITHDRAW_STEP1`
메시지 핵심:
회원탈퇴를 시작하려는지 경고하며, 연결 중이면 먼저 연결 해제가 필요함을 안내한다.

## `POP_WITHDRAW_STEP2`
메시지 핵심:
탈퇴 후 계정, 세션, 프로필, 개인 설정, 스냅샷이 즉시 삭제되며 복구가 불가능함을 최종 확인한다.

## `POP_UNSAVED_EXIT_CONFIRM`
메시지 핵심:
저장하지 않은 변경사항이 사라진다.

---

## 13. 기능 요구사항
## 13-1. 인증
1. 앱은 구글 로그인 성공 후에만 메인 기능에 접근할 수 있다.
2. 세션이 유효하면 로그인 화면을 건너뛴다.
3. 세션 복원 실패 시 로그인 화면으로 보낸다.

## 13-2. 초대/참여
1. 초대 코드 생성, 복사, 공유, 입력은 하나의 초대 센터 화면에서 처리한다.
2. 이미 커플 연결 중인 사용자가 다른 지도 참여를 시도하면 파괴적 경고를 먼저 본다.
3. 참여 성공 시 코드 만료 처리를 즉시 반영한다.

## 13-3. 홈 탐색
1. 지도 탭과 리스트 탭은 저장 플레이스 기준의 검색어/필터 상태를 공유한다.
2. 지도 탭은 풀스크린 지도와 상단 floating 검색 박스를 기본 레이아웃으로 사용해야 한다.
3. 지도 탭 검색은 `wishlist`/`visited` 저장 플레이스를 상단에, 현재 구역의 지도 API 결과를 하단에 배치한 바텀시트로 결과를 보여줘야 한다.
4. 리스트 탭 검색은 `wishlist`/`visited` 저장 플레이스만 대상으로 해야 하며 외부 지도 API 결과를 포함하지 않는다.
5. 홈 화면은 로딩, 에러, 빈 상태를 모두 정의해야 한다.
6. 삭제 요청 플레이스는 홈 카드/마커에서 식별 가능해야 한다.

## 13-4. 장소 등록
1. 검색 등록, 핀 등록, 사진 등록 3가지를 모두 지원한다.
2. 사진 등록에서는 `기존 장소 선택`과 `새 장소 생성`을 모두 제공한다.
3. `새 장소 생성`은 별도 화면으로 이름/위치 입력을 받는다.

## 13-5. 방문기록
1. 방문기록 작성/수정은 하나의 폼 경험으로 설계한다.
2. edit 모드에서만 삭제 액션을 노출한다.
3. 저장 시 플레이스 총 이미지 99장 제한을 검사한다.

## 13-6. 스레드
1. 빈 스레드 상태와 첫 메시지 작성 유도를 명시한다.
2. 읽기 전용 스냅샷에서는 입력과 수정/삭제를 막는다.

## 13-7. 설정
1. 마이페이지/설정 홈에서 초대/연결 관리, 알림, 프로필, 기념일, 로그아웃, 탈퇴에 접근할 수 있어야 한다.
2. 스냅샷 재진입 CTA를 마이페이지 또는 관계 상태 카드에서 제공해야 한다.
3. 연결 중 상태에서는 회원탈퇴 CTA를 비활성화하거나 선행 조건 안내와 함께 차단해야 한다.

---

## 14. 수용 기준
1. 비로그인 상태에서 메인 기능 접근이 차단된다.
2. 지도 탭은 풀스크린 지도와 상단 floating 검색 박스로 구성된다.
3. 지도/리스트 탭은 저장 플레이스 기준의 검색어/필터 상태를 공유한다.
4. 지도 탭 검색 시 `wishlist`/`visited` 저장 플레이스가 상단, 현재 구역의 지도 API 결과가 하단에 한 바텀시트로 표시된다.
5. 리스트 탭 검색은 `wishlist`/`visited` 저장 플레이스만 대상으로 하며 외부 지도 API 결과를 포함하지 않는다.
6. 공식 플레이스 중복 생성이 발생하지 않는다.
7. 다른 지도 참여 전 기존 지도 삭제 경고가 반드시 노출된다.
8. 플레이스 최종 삭제 시 연관 방문/이미지/스레드가 함께 제거된다.
9. 스레드 수정/삭제 권한 위반이 없다.
10. 연결 해제 후 스냅샷이 자동 노출되고 읽기 전용이 보장된다.
11. 동일 상대 재연결 시 복구 여부를 선택할 수 있다.
12. 각 화면은 이 문서의 `page_id`와 필수 요소를 충족해야 한다.
13. 연결 중 상태에서는 회원탈퇴가 실행되지 않고, 먼저 연결 해제를 요구한다.

## 14-1. 구현 검토 체크리스트
아래 항목은 특정 테스트 도구나 의존성에 묶이지 않는 제품 레벨 검토 기준이다.

1. 첫 로그인 후 자동 지도 생성이 한 번만 일어난다.
2. 온보딩에서 `초대하기`, `초대받기`, `나중에 연결하고 먼저 시작` 세 경로가 모두 동작한다.
3. 초대 코드 재발급 시 기존 코드가 즉시 무효화된다.
4. 다른 지도 참여 시 파괴적 경고 후에만 실제 참여가 수행된다.
5. 지도 탭에서 검색 결과가 `저장 플레이스 -> 현재 구역 추가 결과` 순으로 보인다.
6. 리스트 탭 검색에는 외부 지도 API 결과가 섞이지 않는다.
7. 공식 플레이스 중복 선택 시 새 플레이스가 생기지 않고 기존 상세로 이동한다.
8. 마지막 방문기록 삭제 후 플레이스가 `orphan`으로 남고 다시 활성화할 수 있다.
9. 플레이스 최종 삭제 시 방문기록, 이미지, 스레드가 함께 제거된다.
10. 연결 해제 후 스냅샷이 자동 표시되고 읽기 전용이다.
11. 동일 상대 재연결 시 `복구`와 `새로 시작`이 서로 다른 결과를 만든다.
12. 연결 중에는 회원탈퇴가 차단된다.

---

## 15. 구현 우선순위
1. 인증/세션/온보딩/초대 센터
2. 탭 구조와 홈 3화면
3. 플레이스 추가 4화면과 방문 폼
4. 플레이스 상세/스레드/삭제 유예
5. 마이페이지/알림/프로필/기념일
6. 연결 해제/스냅샷/재연결 복구

---

## 16. Design System / Visual Language

### 16.1 Design Intent

본 제품의 UI는 다음의 시각적 인상을 목표로 한다.

- 전체 톤: clean, rounded, soft, premium, calm
- 핵심 인상: 군더더기 없는 미니멀함 + 큰 라운드 + 약한 유리 질감
- 질감 방향: full glassmorphism이 아니라, `solid base` 위에 일부 floating layer만 반투명하게 처리하는 soft-glass 스타일
- 화면 인상: 답답하지 않고 여백이 넉넉하며, 요소 간 경계가 부드럽고, 손에 잡히는 듯한 둥근 인터페이스
- 브랜드 인상: 차갑고 기술적인 느낌보다, 정돈되고 생활 친화적이며 고급스러운 느낌을 우선한다

이 디자인 시스템은 "화려함"보다 "정갈함과 일관성"을 우선한다.  
즉, 특수 효과를 과하게 사용하지 않고, 여백/비례/라운드/투명도/그림자의 질을 통해 완성도를 만든다.

---

### 16.2 Core Principles

#### Principle 1. Large Round Geometry
- 모든 주요 인터랙션 요소는 충분히 둥글어야 한다.
- 직각 박스형 UI를 지양한다.
- 버튼, 카드, 입력창, 바텀시트, 탭바는 모두 동일한 라운드 체계를 따른다.

#### Principle 2. Clean Surface Hierarchy
- 대부분의 정보는 불투명 또는 준불투명한 solid surface 위에 배치한다.
- glass effect는 강조나 부유감을 줄 필요가 있는 레이어에만 제한적으로 사용한다.
- 하나의 화면에서 glass surface가 지나치게 많아지지 않도록 한다.

#### Principle 3. Airy Layout
- 요소를 빽빽하게 붙이지 않는다.
- 여백은 정보 구조를 드러내는 핵심 수단이다.
- 화면이 비어 보일 정도의 여유를 허용한다.

#### Principle 4. Low-Noise Visual Language
- 색상 수를 최소화한다.
- 그림자, 보더, 블러, 그라디언트는 모두 약하게 사용한다.
- "보이는 효과"보다 "정돈된 인상"이 우선이다.

#### Principle 5. Tactile Interaction
- 모든 터치 가능한 요소는 눌렀을 때 미세한 반응을 가져야 한다.
- hover/press/focus/disabled 상태가 명확해야 한다.
- 반응은 빠르되 과장되지 않아야 한다.

---

### 16.3 Theme Strategy

기본 테마는 Light Mode를 우선 구현한다.

- MVP 기본: Light theme only
- Dark mode: 후순위. 별도 요청이 없는 한 필수 구현 범위에 포함하지 않는다.

Light theme에서의 핵심 조합:
- 따뜻한 뉴트럴 배경
- 화이트/오프화이트 surface
- 검정 또는 짙은 차콜 텍스트
- 절제된 포인트 컬러
- 반투명 white layer와 약한 blur

---

### 16.4 Color Tokens

아래 값은 기본 토큰이며, 브랜드 컬러가 정해지더라도 구조는 유지한다.

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
- 본문 텍스트는 항상 `color.text.primary` 또는 `color.text.secondary`를 사용한다.
- glass background 위에 긴 문단을 직접 올리지 않는다.
- danger/success/warning은 상태 전달에만 사용하며, 장식용으로 남용하지 않는다.
- 한 화면 내에서 강한 포인트 컬러는 1개만 사용한다.

---

### 16.5 Typography

#### Font Family
- 기본 폰트
- iOS: SF Pro
- Android / Web fallback: Pretendard, Inter, system-ui, sans-serif
- 한국어 우선 환경에서는 Pretendard 계열을 기본값으로 본다.

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
- 한 화면에서 텍스트 스타일은 최대 4종류 정도로 제한한다.
- 제목과 본문 간 대비는 크기보다 weight와 여백으로 만든다.
- 과도한 자간 조절은 지양한다.
- 숫자, 가격, 수량은 가독성을 위해 tabular number 적용 가능하다.

---

### 16.6 Spacing System

4pt 기반 spacing system을 사용한다.

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
- 화면 좌우 기본 패딩: `20`
- 카드 내부 기본 패딩: `16`
- 섹션 간 간격: `24`
- 카드 간 간격: `12`
- 작은 인라인 요소 간 간격: `8`

#### Rules
- 여백은 줄이기보다 유지하는 방향을 우선한다.
- 컴포넌트 내부 패딩은 수평보다 수직이 더 좁지 않도록 한다.
- dense layout은 특별한 사유가 없는 한 사용하지 않는다.

---

### 16.7 Radius System

이 제품은 라운드를 강하게 사용하는 인터페이스를 기본으로 한다.

- `radius.xs = 10`
- `radius.sm = 14`
- `radius.md = 18`
- `radius.lg = 24`
- `radius.xl = 28`
- `radius.pill = 9999`

#### Component Radius Rules
- 기본 버튼: `18`
- 큰 CTA 버튼: `20` 또는 `pill`
- 입력창: `16`
- 카드: `20`
- 큰 카드/패널: `24`
- 바텀시트 상단: `28`
- FAB / 아이콘 버튼: `pill`

#### Rules
- 한 화면 안에서 radius를 과도하게 섞지 않는다.
- 작은 요소는 `14~18`, 큰 패널은 `24~28` 범위 내에서만 사용한다.
- sharp corner는 원칙적으로 사용하지 않는다.

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
glass effect는 아래 레이어에만 허용한다.
- floating tab bar
- search/filter chip container
- modal / bottom sheet header
- overlay card
- mini cart / mini player / floating action surface
- 이미지 위의 작은 info badge

glass effect는 아래에는 사용하지 않는다.
- 긴 본문 카드
- 데이터가 많은 리스트 셀 전체
- 입력폼 전체 배경
- 테이블성 화면
- 복잡한 정보 구조가 있는 관리 화면

#### Quality Rules
- glass panel 위 텍스트 대비는 충분히 확보해야 한다.
- glass panel 아래 배경이 너무 복잡하면 opacity를 높이거나 solid surface로 전환한다.
- glass panel끼리 2중, 3중 중첩하지 않는다.
- Android 또는 저사양 환경에서 blur가 불안정하면 solid fallback을 사용한다.

#### Fallback
blur 미지원 환경에서는 아래 방식으로 대체한다.
- background: `rgba(255,255,255,0.92)`
- border: `1px solid rgba(17,17,17,0.06)`
- shadow: `shadow.sm`

---

### 16.9 Iconography and Imagery

#### Icons
- 스타일: outline 우선
- stroke weight: 1.75 ~ 2.0
- cap/join은 rounded 사용
- 아이콘 사이즈 기본값
- small: 16
- default: 20
- large: 24

#### Images
- 이미지 코너는 대부분 `20~24` radius를 적용한다.
- 제품/장소/프로필 이미지는 둥근 직사각형 또는 원형을 사용한다.
- 이미지 위 텍스트 오버레이는 최소화한다.
- 이미지 위 badge나 action은 glass mini-surface로 처리 가능하다.

---

### 16.10 Component Standards

#### Buttons

##### Primary Button
- 용도: 가장 중요한 CTA
- 높이: `52`
- 패딩: `0 20`
- 배경: `#111111`
- 텍스트: `#FFFFFF`
- radius: `20` 또는 `pill`
- shadow: 없음 또는 `shadow.sm`

##### Secondary Button
- 용도: 보조 CTA
- 높이: `48`
- 배경: `#FFFFFF`
- 텍스트: `#111111`
- border: `1px solid rgba(17,17,17,0.08)`
- radius: `18`

##### Glass Button
- 용도: floating action, overlay action
- 높이: `44 ~ 48`
- 배경: `color.glass.fill`
- blur: `glass.blur`
- border: `color.border.glass`
- radius: `pill`

##### Ghost Button
- 용도: 텍스트성 보조 액션
- 배경: transparent
- 텍스트: `color.text.primary`
- pressed 시 배경만 약하게 노출

##### Disabled
- opacity: `0.45`
- 클릭 불가
- disabled 상태에서 shadow 제거

#### Icon Buttons
- 크기: `40 / 44 / 48`
- 형태: 원형 또는 rounded square
- floating 액션은 glass 가능
- 기본 아이콘 크기: `20`

#### Inputs
- 높이: `48`
- 배경: `rgba(255,255,255,0.78)` 또는 `#FFFFFF`
- border: `1px solid rgba(17,17,17,0.06)`
- radius: `16`
- 내부 좌우 패딩: `14~16`
- placeholder: `color.text.tertiary`
- focus 시 border: `rgba(17,17,17,0.16)`
- focus 시 outer ring: `0 0 0 4 rgba(17,17,17,0.05)`

#### Cards
- 배경: solid surface 우선
- radius: `20`
- 패딩: `16`
- shadow: `shadow.sm`
- border: 선택적 `color.border.soft`
- 카드 내부 구조는 "이미지 / 제목 / 보조정보 / 액션" 순으로 단순하게 유지

#### Chips / Filters
- 높이: `36 ~ 40`
- radius: `pill`
- 선택 전: soft surface
- 선택 후: dark fill 또는 accent fill
- filter chip 묶음은 glass container 위에 올릴 수 있음

#### Bottom Tab Bar
- floating 형태 우선
- 높이: `64 ~ 72`
- 좌우 마진을 둔 부유형 배치
- 배경: glass surface
- blur: `16 ~ 24`
- radius: `24 ~ 28`
- active icon/label만 강하게 표시
- 탭 수는 5개 이하

#### Modal / Bottom Sheet
- backdrop: `color.overlay.dim`
- sheet 배경: `#FFFFFF` 또는 strong glass
- 상단 corner radius: `28`
- drag handle 필수
- sheet 내부 padding: `20`
- 화면 하단 안전영역 고려

#### Toast / Snackbar
- 짧고 명확한 피드백만 제공
- 지나치게 튀지 않게 dark solid 또는 soft glass 사용
- radius: `16`
- 1~2줄 이내 텍스트만 허용

---

### 16.11 Layout Rules

#### Page Layout
- 상단 영역은 답답하지 않게 여백을 확보한다.
- 카드형 UI를 기본으로 하되, 카드가 너무 촘촘하게 쌓이지 않도록 한다.
- 콘텐츠가 적은 화면은 중앙 정렬보다 상단 정렬 + 넉넉한 상단 여백을 우선한다.

#### List
- 기본 리스트 row 높이: `64+`
- row 내부 패딩: `16`
- 구분선은 필요 시에만 사용
- 구분선보다 여백과 카드 분리로 구조를 표현하는 것을 우선한다

#### Grid
- 모바일 기준 2열 grid 우선
- gutter: `12`
- 카드 높이는 과도하게 제각각이 되지 않도록 제한한다
- 이미지 비율은 일관되게 유지한다

---

### 16.12 Motion System

애니메이션은 존재감보다 완성도를 높이는 용도로 사용한다.

#### Timing
- fast: `120ms`
- normal: `180ms`
- emphasis: `240ms`
- bottom sheet / modal entrance: `280 ~ 320ms`

#### Easing
- 기본: `ease-out`
- 진입: 부드럽게 감속
- 종료: 빠르게 정리
- spring은 바텀시트, 카드 확장, 토글 전환 정도에만 제한적으로 사용

#### Interaction Rules
- 버튼 press 시 scale `0.98`
- 아이콘 버튼 press 시 background opacity 증가
- 카드 탭 시 미세한 축소 + shadow 감소
- 화면 전환은 과장된 parallax나 bounce를 사용하지 않는다

---

### 16.13 States

모든 인터랙티브 요소는 아래 상태를 지원해야 한다.

- default
- pressed
- focused
- disabled
- loading
- selected
- error (필요한 경우)

#### State Rules
- pressed: 크기 또는 배경이 미세하게 반응
- focused: 키보드/접근성 탐색 기준으로 명확히 표시
- loading: 기존 레이아웃을 최대한 유지한 채 spinner 또는 skeleton 표시
- error: 색만 바꾸지 말고 문구 또는 아이콘으로도 전달

---

### 16.14 Accessibility Rules

- 본문 텍스트와 배경 대비는 WCAG AA 수준 이상을 목표로 한다.
- glass surface 위 텍스트는 solid surface보다 더 높은 대비를 확보해야 한다.
- 작은 캡션 외에는 12px 미만 폰트를 사용하지 않는다.
- 터치 영역은 최소 `44x44` 이상으로 잡는다.
- blur/투명도는 정보 전달을 방해하면 즉시 줄인다.
- 색만으로 상태를 구분하지 않는다.
- 모달/바텀시트에는 focus trap 및 명확한 dismiss 경로가 있어야 한다.

---

### 16.15 Do / Don't

#### Do
- 넉넉한 여백을 유지한다.
- 라운드를 일관되게 사용한다.
- glass는 floating layer에만 제한적으로 사용한다.
- 카드/버튼/입력창의 비례를 통일한다.
- 정보 구조를 보더보다 spacing으로 드러낸다.

#### Don't
- 모든 surface를 반투명하게 만들지 않는다.
- 강한 그림자와 강한 blur를 동시에 쓰지 않는다.
- 한 화면에 radius 체계를 여러 개 섞지 않는다.
- 회색을 너무 많이 써서 전체를 흐릿하게 만들지 않는다.
- 장식용 gradient를 남발하지 않는다.

---

### 16.16 AI Implementation Rules

이 디자인 시스템을 구현하는 AI 코딩 에이전트는 아래를 반드시 따른다.

- 임의로 새로운 색상 체계를 추가하지 않는다.
- radius/shadow/spacing 값을 즉흥적으로 만들지 않는다. 반드시 토큰을 사용한다.
- glass effect는 지정된 레이어에만 적용한다.
- 텍스트 가독성이 떨어지면 glass보다 solid surface를 우선한다.
- 새 컴포넌트를 만들 때는 기존 버튼/카드/입력창 스타일을 조합하여 재사용한다.
- 화면별로 다른 미감 실험을 하지 않는다. 전체 앱에서 시각 언어는 동일해야 한다.
- 디자인이 애매할 때는 "더 화려한 방향"이 아니라 "더 단순하고 정돈된 방향"으로 결정한다.

---

### 16.17 Default Screen Composition Pattern

기본적인 화면 구성 패턴은 아래 순서를 따른다.

1. 상단 여백이 충분한 header
2. 핵심 액션 또는 상태 요약
3. 메인 콘텐츠 카드/리스트
4. 필요 시 floating filter/search/action
5. 하단 CTA 또는 floating tab bar

즉, 본 제품은 "헤더-콘텐츠-부유 액션" 구조를 기본으로 하며, 복잡한 툴바와 과도한 보조 정보는 지양한다.

---

## 17. 최종 검토 결과
이번 최종 통합에서 반영한 핵심 보정:
1. 기존 분리 문서의 `page_id`, 바텀시트, 팝업, 화면별 필수 요소를 모두 이 문서에 통합했다.
2. `PG_PLACE_CREATE_FROM_PHOTO`를 별도 화면으로 확정해 사진 등록 흐름의 책임을 분리했다.
3. `PG_RECONNECT_RESTORE_DECISION`을 별도 화면으로 확정해 재연결 복구 결정을 충분한 정보와 함께 처리하도록 했다.
4. `PG_INVITE_CENTER`를 생성/입력 통합 화면으로 확정해 초대 UX를 단순화했다.
5. 지도/리스트 탭을 동일 상태를 공유하는 이중 뷰 구조로 확정했다.
6. 권한 거부, OS 알림 OFF, 네트워크 단절, 읽기 전용 차별화 규칙을 공통 UX로 승격했다.
7. 탭 루트, 공통 스택, 관계 상태 전용 조건부 화면의 경계를 명시해 라우팅 해석 차이를 줄였다.
8. 초대 센터 상태 분기, 홈의 활성 필터 요약, 장소 상세의 스레드 권한, 설정의 알림 이벤트/닉네임/기념일 상태를 보강했다.
9. 지도 홈을 풀스크린 지도 + 상단 floating 검색 구조로 고정해 버려지는 레이아웃 공간을 없앴다.
10. 지도 홈 검색은 `저장 플레이스 우선 + 현재 구역 지도 API 결과` 바텀시트로, 리스트 검색은 저장 플레이스 전용으로 분리해 검색 목적을 명확히 했다.
11. 구현 환경에 덜 의존적인 `에이전트 작업 원칙`, `코어 데이터 모델`, `Navigation & Params Matrix`, `상태 소유권`, `구현 검토 체크리스트`를 추가해 문서만으로도 해석 차이를 줄였다.

이 문서를 기준으로 추가 문서 없이 구현과 리뷰를 진행한다.
