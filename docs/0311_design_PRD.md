# 0311 디자인 PRD
## 커플 공유 지도 앱 화이트 베이스 리디자인 기준서

문서 상태: 신규 디자인 기준서  
작성일: 2026-03-11  
언어 원칙: 이 문서는 한글 기준 문서다. 코드 식별자, 파일 경로, 타입 이름만 원문 표기를 유지한다.

---

## 1. 문서 목적

이 문서는 기존 `design_prd_draft.md`의 시각 방향을 수정하고, 현재 앱의 과한 배경색, 과한 카드화, 불균일한 높이와 여백, 정리되지 않은 타이포, 큰 배지, 썸네일 없는 리스트 문제를 해결하기 위한 새로운 디자인 기준을 정의한다.

핵심 목표:

1. 앱 전체 배경을 `흰색 기반`으로 재정의한다.
2. `카드 위에 카드가 올라가는 구조`를 제거하고, 더 직접적이고 평평한 레이아웃으로 전환한다.
3. 메뉴 높이, 여백, 폰트 크기, 색상, 자간, 행간을 전역 토큰으로 통일한다.
4. 리스트 화면을 `작은 배지 + 썸네일 필수 + 얕은 구분선 기반` 구조로 재정의한다.
5. 이후 구현 시 화면마다 임의 스타일을 추가하지 않아도 되도록 충분히 구체적인 디자인 시스템을 마련한다.

## 1-1. 문서 우선순위

1. 2026-03-11 이후 시각 디자인 판단은 이 문서를 우선한다.
2. 이 문서와 `design_prd_draft.md`가 충돌하면 시각 규칙은 이 문서가 우선한다.
3. 도메인 규칙, 기능 규칙, 상태 전환 규칙은 기존 `prd_v2.md`와 후속 PRD를 유지한다.
4. 구현 편의 때문에 카드, 색상, 여백 규칙을 임의로 바꾸면 안 된다.

---

## 2. 지금 문제로 보는 핵심 진단

현재 디자인의 핵심 문제는 아래와 같다.

1. 배경에 크림 톤이 깔려 있어 전체 인상이 무겁고 답답하다.
2. 화면 바깥 패딩, 카드 바깥 여백, 카드 안쪽 패딩이 중첩되어 실제 콘텐츠 폭이 너무 좁다.
3. 같은 계열 메뉴인데도 높이와 아이콘 프레임, 텍스트 기준선이 일정하지 않다.
4. 화면마다 제목 크기, 본문 크기, 서브텍스트 색상, 자간 사용 방식이 다르다.
5. 리스트 배지 크기가 과하고, 정보 우선순위를 잡아먹는다.
6. 리스트에 썸네일이 없거나 약해서 장소 콘텐츠가 아니라 텍스트 블록처럼 보인다.
7. 카드식 디자인이 과해서 화면이 조각나 보인다.
8. 여백이 넓지만 정교하지 않아 고급스럽기보다 비어 보인다.

---

## 3. 새 디자인 한 줄 정의

이 앱은 `따뜻한 감성 카드 앱`이 아니라, `흰 바탕 위에 정제된 정보와 기억이 차분하게 정렬된 커플 지도 앱`처럼 보여야 한다.

핵심 인상:

1. 화이트
2. 정돈됨
3. 가볍고 빠름
4. 선명한 정보 위계
5. 과장 없는 세련됨

금지 인상:

1. 크림톤 배경이 넓게 깔린 화면
2. 카드가 계속 겹치는 구조
3. 큰 배지와 큰 라운드가 과하게 반복되는 화면
4. 섹션마다 다른 높이와 타이포가 보이는 화면
5. 여백이 많지만 콘텐츠 밀도가 낮은 화면

---

## 4. 새 시각 원칙

## 4-1. 배경 원칙

1. 앱 기본 배경은 `순백색`을 사용한다.
2. 기본 화면 배경은 `#FFFFFF` 외 다른 색을 쓰지 않는다.
3. 배경색으로 분위기를 만들지 않는다.
4. 분위기는 `타이포 위계`, `정렬`, `썸네일`, `간격`, `구분선`으로 만든다.
5. 연한 회색은 입력창, 비활성 배경, 시트, 구분면에만 제한적으로 사용한다.

## 4-2. 레이아웃 원칙

1. 한 화면 안에서 좌우 패딩 계층은 기본적으로 `1단`만 허용한다.
2. `화면 좌우 패딩 + 카드 내부 패딩 + 카드 안 요소 패딩`의 3중 구조를 금지한다.
3. 콘텐츠는 가능한 한 바닥에 직접 깔고, 필요할 때만 구분선이나 약한 배경을 사용한다.
4. 카드가 필요한 경우는 `바텀시트`, `모달`, `경고 블록`, `히어로 정보 요약` 정도로 제한한다.
5. 기본 리스트와 설정 화면은 카드보다 `행(row) 기반` 구성을 우선한다.

## 4-3. 정보 위계 원칙

1. 제목은 크기보다 무게와 간격으로 강조한다.
2. 서브 정보는 색과 크기를 줄여 정리한다.
3. 배지는 상태 보조 수단이어야 하며 제목보다 먼저 읽히면 안 된다.
4. 썸네일이 있는 콘텐츠는 텍스트보다 이미지가 먼저 인지되어야 한다.
5. 액센트 컬러는 CTA, 활성 상태, 핵심 상태값에만 사용한다.

---

## 5. 디자인 시스템 구조

이 문서는 아래 9개 층을 기준으로 구현한다.

1. Background
2. Grid
3. Spacing
4. Radius
5. Color
6. Typography
7. Divider and Surface
8. Component
9. Route Blueprint

---

## 6. Background 시스템

| Token                  | Value       | Usage |
| ---------------------- | ----------- | ----- |
| `color.bg.base`        | `#FFFFFF`   | 기본 화면 배경 |
| `color.bg.subtle`      | `#F7F8FA`   | 입력창, 비활성 필드, 썸네일 placeholder |
| `color.bg.muted`       | `#F3F4F6`   | 선택 약강조, 구획용 약배경 |
| `color.bg.sheet`       | `#FFFFFF`   | 바텀시트, 모달 |
| `color.bg.dangerSoft`  | `#FFF4F4`   | 파괴적 경고 배경 |

규칙:

1. 기존 `warm canvas` 계열 배경은 폐기한다.
2. 지도 화면을 제외한 모든 일반 화면은 `color.bg.base`를 쓴다.
3. 지도 위 오버레이도 유리 느낌보다 `solid white surface`를 기본으로 한다.

---

## 7. Grid와 Width 원칙

### 7-1. 기본 수치

1. base grid는 `4`
2. 주요 배수는 `4 / 8 / 12 / 16 / 20 / 24 / 32`
3. 임의값 사용을 줄인다.

### 7-2. 화면 좌우 패딩

| Context | Value |
| ------- | ----- |
| 기본 화면 | `16` |
| 설정/폼 | `16` |
| 인증 화면 | `20` |
| 바텀 CTA bar 내부 | `16` |

규칙:

1. 기존 기본 좌우 패딩 `20`은 일반 화면에서 `16`으로 축소한다.
2. 리스트 행, 메뉴 행, 설정 행은 별도 카드 마진을 두지 않는다.
3. 전체 폭을 더 넓게 써야 하는 화면은 `padding 16 + row full width` 구조를 기본으로 한다.

---

## 8. Spacing 시스템

| Token      | Value |
| ---------- | ----: |
| `space.1`  |     4 |
| `space.2`  |     8 |
| `space.3`  |    12 |
| `space.4`  |    16 |
| `space.5`  |    20 |
| `space.6`  |    24 |
| `space.8`  |    32 |

규칙:

1. 기본 행간 간격은 `12` 또는 `16`
2. 기본 섹션 간격은 `20` 또는 `24`
3. 페이지 상단 제목 아래 첫 블록 간격은 `12`
4. 리스트 행 사이에는 `마진`보다 `divider`를 우선 사용한다.
5. 카드 내부 패딩은 기본 `20`이 아니라, 필요한 경우만 `16`을 사용한다.

---

## 9. Radius 시스템

| Token           | Value | Usage |
| --------------- | ----: | ----- |
| `radius.xs`     |     6 | 아주 작은 pill, 보조 badge |
| `radius.sm`     |    10 | 입력, 작은 썸네일 |
| `radius.md`     |    12 | 검색창, 필드, 소형 surface |
| `radius.lg`     |    16 | 큰 썸네일, 바텀시트 내부 블록 |
| `radius.sheet`  |    20 | 바텀시트 상단 |
| `radius.full`   |   999 | 원형 버튼, pill |

규칙:

1. 기존 `20~32` 위주의 큰 라운드 사용을 줄인다.
2. 기본 화면 요소는 `10` 또는 `12`를 우선한다.
3. 리스트 row는 카드처럼 크게 둥글게 만들지 않는다.
4. 카드가 아닌 일반 행에는 radius를 강제하지 않는다.

---

## 10. Color 시스템

### 10-1. Text

| Token                   | Value |
| ----------------------- | ----- |
| `color.text.primary`    | `#111111` |
| `color.text.secondary`  | `#5F636B` |
| `color.text.tertiary`   | `#8B9098` |
| `color.text.inverse`    | `#FFFFFF` |

### 10-2. Line and Border

| Token                    | Value |
| ------------------------ | ----- |
| `color.line.default`     | `#ECEEF2` |
| `color.line.strong`      | `#D9DDE3` |

### 10-3. Accent

| Token                     | Value |
| ------------------------- | ----- |
| `color.accent.primary`    | `#FF5C8A` |
| `color.accent.pressed`    | `#F04377` |
| `color.accent.soft`       | `#FFF0F5` |
| `color.accent.mint`       | `#18B26B` |
| `color.accent.warning`    | `#F59E0B` |
| `color.accent.danger`     | `#E5484D` |

규칙:

1. 액센트 핑크는 CTA와 선택 상태에만 사용한다.
2. 배경 전체를 핑크나 크림으로 채우지 않는다.
3. 상태 배지는 soft tint를 우선한다.
4. 본문 텍스트에 액센트 색을 남용하지 않는다.

---

## 11. Typography 시스템

### 11-1. 공통 원칙

1. 폰트는 시스템 폰트를 사용한다.
2. 자간은 명시된 토큰만 사용한다.
3. 제목은 `크게`보다 `선명하게` 보여야 한다.
4. 본문은 대부분 `15` 또는 `14`를 사용한다.
5. 한 화면에서 title 계열은 최대 2종만 사용한다.

### 11-2. Type Scale

| Token                | Font Size | Line Height | Weight | Letter Spacing |
| -------------------- | --------: | ----------: | ------ | -------------: |
| `type.display`       | 32 | 40 | 700 | 0 |
| `type.heading.l`     | 24 | 32 | 700 | 0 |
| `type.heading.m`     | 20 | 28 | 700 | 0 |
| `type.title.l`       | 18 | 24 | 600 | 0 |
| `type.title.m`       | 16 | 22 | 600 | 0 |
| `type.body.l`        | 15 | 22 | 400 | 0 |
| `type.body.m`        | 14 | 20 | 400 | 0 |
| `type.caption`       | 12 | 16 | 500 | 0 |
| `type.micro`         | 11 | 14 | 500 | 0 |
| `type.button`        | 15 | 20 | 600 | 0 |

### 11-3. 사용 규칙

1. 페이지 헤더 타이틀은 기본 `type.title.l`
2. 화면 대표 타이틀은 `type.heading.l` 또는 `type.heading.m`
3. 메뉴 라벨과 row 타이틀은 `type.body.l` 또는 `type.title.m`
4. 주소, 보조정보, 날짜, 상태 설명은 `type.body.m` 또는 `type.caption`
5. 배지는 `type.micro` 또는 `type.caption`만 사용한다.
6. 한국어 UI에서는 기본적으로 음수 자간을 사용하지 않는다.

---

## 12. Divider와 Surface 규칙

### 12-1. Divider

1. 기본 divider는 `1px color.line.default`
2. 섹션 분리는 배경색보다 divider를 우선한다.
3. 리스트 row는 카드 shadow보다 divider를 우선한다.

### 12-2. Shadow

1. 일반 화면에서는 shadow를 최소화한다.
2. shadow 사용 허용 영역:
   - 바텀시트
   - 모달
   - 지도 위 floating control
3. 리스트, 설정, 프로필, 초대 센터 기본 행에는 shadow를 쓰지 않는다.

### 12-3. Card 사용 규칙

1. 카드식 디자인은 기본 패턴에서 제외한다.
2. 아래 경우에만 제한적으로 허용한다.
   - 모달 본문
   - 바텀시트 내부 요약 블록
   - 파괴적 경고 블록
   - 플레이스 상세의 hero 바로 아래 핵심 요약 블록
3. 그 외 화면은 `base background + section + row + divider`로 구성한다.

---

## 13. 핵심 컴포넌트 규격

## 13-1. Header

| Item | Value |
| ---- | ----: |
| Height | `56` |
| Padding X | `16` |
| Leading/Trailing zone | `44 x 44` |
| Title style | `type.title.l` |

규칙:

1. 좌우 밸런스를 반드시 맞춘다.
2. 뒤로가기 버튼이 있으면 우측에도 동일 폭의 빈 영역 또는 액션 영역을 둔다.
3. 헤더 하단 border는 필요한 화면에만 쓴다.

## 13-2. Search Bar

| Item | Value |
| ---- | ----: |
| Height | `48` |
| Radius | `12` |
| Padding X | `14` |
| Icon | `18` |
| Text | `type.body.l` |

규칙:

1. 지도 위에서도 glass 대신 `solid white surface`를 기본으로 한다.
2. 검색창, 필터 버튼, 날짜 선택창은 같은 조형 언어를 사용한다.
3. `shadow + border + 강한 tint`를 동시에 쓰지 않는다.
4. focus는 `line.strong`와 caret로 표현한다.

## 13-3. Text Field / Select Field / Date Trigger

| Item | Value |
| ---- | ----: |
| Height | `48` |
| Radius | `12` |
| Padding X | `14` |
| Text | `type.body.l` |

규칙:

1. 검색창과 같은 height family를 유지한다.
2. 기본 필드는 `bg.subtle + line.default`
3. 에러는 `bg.dangerSoft + error text`로 표현한다.
4. 굵은 빨간 테두리 사용을 지양한다.

## 13-4. Menu Row / Settings Row

| Item | Value |
| ---- | ----: |
| Default height | `52` |
| Comfortable height | `60` |
| Icon frame | `24 x 24` |
| Leading icon | `18` |
| Chevron | `16` |
| Gap | `12` |
| Row padding X | `0` |
| Inner content padding X | `0` |
| Label style | `type.body.l` |
| Value style | `type.body.m` |
| Meta style | `type.caption` |

규칙:

1. 메뉴와 설정 row 높이는 전역적으로 통일한다.
2. 서브텍스트가 없으면 `52`, 있으면 `60`
3. 아이콘, 라벨, 값, chevron 기준선을 맞춘다.
4. `My > menu`, `settings list`, `invite list`, `snapshot entry`는 같은 row 시스템을 공유한다.
5. row 안에서 별도 미니 카드, 배경 박스, 그림자를 넣지 않는다.
6. row 좌우 정렬은 `leading icon -> label block -> trailing value or chevron`으로 고정한다.

### 13-4-A. Settings Row Anatomy

기본 구조:

1. leading icon frame `24`
2. label block
3. optional value
4. trailing chevron or switch

세부 규칙:

1. 아이콘은 항상 `18`
2. 라벨은 `type.body.l`
3. 값 텍스트가 있으면 `type.body.m`
4. 보조 설명이 있으면 `type.caption`
5. row 안 수직 중앙 정렬을 유지한다.
6. chevron은 `16`, 색상은 `text.tertiary`

### 13-4-B. Grouped Menu Block

| Item | Value |
| ---- | ----: |
| Group top margin | `12` |
| Group bottom margin | `0` |
| Group padding X | `16` |
| First row top padding | `0` |
| Last row bottom padding | `0` |
| Divider inset left | `52` |
| Divider inset right | `0` |

규칙:

1. 메뉴 그룹은 `group wrapper + rows + dividers` 구조를 사용한다.
2. 기존처럼 큰 둥근 카드 안에 row를 넣는 구조를 기본값으로 쓰지 않는다.
3. divider는 leading icon frame 뒤에서 시작해 라벨 기준선이 정리되도록 한다.
4. 그룹 간 간격은 `12` 또는 `16`만 사용한다.
5. 메뉴 row 자체에는 별도 margin-bottom을 주지 않는다.

### 13-4-C. My Page 전용 규칙

`MY` 화면의 아래 항목은 별도로 강제한다.

1. 프로필 요약 블록 아래 첫 메뉴 그룹 간격은 `16`
2. `초대/연결 관리`, `알림 설정`, `기념일`, `프로필 수정`은 모두 `52` 높이
3. `로그아웃`, `회원탈퇴`도 동일하게 `52` 높이를 유지한다.
4. danger 영역도 일반 메뉴와 같은 row height를 쓰되, 색만 다르게 한다.
5. 메뉴 라벨은 모두 `15/22/400` 또는 동일 체계의 token으로 고정한다.
6. 메뉴 좌측 아이콘 크기는 전부 `18`으로 통일한다.
7. 그룹 바깥에는 card radius를 두지 않거나, 필요 시 아주 약한 `12` 이하만 허용한다.

## 13-5. Badge / Status Pill

| Item | Value |
| ---- | ----: |
| Compact height | `18` |
| Default height | `20` |
| Padding X | `6` |
| Text | `type.micro` |

규칙:

1. 배지는 지금보다 명확히 작아야 한다.
2. 리스트 행에서는 compact variant만 허용한다.
3. 한 row 안의 배지는 최대 2개까지 허용한다.
4. 배지는 상태 보조 장치이며 제목보다 눈에 띄면 안 된다.

## 13-6. List Row

| Item | Value |
| ---- | ----: |
| Min height | `84` |
| Thumbnail | `64 x 64` |
| Thumbnail radius | `12` |
| Vertical padding | `10` |
| Horizontal padding | `0` |
| Gap | `12` |

규칙:

1. 리스트는 카드가 아니라 row다.
2. row 전체가 탭 영역이다.
3. row 바깥 배경과 내부 배경을 분리하지 않는다.
4. row 사이는 `divider`로만 구분한다.
5. 썸네일은 필수다. 실제 이미지가 없으면 placeholder를 쓴다.

## 13-7. Thumbnail Placeholder

| Item | Value |
| ---- | ----: |
| Size | `64 x 64` |
| Radius | `12` |
| Background | `bg.subtle` |
| Icon | `18~20` |

규칙:

1. 썸네일이 없는 장소도 항상 썸네일 자리 자체는 유지한다.
2. 상태 아이콘은 placeholder 안에 작게만 사용한다.

## 13-8. Bottom CTA Bar

| Item | Value |
| ---- | ----: |
| Height | `80` |
| Padding X | `16` |
| Padding Top | `12` |
| Button Height | `48` |

규칙:

1. 기존보다 더 컴팩트하게 만든다.
2. 흰 배경 + 상단 divider만 사용한다.
3. 과한 radius와 과한 shadow를 쓰지 않는다.

## 13-9. Warning Block

| Item | Value |
| ---- | ----: |
| Radius | `12` |
| Padding | `16` |
| Icon | `18` |

규칙:

1. 카드처럼 떠 있는 경고보다, 바닥에 정리된 정보 블록처럼 보여야 한다.
2. soft danger background를 허용한다.
3. 경고 블록 안 CTA는 1개만 강하게 둔다.

---

## 14. Route Blueprint

## 14-1. List Home

이 화면은 이번 문서의 가장 우선적인 리디자인 대상이다.

필수 규칙:

1. 배경은 `white`
2. 상단 title과 count는 유지하되 크기를 키우지 않는다.
3. search row 높이, filter button 높이, badge 크기를 모두 축소한다.
4. place item은 `카드 금지`
5. 모든 item에 `64 x 64` 썸네일을 둔다.
6. 상태 배지는 compact만 사용한다.
7. 카테고리 배지는 필요할 때만 노출한다.
8. 좌우 패딩 `16` 안에서 row를 직접 렌더링한다.
9. row 내부에 또 별도 카드 패딩을 두지 않는다.
10. row 사이에는 `divider`, 섹션 사이에는 `12~16` 간격만 사용한다.

권장 구조:

1. header
2. search/filter row
3. active chips
4. divider list rows
5. floating add button 또는 하단 CTA

## 14-2. Map Home

필수 규칙:

1. 지도 위 search/filter/location control은 모두 `solid white`
2. glassmorphism은 기본값에서 제외한다.
3. 결과 시트는 white 기반으로 간결하게 정리한다.
4. 저장 장소와 외부 장소 row는 같은 구조를 유지한다.
5. add menu는 action sheet 언어를 쓴다.

## 14-3. My Home

필수 규칙:

1. profile, summary, menu, snapshot, danger를 구조적으로 분리한다.
2. 메뉴는 카드 여러 개보다 grouped rows로 정리한다.
3. danger block은 일반 메뉴와 확실히 구분한다.
4. snapshot entry는 archive row처럼 차분하게 처리한다.

## 14-4. Invite Center

필수 규칙:

1. 코드 영역은 dashed box를 쓰지 않는다.
2. 코드 표시, 코드 입력, 연결 상태는 같은 디자인 문법 안에서 정리한다.
3. 입력 field는 shared field를 쓴다.
4. 버튼 계층은 `생성/참여 > 복사 > 무효화` 순으로 분명해야 한다.

## 14-5. Place Detail

필수 규칙:

1. hero 아래 summary만 예외적으로 surface를 허용한다.
2. 그 외 하위 섹션은 카드 중첩을 줄이고 `section + divider`로 풀어낸다.
3. sticky composer와 primary CTA가 서로 싸우지 않게 우선순위를 정리한다.
4. 메모, 방문, 사진 섹션의 타이포와 간격을 통일한다.

## 14-6. Settings Pages

적용 대상:

1. `settings/profile`
2. `settings/notifications`
3. `settings/anniversary`
4. `settings/disconnect`

필수 규칙:

1. 모두 동일한 header 높이, row 높이, footer bar를 사용한다.
2. helper text 색상과 크기를 통일한다.
3. 입력 field와 toggle row 높이를 맞춘다.
4. settings 페이지는 decorative surface를 거의 쓰지 않는다.
5. grouped settings row는 `56 / 64` 외 높이를 허용하지 않는다.
6. settings 라벨 폰트는 `type.body.l`로 통일한다.
7. settings row 좌우 패딩은 화면 padding을 제외하고 추가 card padding을 두지 않는다.
8. `MY` 화면의 메뉴도 같은 규칙을 따른다.

## 14-7. 불일치 금지 목록

아래 항목은 디자인 불량으로 본다.

1. 같은 메뉴 그룹 안에서 어떤 row는 높이 `52`, 어떤 row는 `60`인 상태
2. 어떤 메뉴는 `title.m`, 어떤 메뉴는 `body.l`을 쓰는 상태
3. 어떤 메뉴는 아이콘이 `18`, 어떤 메뉴는 `22`인 상태
4. divider 시작점이 row마다 다른 상태
5. 그룹마다 card padding이 달라 실제 텍스트 시작선이 어긋나는 상태
6. 프로필 카드, 통계 카드, 메뉴 카드, danger 카드가 모두 다른 radius와 내부 여백을 갖는 상태

---

## 15. 구현 계약

구현 시 반드시 아래 순서를 따른다.

1. `src/theme/tokens.ts`를 이 문서 기준으로 재정의한다.
2. 공통 `Header`, `Field`, `Row`, `Badge`, `ListRow`, `BottomCtaBar`를 먼저 만든다.
3. `List Home`부터 리디자인해서 시스템을 검증한다.
4. 그다음 `My`, `Invite Center`, `Settings`, `Place Detail` 순으로 통일한다.
5. 화면별 ad hoc padding, ad hoc font size, ad hoc radius를 제거한다.

금지:

1. 페이지마다 다른 기본 좌우 패딩
2. 페이지마다 다른 row 높이
3. 페이지마다 다른 본문 폰트 크기
4. 같은 상태를 페이지마다 다른 배지 색으로 표현하는 것
5. 리스트 item을 카드로 다시 되돌리는 것

---

## 16. QA 체크리스트

### 16-1. 배경

1. 기본 화면 배경이 흰색인가
2. 크림톤 background가 제거되었는가
3. 지도 외 화면에서 불필요한 tint 배경이 사라졌는가

### 16-2. 여백

1. 좌우 패딩이 기본 `16`으로 통일되었는가
2. 카드 바깥 여백과 카드 안쪽 여백이 중첩되지 않는가
3. 콘텐츠 폭이 이전보다 넓게 확보되었는가

### 16-3. 타이포

1. header title은 `18/24/600`인가
2. body 기본은 `15/22/400` 또는 `14/20/400`인가
3. caption과 micro가 제멋대로 커지지 않았는가
4. 자간은 토큰 범위 안에서만 쓰였는가

### 16-4. 리스트

1. 모든 항목에 썸네일이 있는가
2. 배지가 작고 보조적으로 보이는가
3. 카드가 아니라 row처럼 읽히는가
4. divider 기반 구조가 유지되는가

### 16-5. 통일성

1. 메뉴 row 높이가 통일되었는가
2. filter / search / date / input이 같은 계열로 느껴지는가
3. footer CTA bar 높이와 구조가 통일되었는가

---

## 17. 최종 요약

이번 리디자인의 핵심은 `감성 카드 앱`에서 `정돈된 화이트 베이스 제품`으로 전환하는 것이다.

가장 중요한 변화는 아래 6가지다.

1. 배경은 흰색으로 통일한다.
2. 카드 중심 설계를 버리고 row 중심 설계로 전환한다.
3. 좌우 패딩과 내부 패딩 중첩을 줄여 실제 콘텐츠 폭을 넓힌다.
4. 폰트 크기, 행간, 자간, 텍스트 색을 전역 토큰으로 고정한다.
5. 리스트 배지는 작게 줄이고, 썸네일은 필수화한다.
6. 모든 메뉴와 설정 row의 높이와 정렬을 통일한다.

이 문서는 이후 실제 UI 구현의 기준서이며, 다음 작업은 이 문서 기준으로 `tokens -> shared components -> list home -> global refactor` 순서로 진행한다.
