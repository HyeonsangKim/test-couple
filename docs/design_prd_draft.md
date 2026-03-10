<!-- markdownlint-disable MD013 -->

# Design System PRD v1

## 커플 공유 지도 앱 MD 단독 기준서

문서 상태: 구현 기준 초안  
문서 원칙: 이 문서는 외부 Figma, 외부 이미지 레퍼런스, 별도 스타일 가이드 없이도 디자인 시스템과 화면 구조를 구현할 수 있도록 작성된 단일 기준 문서다. 앱 아이콘, 런처 아이콘, 브랜드 마크 시스템은 이 문서 범위에서 제외한다.

---

## 1. 문서 목적

이 문서는 커플 공유 지도 앱의 시각 언어, 디자인 토큰, 컴포넌트 규격, 화면 구성 원칙, 상태 표현 방식, 구현 금지 패턴을 수치화하여 정의한다.

핵심 목표:

1. Claude Code가 이 문서만 읽고도 원하는 분위기의 UI를 구현할 수 있어야 한다.
2. 감성적이고 유려한 화면을 만들되, 결정 기준은 모두 문서 안에서 수치화되어 있어야 한다.
3. 기존 코드의 컴포넌트 구조를 활용하더라도 최종 시각 결과는 이 문서의 기준과 동일해야 한다.

## 1-1. 에이전트 작업 원칙

1. 이 문서는 디자인의 단일 소스 오브 트루스다.
2. 이 문서와 기존 `src/theme/tokens.ts`가 충돌하면 이 문서가 우선한다.
3. 새 컴포넌트를 만들든 기존 컴포넌트를 바꾸든, 결과물은 이 문서의 토큰과 조합 규칙을 따라야 한다.
4. 구현 편의를 위해 임의로 새 스타일 방향을 만들면 안 된다.
5. 모호한 부분이 생기면 `더 단순하고 더 고급스럽고 더 조용한 방향`을 우선한다.
6. 채도가 높은 장식보다 `여백`, `표면 레이어`, `크고 명확한 타이포 위계`, `부드러운 시트 구조`를 우선한다.
7. 모바일 앱 화면만 기준으로 한다.

---

## 2. 디자인 한 줄 정의

이 앱은 `기록용 지도 툴`이 아니라, `커플의 장소와 추억을 담는 프리미엄 라이프스타일 앱`처럼 보여야 한다.

---

## 3. 최종적으로 느껴져야 하는 분위기

### 3-1. 사용자 첫인상

1. 부드럽다.
2. 정돈되어 있다.
3. 고급스럽지만 과장되지 않는다.
4. 지도와 기록이 감성적인 콘텐츠처럼 느껴진다.
5. 누르기 쉽고, 읽기 쉽고, 숨 쉴 공간이 많다.

### 3-2. 감정 키워드

1. Soft
2. Calm
3. Premium
4. Warm
5. Intimate
6. Layered
7. Editorial
8. Native

### 3-3. 금지 키워드

1. Technical
2. Busy
3. Cheap
4. Neon
5. Boxy
6. Dense
7. Admin-like

---

## 4. 디자인 방향 문장

### 4-1. 시각 방향

1. 전체 배경은 밝고 따뜻한 뉴트럴 톤을 사용한다.
2. 카드, 시트, 검색창은 모두 하나의 `부드러운 떠 있는 표면`처럼 느껴져야 한다.
3. 주요 액션은 선명한 포인트 컬러로 처리하되, 화면 전체의 10~15%만 차지해야 한다.
4. 정보가 많아도 빽빽해 보이지 않도록 큰 여백과 라운드를 유지한다.
5. 텍스트 위계는 강해야 하고, 장식은 약해야 한다.

### 4-2. 인터랙션 방향

1. 주요 전환은 `시트가 올라오고`, `카드가 확장되고`, `오브젝트가 부드럽게 눌리는` 감각을 준다.
2. 빠르고 차가운 전환보다 부드럽고 안정적인 전환을 우선한다.
3. 모달보다 바텀시트를 더 자주 사용한다.
4. 지도는 배경이고, 실제 탐색 경험의 중심은 상단 검색과 하단 결과 시트다.

### 4-3. 콘텐츠 방향

1. 장소는 데이터가 아니라 기억의 단위처럼 보여야 한다.
2. 방문 기록, 사진, 메모는 기능 블록이 아니라 감성형 콘텐츠 카드처럼 보여야 한다.
3. 스냅샷과 기록 화면은 도구 UI가 아니라 조용한 아카이브 UI처럼 보여야 한다.

### 4-4. 약한 불투명 글라스모피즘 방향

1. 이 앱은 전면적인 글라스모피즘 앱이 아니다.
2. 글라스모피즘은 `지도`, `사진`, `히어로 이미지` 위에 떠 있는 일부 컨트롤에서만 제한적으로 사용한다.
3. 목표는 투명하고 차가운 유리 느낌이 아니라 `밀키하고 불투명한 프리미엄 표면`이다.
4. 텍스트 가독성을 해칠 정도의 투명도는 금지한다.
5. 일반 카드, 설정 리스트, 폼 본문, 기본 바텀시트 본문에는 글라스모피즘을 쓰지 않는다.
6. 앱 아이콘, 런처 아이콘, 브랜딩 마크에는 글라스모피즘 규칙을 적용하지 않는다.

---

## 5. 플랫폼 및 구현 기준

### 5-1. 디바이스 기준

1. 기준 화면은 `390 x 844`
2. 최소 대응 폭은 `360`
3. 최대 기본 설계 폭은 `430`
4. Safe Area를 반드시 고려한다.

### 5-2. 단위 기준

1. 모든 수치는 문서 기준 `px`로 표기한다.
2. React Native에서는 동일 numeric value로 구현한다.
3. 폰트는 별도 커스텀 폰트 없이 시스템 폰트를 사용한다.
4. iOS는 SF Pro 계열, Android는 기본 시스템 폰트를 사용한다.

### 5-3. 접근성 기준

1. 모든 터치 요소는 최소 `44 x 44`
2. 본문 대비는 `4.5:1` 이상
3. 큰 텍스트 대비는 `3:1` 이상
4. Dynamic Type 확대 시 제목은 최대 `2줄`, 본문은 최대 `3줄`까지 안정적으로 확장되어야 한다.

---

## 6. 디자인 시스템 구조

이 앱의 디자인 시스템은 아래 8개 층으로 구성한다.

1. Grid
2. Spacing
3. Radius
4. Color
5. Typography
6. Surface and Shadow
7. Motion
8. Component Recipes

---

## 7. Grid 시스템

### 7-1. Base Grid

1. 기본 그리드는 `4`
2. 핵심 배수는 `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48`
3. 임의의 `7`, `11`, `13`, `19` 같은 값은 원칙적으로 사용하지 않는다.

### 7-2. Screen Layout

1. 기본 화면 좌우 패딩은 `20`
2. 보조 폼 화면 좌우 패딩은 `16`
3. 섹션 간 기본 간격은 `24`
4. 카드 간 기본 간격은 `16`
5. 헤더와 첫 콘텐츠 간 간격은 `16`

---

## 8. Spacing Scale

| Token      | Value | Description                |
| ---------- | ----: | -------------------------- |
| `space.1`  |     4 | 미세 보정                  |
| `space.2`  |     8 | 아이콘-텍스트 최소 간격    |
| `space.3`  |    12 | 보조 블록 간격             |
| `space.4`  |    16 | 카드 간격, 내부 보조 패딩  |
| `space.5`  |    20 | 화면 패딩, 카드 기본 패딩  |
| `space.6`  |    24 | 섹션 간격                  |
| `space.7`  |    28 | 검색/시트 큰 컴포넌트 간격 |
| `space.8`  |    32 | 히어로 구간 분리           |
| `space.10` |    40 | 대형 블록 분리             |
| `space.12` |    48 | 온보딩/대표 시각 요소 간격 |

규칙:

1. 작은 간격은 `8` 또는 `12`
2. 기본 간격은 `16` 또는 `20`
3. 큰 섹션 간격은 `24` 또는 `32`
4. 시트 내부는 기본적으로 `20` 패딩을 사용한다.

---

## 9. Radius 시스템

| Token          | Value | Usage                             |
| -------------- | ----: | --------------------------------- |
| `radius.xs`    |     8 | 작은 배지                         |
| `radius.sm`    |    12 | 썸네일, 작은 상태 배경            |
| `radius.md`    |    16 | 입력창, 작은 카드                 |
| `radius.lg`    |    20 | 입력 섹션, 작은 카드              |
| `radius.xl`    |    24 | 기본 카드, 리스트 카드, 상세 카드 |
| `radius.2xl`   |    28 | 검색창, 큰 pill                   |
| `radius.sheet` |    32 | 바텀시트 상단                     |
| `radius.full`  |   999 | 원형, pill                        |

규칙:

1. 검색창은 `28`
2. 카드 기본 반경은 `20` 또는 `24`
3. 감성형 상세 카드와 시트는 `24` 이상을 사용한다.
4. 원형 버튼과 필터 칩은 모두 `full`

---

## 10. Color 시스템

### 10-1. 전체 방향

1. 베이스는 따뜻한 오프화이트와 소프트 그레이를 쓴다.
2. 텍스트는 거의 블랙에 가까운 차콜로 처리한다.
3. 포인트 컬러는 로즈 핑크를 기본으로 하되 과하게 쓰지 않는다.
4. 지도 관련 성공/상태색은 민트 그린을 사용한다.
5. 감성형 기록 화면은 블러시 핑크 계열 그라디언트를 제한적으로 사용할 수 있다.

### 10-2. Palette

| Token                         | Hex                      | Usage                   |
| ----------------------------- | ------------------------ | ----------------------- |
| `color.bg.canvas`             | `#F7F4F2`                | 기본 앱 배경            |
| `color.bg.elevated`           | `#FCFAF8`                | 카드, 시트              |
| `color.bg.soft`               | `#F1ECE9`                | 비활성 입력, 보조 영역  |
| `color.bg.strong`             | `#231F26`                | 검정 CTA, 선택 강조     |
| `color.overlay.dim`           | `rgba(17,14,19,0.18)`    | 시트/모달 딤            |
| `color.text.primary`          | `#201B22`                | 제목, 본문              |
| `color.text.secondary`        | `#6E6772`                | 서브 본문               |
| `color.text.tertiary`         | `#9D96A1`                | placeholder, 비활성     |
| `color.text.inverse`          | `#FFFFFF`                | 진한 배경 위 텍스트     |
| `color.border.soft`           | `rgba(32,27,34,0.08)`    | 구분선, 약한 테두리     |
| `color.border.strong`         | `rgba(32,27,34,0.14)`    | 선택 구분선             |
| `color.glass.fill`            | `rgba(252,250,248,0.82)` | 약한 불투명 글라스 표면 |
| `color.glass.fillStrong`      | `rgba(252,250,248,0.90)` | 텍스트용 글라스 표면    |
| `color.glass.stroke`          | `rgba(255,255,255,0.34)` | 글라스 하이라이트 보더  |
| `color.accent.primary`        | `#E94B82`                | 주요 CTA                |
| `color.accent.primaryPressed` | `#D63D73`                | CTA pressed             |
| `color.accent.primarySoft`    | `#F8DCE7`                | 약한 강조 배경          |
| `color.accent.mint`           | `#27AE60`                | 지도 마커, 성공         |
| `color.accent.amber`          | `#D9A441`                | 주의                    |
| `color.accent.info`           | `#4E8FD6`                | 정보                    |
| `color.gradient.blushStart`   | `#F6D7D0`                | 감성 배경 시작          |
| `color.gradient.blushEnd`     | `#E7B8C8`                | 감성 배경 끝            |

### 10-3. 사용 비율

1. Background and surface: `70%`
2. Text and neutral supporting tones: `20%`
3. Accent color: `10%`

### 10-4. 컬러 사용 규칙

1. 한 화면에서 강한 포인트 컬러는 최대 `1개`만 주인공으로 사용한다.
2. Primary CTA는 항상 화면 내 가장 강한 채도여야 한다.
3. 핑크와 민트를 동시에 강하게 쓰지 않는다.
4. 위험 액션은 핫핑크가 아니라 `danger red` 또는 `차콜 + 명시적 카피`로 표현한다.
5. 글라스 표면은 항상 밝은 계열이어야 하며 어두운 glass는 사용하지 않는다.

---

## 11. Typography 시스템

### 11-1. 기본 원칙

1. 제목은 크고 굵고 짧아야 한다.
2. 설명 텍스트는 충분히 읽히되 존재감은 낮아야 한다.
3. 정보가 많을수록 글자 크기를 줄이는 것이 아니라 여백과 그룹화를 늘린다.

### 11-2. Type Scale

| Token            | Size / Line Height | Weight | Usage                      |
| ---------------- | ------------------ | -----: | -------------------------- |
| `type.display.l` | `40 / 48`          |    700 | 온보딩, 감성형 메인 타이틀 |
| `type.display.m` | `32 / 40`          |    700 | 상세 화면 대표 제목        |
| `type.heading.l` | `28 / 36`          |    700 | 큰 섹션 제목               |
| `type.heading.m` | `24 / 32`          |    700 | 시트 제목, 화면 제목       |
| `type.title.l`   | `20 / 28`          |    700 | 카드 제목                  |
| `type.title.m`   | `18 / 26`          |    600 | 리스트 제목, 주요 라벨     |
| `type.body.l`    | `17 / 24`          |    400 | 기본 본문                  |
| `type.body.m`    | `15 / 22`          |    400 | 보조 본문                  |
| `type.body.s`    | `14 / 20`          |    400 | 주소, 메타 본문            |
| `type.caption`   | `13 / 18`          |    500 | 배지, 날짜, 상태           |
| `type.micro`     | `12 / 16`          |    500 | 타이머, 작은 라벨          |
| `type.button.l`  | `17 / 22`          |    600 | 메인 버튼                  |
| `type.button.m`  | `15 / 20`          |    600 | 보조 버튼                  |

### 11-3. 타이포 규칙

1. 대제목은 최대 `2줄`
2. 카드 제목은 최대 `2줄`
3. 주소/설명은 최대 `2줄`
4. 타이머/상태 텍스트는 `micro` 또는 `caption`
5. 큰 제목 아래 보조 설명은 반드시 `secondary` 컬러를 사용한다.

---

## 12. Surface, Border, Shadow

### 12-1. Border

1. 일반 구분선: `1px rgba(32,27,34,0.08)`
2. 선택 구분선: `1px rgba(32,27,34,0.14)`
3. 두꺼운 보더는 사용하지 않는다.

### 12-2. Shadow Tokens

| Token          | Value                         |
| -------------- | ----------------------------- |
| `shadow.sm`    | `0 4 12 rgba(32,27,34,0.06)`  |
| `shadow.md`    | `0 8 24 rgba(32,27,34,0.08)`  |
| `shadow.lg`    | `0 12 32 rgba(32,27,34,0.10)` |
| `shadow.xl`    | `0 18 44 rgba(32,27,34,0.12)` |
| `shadow.glass` | `0 10 28 rgba(32,27,34,0.10)` |

### 12-3. Surface 규칙

1. 카드 기본 표면은 `color.bg.elevated`
2. 시트 기본 표면은 `color.bg.elevated`
3. 지도 위 떠 있는 요소는 `shadow.md` 이상
4. 카드와 배경을 구분하는 가장 큰 수단은 `radius + surface contrast + soft shadow`다.
5. 너무 강한 블러, 너무 진한 그림자는 금지한다.

### 12-4. Opaque Glass 규칙

1. 글라스 표면은 항상 `82% ~ 90%` 불투명도의 밝은 밀키 표면이어야 한다.
2. 글라스 표면은 `얇은 하이라이트 stroke + soft shadow`를 함께 사용한다.
3. iOS blur는 허용하되 강도는 `8 ~ 12` 수준으로 제한한다.
4. blur 미지원 환경에서는 `color.glass.fillStrong` 기반의 불투명 표면으로 대체한다.
5. 글라스 표면 위 텍스트는 반드시 `text.primary` 또는 `text.secondary`만 사용한다.
6. 넓은 읽기용 카드에는 글라스 효과를 사용하지 않는다.

### 12-5. 글라스모피즘 허용 대상

1. 지도 화면 상단 검색바
2. 지도 화면의 필터 버튼, 위치 버튼, back 버튼 같은 플로팅 아이콘 버튼
3. 히어로 이미지 위 back/share/favorite 버튼
4. 이미지 위 page indicator pill
5. 사진 또는 지도 위 segmented control, top chip strip

### 12-6. 글라스모피즘 금지 대상

1. 일반 리스트 카드
2. 설정 카드
3. 기본 바텀시트 본문
4. 긴 본문 텍스트 카드
5. destructive confirm modal
6. 앱 아이콘, 런처 아이콘, 스플래시 아이콘

---

## 13. Motion 시스템

### 13-1. Duration

| Token             |  Value |
| ----------------- | -----: |
| `motion.fast`     |  120ms |
| `motion.normal`   |  180ms |
| `motion.emphasis` |  260ms |
| `motion.sheet`    |  320ms |
| `motion.page`     |  280ms |
| `motion.breathe`  | 1400ms |

### 13-2. Motion 규칙

1. 버튼 press scale: `0.98`
2. 카드 press scale: `0.995`
3. 바텀시트 등장: `280 ~ 320ms`
4. 모달 fade: `180 ~ 220ms`
5. 화면 전환은 빠르지만 날카롭지 않아야 한다.

### 13-3. Easing

1. 기본: `ease-out`
2. 시트: `cubic-bezier(0.22, 1, 0.36, 1)`
3. 빠른 상태 전환: `ease-out`

---

## 14. 공용 컴포넌트 규격

## 14-1. Header

| Item                 | Spec           |
| -------------------- | -------------- |
| Height               | `56`           |
| Horizontal padding   | `20`           |
| Leading icon button  | `48 x 48`      |
| Trailing action zone | min `48`       |
| Title style          | `type.title.l` |

규칙:

1. 헤더는 항상 좌우 균형이 맞아야 한다.
2. 좌측에 뒤로가기 버튼이 있으면 우측도 최소 동일 폭의 빈 영역 또는 액션 영역을 둔다.

## 14-2. Floating Icon Button

| Item       | Spec                |
| ---------- | ------------------- |
| Size       | `48 x 48`           |
| Radius     | `24`                |
| Icon size  | `24`                |
| Shadow     | `shadow.md`         |
| Background | `color.bg.elevated` |

글라스 변형:

1. `variant.glass` 허용
2. Fill: `color.glass.fillStrong`
3. Stroke: `1px color.glass.stroke`
4. Shadow: `shadow.glass`
5. 사용 위치: 지도 위, 히어로 이미지 위

## 14-3. Search Bar

| Item                  | Spec          |
| --------------------- | ------------- |
| Height                | `56`          |
| Radius                | `28`          |
| Horizontal padding    | `20`          |
| Left icon size        | `20`          |
| Right clear icon size | `20`          |
| Text style            | `type.body.l` |

규칙:

1. 검색바는 거의 항상 흰색 표면 위에 떠 있어야 한다.
2. 포커스 상태는 테두리보다 그림자와 커서로 보여준다.
3. placeholder는 `text.tertiary`를 사용한다.
4. 지도 위 검색바는 기본적으로 `opaque glass variant`를 사용한다.
5. 일반 검색 페이지의 검색바는 `solid elevated variant`를 사용한다.

## 14-4. Chip

| Item       | Spec           |
| ---------- | -------------- |
| Height     | `44`           |
| Radius     | `22`           |
| Padding X  | `16`           |
| Text style | `type.title.m` |

상태:

1. Default: `bg.elevated`
2. Selected neutral: `bg.soft`
3. Selected accent: `accent.primarySoft`
4. Disabled opacity: `0.45`

글라스 변형:

1. 지도 또는 사진 위 칩만 허용
2. Fill: `color.glass.fill`
3. Stroke: `1px color.glass.stroke`
4. Shadow: `shadow.glass`

## 14-5. Primary Button

| Item       | Spec            |
| ---------- | --------------- |
| Height     | `56`            |
| Radius     | `28`            |
| Padding X  | `24`            |
| Text style | `type.button.l` |

변형:

1. `fill-primary`: `accent.primary`
2. `fill-dark`: `bg.strong`
3. `soft-secondary`: `bg.soft`
4. `ghost-danger`: 텍스트만 `danger` 톤

## 14-6. Card

| Item         | Spec          |
| ------------ | ------------- |
| Radius       | `24`          |
| Padding      | `20`          |
| Internal gap | `12`          |
| Background   | `bg.elevated` |
| Shadow       | `shadow.sm`   |

규칙:

1. 한 카드 안의 핵심 액션은 최대 `1개`
2. 메타 정보는 카드 하단 또는 우측 정렬이 아니라 `그룹 블록`으로 정리한다.

## 14-7. List Card

| Item             | Spec      |
| ---------------- | --------- |
| Min height       | `104`     |
| Radius           | `24`      |
| Padding          | `16`      |
| Thumbnail        | `72 x 72` |
| Thumbnail radius | `16`      |
| Gap              | `16`      |

## 14-8. Bottom Sheet

| Item                     | Spec              |
| ------------------------ | ----------------- |
| Top radius               | `32`              |
| Handle                   | `36 x 4`          |
| Top padding              | `12`              |
| Inner horizontal padding | `20`              |
| Default snap points      | `40% / 72% / 90%` |

규칙:

1. 지도 검색 결과는 기본적으로 바텀시트 경험으로 푼다.
2. 선택지가 여러 개인 경우에는 alert보다 sheet를 우선한다.
3. sheet 내부에 또 다른 floating card를 중첩하지 않는다.

## 14-9. Modal

| Item              | Spec  |
| ----------------- | ----- |
| Horizontal margin | `20`  |
| Max width         | `360` |
| Radius            | `28`  |
| Padding           | `24`  |

## 14-10. Hero Image Area

| Item                   | Spec   |
| ---------------------- | ------ |
| Height                 | `360`  |
| Crop ratio target      | `4:3`  |
| Overlay button offset  | `20`   |
| Page indicator padding | `8 12` |
| Indicator radius       | `12`   |

## 14-11. Date Range Panel

| Item              | Spec             |
| ----------------- | ---------------- |
| Panel radius      | `28`             |
| Panel padding     | `20`             |
| Tab height        | `52`             |
| Date cell         | `44 x 44`        |
| Selected date     | `44 x 44` circle |
| Range band radius | `16`             |

## 14-12. Banner / Notice

| Item       | Spec          |
| ---------- | ------------- |
| Radius     | `20`          |
| Padding    | `16`          |
| Icon size  | `20`          |
| Text style | `type.body.s` |

규칙:

1. 강한 경고 배너는 `danger tint`나 `soft neutral + warning icon`을 사용한다.
2. 상단에 여러 배너를 쌓지 않는다.

## 14-13. Text Field

| Item                 | Spec |
| -------------------- | ---- |
| Field height         | `56` |
| Large field height   | `64` |
| Radius               | `20` |
| Horizontal padding   | `16` |
| Vertical padding     | `16` |
| Prefix / suffix icon | `20` |
| Label to field gap   | `8`  |
| Helper to field gap  | `8`  |

규칙:

1. 기본 field는 `bg.soft + border.soft` 조합을 사용한다.
2. 독립 입력 페이지에서는 field 자체에 그림자를 주지 않는다.
3. field가 card 안에 놓일 때는 card와 시각적으로 싸우지 않도록 border 대비를 약하게 유지한다.
4. placeholder는 `text.tertiary`, 입력값은 `text.primary`, helper는 `text.secondary`를 사용한다.
5. 오류 상태는 `danger tint + helper text`로 표현하고 두꺼운 붉은 보더는 쓰지 않는다.

## 14-14. Text Area / Message Composer

| Item                     | Spec  |
| ------------------------ | ----- |
| Form textarea min height | `132` |
| Form textarea max height | `196` |
| Composer min height      | `52`  |
| Composer max height      | `116` |
| Radius                   | `20`  |
| Padding                  | `16`  |
| Attachment icon          | `20`  |
| Internal gap             | `12`  |

규칙:

1. 긴 메모 입력은 `form textarea`를 사용한다.
2. 짧은 대화형 입력은 `composer variant`를 사용한다.
3. textarea와 composer 모두 기본 표면은 `bg.soft`다.
4. 텍스트 입력이 길어질수록 높이가 늘어나야 하고, 최초 레이아웃 점프는 최소화한다.

## 14-15. Segmented Control

| Item              | Spec            |
| ----------------- | --------------- |
| Container height  | `52`            |
| Container radius  | `26`            |
| Container padding | `4`             |
| Thumb height      | `44`            |
| Thumb radius      | `22`            |
| Segment min width | `72`            |
| Text style        | `type.button.m` |

규칙:

1. segment 개수는 `2~3개`를 기본으로 한다.
2. 기본 variant는 `bg.soft container + elevated thumb`를 사용한다.
3. 지도나 사진 위에서는 `opaque glass variant`를 허용한다.
4. selected state는 thumb, 텍스트 대비, 아이콘 대비 중 최소 2개로 보여준다.

## 14-16. Settings Row

| Item               | Spec      |
| ------------------ | --------- |
| Default height     | `56`      |
| Comfortable height | `64`      |
| Horizontal padding | `16`      |
| Vertical padding   | `16`      |
| Leading icon frame | `32 x 32` |
| Inter-item gap     | `12`      |
| Chevron size       | `16`      |
| Value max width    | `40%`     |

규칙:

1. 기본 settings row는 하나의 grouped card 안에 배치한다.
2. subtitle이 있는 row만 `64` 높이를 사용한다.
3. row 내부 액센트 컬러는 상태 표시를 제외하고 사용하지 않는다.
4. destructive row는 일반 row와 섞지 않고 danger section으로 분리한다.

## 14-17. Toggle Row

| Item               | Spec      |
| ------------------ | --------- |
| Row height         | `56`      |
| Comfortable height | `64`      |
| Horizontal padding | `16`      |
| Inter-item gap     | `12`      |
| Switch track       | `52 x 32` |
| Switch thumb       | `28`      |
| Helper gap         | `4`       |

규칙:

1. toggle row는 `label block -> switch` 구조를 고정한다.
2. helper text가 필요한 경우 label 아래 `4` 간격으로 배치한다.
3. switch는 네이티브 톤을 따르되, off 상태도 지나치게 대비가 약해지지 않게 유지한다.

## 14-18. Avatar

| Token       | Size | Usage                        |
| ----------- | ---: | ---------------------------- |
| `avatar.xs` | `32` | row leading, 작은 상태칩 옆  |
| `avatar.sm` | `40` | 댓글/메시지 작성자           |
| `avatar.md` | `56` | 카드 내 프로필 블록          |
| `avatar.lg` | `80` | 마이 홈 프로필 카드          |
| `avatar.xl` | `96` | 프로필 편집 상단 대표 이미지 |

규칙:

1. avatar는 항상 `radius.full`을 사용한다.
2. 이미지가 없을 때는 `bg.soft + text.secondary` placeholder를 사용한다.
3. 히어로 이미지나 강한 사진 위 avatar는 `2px elevated stroke`를 둘 수 있다.

## 14-19. Badge / Status Pill

| Item               | Spec           |
| ------------------ | -------------- |
| Compact height     | `24`           |
| Default height     | `28`           |
| Horizontal padding | `12`           |
| Radius             | `full`         |
| Leading dot / icon | `8`            |
| Text style         | `type.caption` |

상태:

1. Neutral: `bg.soft + text.secondary`
2. Saved / Active: `accent.primarySoft + text.primary`
3. Success: `mint tint + dark text`
4. Warning: `amber tint + dark text`
5. Danger: `soft red tint + dark text`
6. Read-only: `bg.soft + micro icon`

규칙:

1. 상태 pill은 제목보다 먼저 읽히지 않게 배치한다.
2. 한 카드 안에서는 서로 다른 색의 상태 pill을 `최대 2개`까지만 허용한다.

## 14-20. Result Row

| Item                | Spec      |
| ------------------- | --------- |
| Compact row height  | `72`      |
| Media row height    | `88`      |
| Horizontal padding  | `20`      |
| Vertical padding    | `12`      |
| Leading thumbnail   | `56 x 56` |
| Thumbnail radius    | `16`      |
| Inter-item gap      | `16`      |
| Trailing affordance | `20`      |

규칙:

1. 지도 검색 결과는 기본적으로 `media row`를 사용한다.
2. 최근 검색이나 짧은 추천 항목만 `compact row`를 사용한다.
3. 전체 row를 터치 영역으로 사용하고 trailing affordance는 보조 신호로만 쓴다.
4. 저장된 장소와 외부 검색 결과는 row 높이는 동일하게 유지하고 배지로만 구분한다.

## 14-21. Archive Row

| Item              | Spec      |
| ----------------- | --------- |
| Row min height    | `92`      |
| Radius            | `20`      |
| Padding           | `16`      |
| Leading thumbnail | `64 x 64` |
| Thumbnail radius  | `16`      |
| Inter-item gap    | `16`      |
| Metadata gap      | `8`       |

규칙:

1. 스냅샷과 아카이브 row는 결과 row보다 조금 더 조용하고 넓어야 한다.
2. leading thumb가 없는 경우에도 좌측 여백 리듬은 유지한다.
3. read-only 맥락에서는 chevron이나 plus affordance를 사용하지 않는다.

## 14-22. Empty State Block

| Item                 | Spec     |
| -------------------- | -------- |
| Max width            | `280`    |
| Top / bottom padding | `64`     |
| Icon size            | `48`     |
| Title to body gap    | `8`      |
| Body to action gap   | `20`     |
| Text align           | `center` |

규칙:

1. empty state는 설명보다 다음 행동을 분명히 제시해야 한다.
2. 큰 일러스트 대신 `icon + title + body + action` 구조를 사용한다.
3. 화면 전체 empty state에서는 세로 중심보다 약간 위에 배치한다.

## 14-23. Skeleton / Loading Placeholder

| Item                 | Spec          |
| -------------------- | ------------- |
| Line height          | `12`          |
| Large line height    | `16`          |
| Line radius          | `8`           |
| Card skeleton height | `104`         |
| Hero skeleton height | `320`         |
| Pulse duration       | `1400ms`      |
| Opacity range        | `0.55 ~ 0.92` |

규칙:

1. shimmer보다 `breathing opacity`를 우선한다.
2. skeleton은 최종 레이아웃의 밀도와 비율을 그대로 따라야 한다.
3. loading 중에도 CTA 위치는 유지해 레이아웃 점프를 줄인다.

## 14-24. Bottom CTA Bar

| Item               | Spec             |
| ------------------ | ---------------- |
| Compact height     | `88`             |
| Prominent height   | `96`             |
| Horizontal padding | `20`             |
| Top padding        | `12`             |
| Bottom padding     | `16 + safe area` |
| Summary block gap  | `4`              |
| Button height      | `56`             |

규칙:

1. form 저장 바는 `88`, 상세 핵심 액션 바는 `96`을 기본으로 한다.
2. 좌측 summary block은 최대 2줄까지만 허용한다.
3. 표면은 기본적으로 `bg.elevated + top border.soft`를 사용하며 glass는 금지한다.
4. 버튼 폭은 전체 바 너비의 `44% ~ 52%` 사이를 유지한다.

## 14-25. Photo Grid / Gallery

| Item              | Spec                |
| ----------------- | ------------------- |
| Grid columns      | `3`                 |
| Grid gap          | `8`                 |
| Tile radius       | `16`                |
| Tile aspect ratio | `1:1`               |
| Tray thumbnail    | `80 x 80`           |
| Tray gap          | `8`                 |
| Selected overlay  | `color.overlay.dim` |
| Count chip height | `28`                |

규칙:

1. 기본 갤러리는 `3열 정사각형 그리드`를 사용한다.
2. 기준 폭 `390`에서는 좌우 패딩 `20`, gap `8` 기준으로 tile이 `111`이 된다.
3. 사진 선택 상태는 체크마크보다 overlay와 scale 차이로 먼저 인지되게 한다.
4. 대표 이미지 표시가 필요하면 별도 crown/icon보다 label pill을 우선한다.

## 14-26. Tab Bar

| Item                  | Spec              |
| --------------------- | ----------------- |
| Bar content height    | `64`              |
| Horizontal padding    | `12`              |
| Top border            | `1px border.soft` |
| Icon size             | `24`              |
| Label style           | `type.micro`      |
| Item min width        | `68`              |
| Item vertical padding | `8`               |

규칙:

1. tab bar는 기본적으로 `bg.elevated` 고정 표면을 사용한다.
2. active state는 `icon + label contrast`로 표현하고 과한 fill pill은 사용하지 않는다.
3. 탭 개수는 `3~4개`를 기본으로 한다.
4. 지도, 리스트, 마이 탭은 시각 구조가 달라도 같은 tab bar를 공유해야 한다.

## 14-27. Action Sheet Row

| Item                | Spec          |
| ------------------- | ------------- |
| Default height      | `56`          |
| Comfortable height  | `64`          |
| Horizontal padding  | `16`          |
| Inter-item gap      | `12`          |
| Leading icon frame  | `32 x 32`     |
| Trailing affordance | `16`          |
| Text style          | `type.body.l` |

규칙:

1. action sheet row는 `아이콘 -> 라벨 -> 보조 설명(optional) -> affordance(optional)` 구조를 사용한다.
2. destructive 항목은 카드 분리 또는 마지막 row로 배치한다.
3. action sheet 내부에서 두 가지 다른 행 높이를 섞지 않는다.

## 14-28. Warning Block

| Item               | Spec          |
| ------------------ | ------------- |
| Radius             | `20`          |
| Padding            | `16`          |
| Icon size          | `20`          |
| Title to body gap  | `8`           |
| Body to action gap | `16`          |
| Text style         | `type.body.m` |

규칙:

1. irreversible action은 banner가 아니라 warning block을 우선 사용한다.
2. 강한 danger 컬러 fill보다 `soft tint + strong title` 조합을 우선한다.
3. 요약 문장, 영향 범위, 마지막 확인 액션을 한 블록 안에서 끝내야 한다.

## 14-29. Component Anatomy Contracts

### Search Bar Anatomy

1. `left icon -> text field -> clear or trailing action`
2. 좌우 padding은 동일해야 한다.
3. placeholder와 입력 텍스트 baseline은 정확히 맞아야 한다.

### Text Field Anatomy

1. `label(optional) -> field shell -> helper(optional)`
2. field shell 내부는 `prefix(optional) -> value -> suffix(optional)` 순서를 따른다.
3. helper가 없을 때도 다음 블록과의 간격은 유지한다.

### List Card Anatomy

1. `thumbnail -> title block -> meta row -> trailing affordance(optional)`
2. title block은 `title + address or description + status/meta` 순서를 유지한다.
3. 상태 배지는 title보다 먼저 읽히면 안 된다.

### Map Result Row Anatomy

1. `leading icon or thumbnail -> title/address block -> saved/add affordance`
2. row 전체를 터치 영역으로 사용한다.
3. 섹션 타이틀은 row보다 시각적 우선순위가 낮아야 한다.

### Place Detail Hero Overlay Anatomy

1. `top-left back`
2. `top-right secondary actions`
3. `optional page indicator near lower-right`
4. 오버레이 액션은 모두 glass 또는 elevated floating variant를 사용한다.

### Settings Row Anatomy

1. `leading icon -> label -> optional value -> chevron`
2. row 높이는 `56` 이상
3. row 안에서 강한 컬러는 사용하지 않는다.

### CTA Bar Anatomy

1. `left summary block -> right primary CTA`
2. 좌측은 최대 2줄, 우측 버튼은 1줄
3. CTA bar는 항상 화면 내 마지막 시각적 우선순위를 가진다.

### Warning Block Anatomy

1. `icon + title -> consequence copy -> action or confirm hint`
2. 경고 카피는 결과를 먼저 쓰고 사유를 나중에 적는다.
3. 한 warning block 안에서는 CTA를 `1개`만 강하게 둔다.

---

## 15. 페이지 인벤토리와 UX 청사진

### 15-0. Route Inventory

| page_id                      | actual_route                         | archetype              | expression | current_fit    | revision_level |
| ---------------------------- | ------------------------------------ | ---------------------- | ---------- | -------------- | -------------- |
| `PG_LOGIN`                   | `/(auth)/login`                      | centered-auth          | `balanced` | `partial`      | `refine`       |
| `PG_WELCOME`                 | `/(auth)/welcome`                    | centered-choice        | `balanced` | `partial`      | `reshape`      |
| `TB_MAP_HOME`                | `/(tabs)/map`                        | floating-map           | `high`     | `partial`      | `reshape`      |
| `TB_LIST_HOME`               | `/(tabs)/list`                       | list-feed              | `balanced` | `partial`      | `refine`       |
| `TB_MY_HOME`                 | `/(tabs)/my`                         | account-home           | `balanced` | `partial`      | `reshape`      |
| `PG_INVITE_CENTER`           | `/(main)/invite-center`              | stacked-cards          | `balanced` | `partial`      | `reshape`      |
| `PG_PLACE_DETAIL`            | `/(main)/place/[id]`                 | hero-detail            | `high`     | `misaligned`   | `rebuild`      |
| `PG_VISIT_FORM`              | `/(main)/visit/form`                 | task-form              | `quiet`    | `partial`      | `reshape`      |
| `PG_PLACE_ADD_SEARCH`        | `/(main)/place/add/search`           | search-results         | `quiet`    | `partial`      | `reshape`      |
| `PG_PLACE_ADD_PIN`           | `/(main)/place/add/pin`              | map-form               | `balanced` | `partial`      | `reshape`      |
| `PG_PLACE_ADD_PHOTO`         | `/(main)/place/add/photo`            | media-picker           | `balanced` | `partial`      | `refine`       |
| `PG_PLACE_CREATE_FROM_PHOTO` | `/(main)/place/add/photo/create`     | form-stack             | `balanced` | `partial`      | `refine`       |
| `PG_RESTORE_DECISION`        | `/(main)/reconnect/restore`          | decision-page          | `balanced` | `missing-flow` | `rebuild`      |
| `PG_SNAPSHOT_DETAIL`         | `/snapshot/[id]`                     | archive-list           | `quiet`    | `partial`      | `refine`       |
| `PG_SETTINGS_PROFILE`        | `/(main)/settings/profile`           | settings-form          | `quiet`    | `partial`      | `reshape`      |
| `PG_SETTINGS_NOTIFICATIONS`  | `/(main)/settings/notifications`     | settings-list          | `quiet`    | `partial`      | `reshape`      |
| `PG_SETTINGS_ANNIVERSARY`    | `/(main)/settings/anniversary`       | settings-form          | `quiet`    | `partial`      | `reshape`      |
| `PG_SETTINGS_DISCONNECT`     | `/(main)/settings/disconnect`        | danger-decision        | `quiet`    | `partial`      | `reshape`      |

### 15-0-1. 리뷰 결론

1. `TB_MAP_HOME`, `PG_PLACE_DETAIL`, `PG_RESTORE_DECISION`은 현재 코드와 목표 경험의 차이가 커서 화면 구조를 다시 잡아야 한다.
2. `TB_LIST_HOME`, `PG_INVITE_CENTER`, `PG_VISIT_FORM`, `PG_SETTINGS_*`는 전체 재설계보다 공용 컴포넌트와 레이아웃 계약을 맞추는 방식이 효율적이다.
3. `PG_LOGIN`, `PG_WELCOME`, `PG_SNAPSHOT_DETAIL`은 방향은 맞지만 시각 강도와 위계가 덜 정리되어 있다.
4. `검색 포커스`는 독립 페이지가 아니라 여러 화면에 걸친 `interaction pattern`으로 다루는 편이 UX적으로 더 자연스럽다.
5. 설정군은 모두 `quiet utility page`로 통일하고, 과한 감성 연출보다 정돈된 여백과 footer action 일관성을 우선한다.

### 15-0-2. 표현 강도 정의

1. `high`: 히어로 이미지, 지도, 콘텐츠 분위기가 핵심인 페이지다. 강한 레이어와 큰 타이포를 허용한다.
2. `balanced`: 콘텐츠와 액션의 균형이 중요하다. 카드와 시트 중심으로 정리하되 과한 연출은 피한다.
3. `quiet`: 설정, 폼, 보조 페이지다. 화려함보다 안정성과 가독성을 우선한다.

### 15-0-3. 개편 강도 정의

1. `rebuild`: 정보 구조부터 다시 잡아야 한다.
2. `reshape`: 현재 화면 골격은 활용하되 블록 순서와 주요 패턴을 재배치해야 한다.
3. `refine`: 현재 구조를 유지하고 토큰, 간격, 카드 규격, CTA 위치를 정리한다.

### 15-0-4. 공통 페이지 규칙

1. 모든 실제 라우트는 하나의 archetype만 가진다.
2. 한 페이지 안에는 `primary CTA`가 시각적으로 하나만 가장 강해야 한다.
3. task page는 `footer CTA bar`, account/settings page는 `content-first + footer action`, content page는 `hero or summary-first`를 따른다.
4. 지도 위 오버레이, 히어로 이미지 위 액션, 검색 포커스 상태만 glass를 허용한다.
5. 검색, 필터, 선택, 삭제 같은 상호작용은 페이지마다 다른 시각 언어로 새로 만들면 안 된다.

## 15-1. 지도 홈

actual route: `/(tabs)/map`  
expression: `high`  
revision level: `reshape`

### 15-1-A. UX 목표

1. 지도는 배경이고, 실제 탐색 경험의 주인공은 검색 row와 결과 sheet다.
2. 사용자는 이 화면에서 `검색`, `필터`, `장소 선택`, `새 장소 추가`를 끊김 없이 이어서 수행해야 한다.
3. add flow는 뜬금없는 별도 modal보다 지도 문맥 안에서 자연스럽게 이어져야 한다.

### 15-1-B. 필수 블록

1. top floating search row
2. map canvas with markers
3. floating secondary actions
4. result sheet
5. add action entry

### 15-1-C. 디자인 / UX 규칙

1. top search row는 `opaque glass variant`를 사용한다.
2. 필터 버튼과 위치 버튼은 search row와 같은 시각 계열로 맞춘다.
3. 결과 리스트는 저장된 장소와 외부 검색 결과를 같은 result row 계열로 보여야 한다.
4. add action은 범용 modal이 아니라 `action sheet` 또는 `bottom sheet menu`를 우선한다.
5. 검색어가 있을 때는 sheet가 즉시 열리고, 검색어가 없을 때는 지도 맥락이 우선이다.

### 15-1-D. 현재 코드와의 차이

1. 현재는 search row와 filter button이 solid surface여서 지도 위 오버레이의 성격이 약하다.
2. 위치 액션이 빠져 있다.
3. add flow가 독립 modal이라 지도 경험에서 분리된다.
4. sheet는 이미 존재하지만, 전체 톤이 utility sheet에 가깝고 floating-map page의 인상이 약하다.

## 15-2. 리스트 홈

actual route: `/(tabs)/list`  
expression: `balanced`  
revision level: `refine`

### 15-2-A. UX 목표

1. 리스트는 설정 목록이 아니라 저장된 장소 피드처럼 느껴져야 한다.
2. 검색과 필터는 보조 도구이고, 실제 중심은 list card 리듬이다.

### 15-2-B. 필수 블록

1. page header
2. search row
3. active filter chips
4. list cards
5. FAB

### 15-2-C. 디자인 / UX 규칙

1. count text는 title보다 시각적 우선순위가 낮아야 한다.
2. active filter chip은 필터가 있을 때만 드러난다.
3. list card는 result row가 아니라 image-led content card로 유지한다.
4. FAB는 지도 탭과 같은 규격을 공유하되 색과 그림자는 동일하게 유지한다.

### 15-2-D. 현재 코드와의 차이

1. 구조는 거의 맞지만 place card가 공용 anatomy 기준으로 완전히 잠겨 있지 않다.
2. hero 이미지 해석이 아직 약하고 메타 배치가 카드마다 조금 흔들릴 수 있다.

## 15-3. 마이 홈

actual route: `/(tabs)/my`  
expression: `balanced`  
revision level: `reshape`

### 15-3-A. UX 목표

1. 이 화면은 설정 목록이 아니라 계정과 관계 상태를 보여주는 home이어야 한다.
2. 위험 액션은 menu card와 섞지 않고 분리된 danger block처럼 보여야 한다.

### 15-3-B. 필수 블록

1. profile card
2. connection or summary card
3. grouped menu card
4. snapshot preview card
5. danger block

### 15-3-C. 디자인 / UX 규칙

1. profile card와 summary card는 읽는 카드, menu card는 조작 카드로 구분한다.
2. snapshot block은 일반 메뉴 row가 아니라 archive preview row 계열로 보여야 한다.
3. logout과 withdrawal은 단순 text row가 아니라 분리된 danger surface 안에 있어야 한다.

### 15-3-D. 현재 코드와의 차이

1. 전체 구조는 맞지만 danger zone이 너무 가볍다.
2. snapshot entry가 account home의 일부라기보다 일반 메뉴처럼 보인다.

## 15-4. 초대 / 연결 센터

actual route: `/(main)/invite-center`  
expression: `balanced`  
revision level: `reshape`

### 15-4-A. UX 목표

1. 초대 코드 생성과 코드 입력은 하나의 관계 관리 화면 안에서 명확히 분리되어야 한다.
2. 연결된 상태에서의 재합류는 반드시 파괴적 경고를 거쳐야 한다.

### 15-4-B. 필수 블록

1. connection status card
2. invite code card
3. join code card
4. destructive confirm modal

### 15-4-C. 디자인 / UX 규칙

1. join code는 실제 text field를 사용해야 한다. `Alert.prompt` 기반 입력은 금지한다.
2. invite code block은 `solid elevated variant`만 사용한다.
3. 연결 상태 card는 긍정 상태를 보여주되 과한 success green fill은 쓰지 않는다.
4. copy, revoke, join action은 버튼 계층을 분명히 나눈다.

### 15-4-D. 현재 코드와의 차이

1. 구조는 갖춰졌지만 입력 UX가 임시적이다.
2. code box가 dashed box 위주라 제품 전체의 프리미엄 카드 톤과 조금 어긋난다.

## 15-5. 장소 상세

actual route: `/(main)/place/[id]`  
expression: `high`  
revision level: `rebuild`

### 15-5-A. UX 목표

1. 이 화면은 utility detail이 아니라 `장소 콘텐츠 페이지`처럼 느껴져야 한다.
2. 사용자는 사진, 상태, 방문 기록, 메모를 하나의 스토리 흐름으로 읽어야 한다.
3. 메모 작성과 핵심 CTA는 동시에 주인공이 되면 안 된다.

### 15-5-B. 필수 블록

1. hero media
2. floating hero actions
3. summary card
4. status and meta strip
5. visit section
6. photo section
7. thread section
8. delete request warning block
9. optional bottom action area

### 15-5-C. 디자인 / UX 규칙

1. hero media는 `360` 높이를 기본으로 한다.
2. back과 secondary actions는 hero 위 glass floating button을 사용한다.
3. title, address, status, category, 핵심 요약은 하나의 summary card 안에서 먼저 읽혀야 한다.
4. thread composer가 고정 하단에 존재한다면 별도의 fixed CTA bar는 두지 않는다.
5. 반대로 add record가 주요 액션이라면 fixed CTA bar를 두고 composer는 section 내부로 내린다.
6. delete request는 banner보다 `warning block` 언어를 우선한다.

### 15-5-D. 현재 코드와의 차이

1. 현재는 hero 아래 일반 section 나열 구조라 콘텐츠 페이지의 힘이 약하다.
2. summary card가 없고 정보가 page body로 흩어져 있다.
3. 하단 message composer가 사실상의 sticky CTA 역할을 가져가고 있어 우선순위가 흐린다.

## 15-6. 방문 기록 작성 / 수정

actual route: `/(main)/visit/form`  
expression: `quiet`  
revision level: `reshape`

### 15-6-A. UX 목표

1. 사용자는 이 화면을 폼으로 느끼기보다 기록 작성 흐름으로 인식해야 한다.
2. 작성과 수정은 같은 레이아웃 언어를 쓰되, edit mode에서만 삭제가 보인다.

### 15-6-B. 필수 블록

1. header
2. place summary card
3. date block
4. photo block
5. footer save action
6. destructive confirm in edit mode

### 15-6-C. 디자인 / UX 규칙

1. date와 photo는 각각 독립 card section으로 묶는다.
2. footer save action은 항상 고정된 위치를 유지한다.
3. edit mode에서도 입력 block의 순서는 create mode와 동일해야 한다.

### 15-6-D. 현재 코드와의 차이

1. 큰 구조는 맞지만 date block과 photo block의 카드 정체성이 아직 약하다.
2. footer는 동작하지만 공용 bottom CTA bar 패턴으로 정리되어 있지 않다.

## 15-7. 장소 검색 추가 화면

actual route: `/(main)/place/add/search`  
expression: `quiet`  
revision level: `reshape`

### 15-7-A. UX 목표

1. 이 화면은 `manual search page`이자 `map result handoff page` 두 역할을 동시에 가져야 한다.
2. 지도에서 선택한 external result가 넘어오면, 사용자는 선택을 잃지 않고 바로 저장 의사결정을 할 수 있어야 한다.

### 15-7-B. 필수 블록

1. header
2. search bar
3. optional selected-result preview
4. result list
5. empty state

### 15-7-C. 디자인 / UX 규칙

1. dedicated search page에서는 glass를 사용하지 않는다.
2. 별도 `검색` 버튼보다 keyboard search action 또는 live search를 우선한다.
3. result row는 `Map Result Row Anatomy`를 그대로 따라야 한다.
4. 지도에서 넘어온 선택 결과가 있으면 상단 preview card로 먼저 보여준다.

### 15-7-D. 현재 코드와의 차이

1. 현재는 일반 search page로만 동작하고 map handoff selected state를 반영하지 않는다.
2. search button이 별도 액션으로 남아 있어 흐름이 한 번 더 끊긴다.

## 15-8. 지도에 핀 찍기

actual route: `/(main)/place/add/pin`  
expression: `balanced`  
revision level: `reshape`

### 15-8-A. UX 목표

1. 지도 조작과 이름 입력은 한 화면 안에 있지만 위계가 분명해야 한다.
2. 사용자는 위치를 먼저 잡고, 이름을 짓고, 마지막에 저장한다.

### 15-8-B. 필수 블록

1. header
2. map region with draggable pin
3. input card
4. footer save action

### 15-8-C. 디자인 / UX 규칙

1. map은 page body의 중심이다.
2. hint text는 지도 하단 보조 설명으로만 둔다.
3. 저장 버튼은 입력 필드 바로 아래가 아니라 footer action 영역에 둔다.

### 15-8-D. 현재 코드와의 차이

1. 현재 save button이 입력 영역 안에 붙어 있어 task completion 감각이 약하다.
2. map과 input의 계층이 조금 평평하다.

## 15-9. 사진으로 추가 화면

actual route: `/(main)/place/add/photo`  
expression: `balanced`  
revision level: `refine`

### 15-9-A. UX 목표

1. 사용자는 먼저 사진을 선택하고, 그 다음 `기존 장소에 붙일지`, `새 장소를 만들지`를 결정해야 한다.
2. 선택 상태가 바뀌어도 footer CTA 위치는 변하지 않아야 한다.

### 15-9-B. 필수 블록

1. photo tray
2. optional selected place preview
3. existing place selection area
4. footer primary CTA

### 15-9-C. 디자인 / UX 규칙

1. photo tray는 보조 감성 요소지만 충분히 크게 보여야 한다.
2. 장소 선택 row는 settings row가 아니라 result row 계열을 사용한다.
3. 새 장소 생성과 기존 장소 선택은 copy와 CTA 라벨로 분명히 구분한다.

## 15-10. 사진으로 새 장소 생성

actual route: `/(main)/place/add/photo/create`  
expression: `balanced`  
revision level: `refine`

### 15-10-A. UX 목표

1. 사진 기반 신규 장소 생성은 `짧은 form-stack`이어야 한다.
2. 사용자는 사진을 잃지 않고 이름과 위치를 보완한 뒤 저장할 수 있어야 한다.

### 15-10-B. 필수 블록

1. draft photo strip
2. place name input
3. map block
4. footer save action

### 15-10-C. 디자인 / UX 규칙

1. photo strip는 첫 블록으로 유지한다.
2. map은 정보 확인용이 아니라 최종 위치 결정용이므로 충분한 높이를 가져야 한다.
3. 저장 액션은 footer에 고정한다.

## 15-11. 연결 복구 결정 화면

actual route: `/(main)/reconnect/restore`  
expression: `balanced`  
revision level: `rebuild`

### 15-11-A. UX 목표

1. 이 화면은 `같은 두 사람의 재연결` 직후에만 노출되어야 한다.
2. 사용자는 `복구`와 `새로 시작`의 결과 차이를 한눈에 이해해야 한다.

### 15-11-B. 필수 블록

1. header
2. snapshot summary card
3. consequence copy
4. restore button
5. new start button
6. irreversible warning copy

### 15-11-C. 디자인 / UX 규칙

1. 복구는 primary, 새로 시작은 secondary 또는 danger-soft로 처리한다.
2. 이 화면은 centered explainer가 아니라 `decision page`여야 한다.
3. actual flow가 연결되지 않은 상태에서는 이 화면만 예쁘게 만들어도 UX는 완성되지 않는다.

### 15-11-D. 현재 코드와의 차이

1. 현재는 실제 복구가 없고, 진입 플로우도 연결되지 않았다.
2. 화면도 centered alert-like page라 decision page의 밀도가 부족하다.

## 15-12. 스냅샷 상세

actual route: `/snapshot/[id]`  
expression: `quiet`  
revision level: `refine`

### 15-12-A. UX 목표

1. read-only와 archive mood가 첫 화면에서 분명해야 한다.
2. 사용자는 이 화면을 수정 가능한 상세가 아니라 보관된 기록으로 인식해야 한다.

### 15-12-B. 필수 블록

1. read-only banner
2. summary block
3. archive rows or cards
4. empty state

### 15-12-C. 디자인 / UX 규칙

1. active accent 사용량을 줄이고 muted surface를 우선한다.
2. 정보 배치는 조용하되, 배너와 summary는 첫 시선에 읽혀야 한다.
3. archive item은 chevron, plus, edit affordance를 쓰지 않는다.

## 15-13. 로그인

actual route: `/(auth)/login`  
expression: `balanced`  
revision level: `refine`

### 15-13-A. UX 목표

1. 한 번에 이해되는 진입 화면이어야 한다.
2. 감성 표현은 있어도 로그인 동작을 방해하면 안 된다.

### 15-13-B. 필수 블록

1. wordmark or symbol area
2. title
3. subtitle
4. single login CTA
5. footer text

### 15-13-C. 디자인 / UX 규칙

1. 중앙 정렬을 유지한다.
2. 강한 CTA는 하나만 둔다.
3. glass는 사용하지 않는다.

## 15-14. 온보딩 선택 화면

actual route: `/(auth)/welcome`  
expression: `balanced`  
revision level: `reshape`

### 15-14-A. UX 목표

1. 세 가지 시작 방법이 명확히 구분되어야 한다.
2. `초대하기`가 가장 권장되는 경로라면 시각적으로도 조금 더 강조되어야 한다.

### 15-14-B. 필수 블록

1. hero area
2. title
3. option cards

### 15-14-C. 디자인 / UX 규칙

1. option card 높이는 모두 같아야 한다.
2. primary path는 fill 또는 stronger icon contrast로 한 단계 강조한다.
3. 나중에 연결 경로는 설명은 유지하되 시각 강도는 가장 약해야 한다.

## 15-15. 프로필 수정

actual route: `/(main)/settings/profile`  
expression: `quiet`  
revision level: `reshape`

### 15-15-A. UX 목표

1. profile page는 화려한 account page가 아니라 차분한 utility form이어야 한다.
2. avatar 수정과 nickname 수정은 같은 task 안에서 자연스럽게 이어져야 한다.

### 15-15-B. 필수 블록

1. header
2. avatar block
3. input card
4. helper copy
5. footer save action

### 15-15-C. 디자인 / UX 규칙

1. avatar block은 상단 hero가 아니라 centered utility block으로 둔다.
2. save action은 inline button보다 footer action이 더 적합하다.
3. 권한 거부나 이미지 선택 실패도 helper copy 또는 notice로 처리할 수 있어야 한다.

## 15-16. 알림 설정

actual route: `/(main)/settings/notifications`  
expression: `quiet`  
revision level: `reshape`

### 15-16-A. UX 목표

1. grouped toggle list가 핵심이다.
2. OS 권한 상태와 앱 내부 토글 상태를 혼동하지 않게 해야 한다.

### 15-16-B. 필수 블록

1. header
2. optional permission notice
3. grouped toggle card
4. helper text

### 15-16-C. 디자인 / UX 규칙

1. toggle row는 같은 높이군을 유지한다.
2. permission notice가 필요한 경우 list 위에 warning or info block으로 둔다.
3. 토글 자체보다 label hierarchy가 먼저 읽혀야 한다.

## 15-17. 기념일 설정

actual route: `/(main)/settings/anniversary`  
expression: `quiet`  
revision level: `reshape`

### 15-17-A. UX 목표

1. preview와 입력이 분리된 차분한 설정 화면이어야 한다.
2. 기념일은 relation feature이므로 solo 상태에서는 안내 방식이 달라져야 한다.

### 15-17-B. 필수 블록

1. preview card
2. date input
3. label input
4. footer save action
5. optional clear action

### 15-17-C. 디자인 / UX 규칙

1. preview card는 감정적이되 과장되지 않아야 한다.
2. input과 action은 settings-form 규격을 따른다.
3. solo or disconnected state에서는 disable form 또는 helper notice 중 하나를 명확히 선택한다.

## 15-18. 연결 해제

actual route: `/(main)/settings/disconnect`  
expression: `quiet`  
revision level: `reshape`

### 15-18-A. UX 목표

1. 이 화면은 centered warning poster가 아니라 `danger-decision page`여야 한다.
2. 사용자는 영향 범위, 스냅샷 생성 결과, 복구 가능 조건을 읽고 난 뒤 마지막 CTA를 눌러야 한다.

### 15-18-B. 필수 블록

1. header
2. warning block
3. impact summary
4. helper copy
5. footer destructive action
6. confirm modal

### 15-18-C. 디자인 / UX 규칙

1. warning icon circle만으로 경고를 처리하지 않는다.
2. 핵심 설명은 warning block 안에서 먼저 끝낸다.
3. disconnect CTA는 content 하단 inline button보다 footer action이 더 적합하다.

## 15-19. 검색 포커스 인터랙션 패턴

actual usage: `TB_MAP_HOME`, `PG_PLACE_ADD_SEARCH`

### 15-19-A. 정의

1. 검색 포커스는 독립 페이지가 아니라 `검색 입력에 시선과 인터랙션을 집중시키는 상태 패턴`이다.
2. 지도 위에서는 `glass search row`, dedicated search page에서는 `solid elevated search row`를 사용한다.

### 15-19-B. 필수 요소

1. focused search bar
2. cancel or clear action
3. result or recent area
4. keyboard-safe spacing

### 15-19-C. UX 규칙

1. glass는 지도 위 포커스 상태에서만 허용한다.
2. dedicated search page에서는 cancel과 search 결과가 더 직접적으로 연결되어야 한다.
3. 검색어 handoff가 있는 경우 selected state를 잃지 않아야 한다.

---

## 16. 상태 표현 규칙

### 16-1. Interactive States

| State    | Rule                                                    |
| -------- | ------------------------------------------------------- |
| Default  | 정돈된 표면과 명확한 위계 유지                          |
| Pressed  | button scale `0.98`, card scale `0.995`, opacity `0.94` |
| Focused  | 아웃라인보다 shadow와 caret 사용                        |
| Selected | fill, contrast, icon 중 최소 2개로 표현                 |
| Disabled | opacity `0.45`, shadow 제거                             |
| Loading  | spinner + label 유지                                    |
| Danger   | 차콜 또는 danger tone + 명시적 카피                     |

### 16-2. Empty State

1. 과하게 큰 일러스트를 쓰지 않는다.
2. 아이콘 크기는 `48`
3. 제목은 `title.m`
4. 설명은 `body.m`
5. 위아래 여백은 `64`를 기본으로 한다.

### 16-3. Error State

1. 오류 카피는 짧고 직접적이어야 한다.
2. 입력 오류는 인라인 텍스트로 처리한다.
3. 파괴적 오류는 확인 모달로 승격한다.

---

## 17. 문체 및 마이크로카피 톤

1. 짧고 부드럽게 쓴다.
2. 지나치게 공손한 문장은 줄인다.
3. 버튼 라벨은 `저장`, `연결`, `추가`, `복구`, `삭제`처럼 동사 중심으로 쓴다.
4. 빈 상태 문구는 설명보다 행동 유도 중심으로 쓴다.
5. 경고 카피는 돌려 말하지 말고 결과를 분명히 적는다.

---

## 18. 구현 금지 패턴

1. 사각형에 가까운 `8~12 radius` 남발
2. 보더 위주의 차가운 레이아웃
3. 정보량을 줄이기 위해 모든 폰트를 작게 만드는 방식
4. CTA를 여러 개 같은 강도로 배치하는 구조
5. 화면 전체를 포인트 컬러로 채우는 방식
6. flat한 흰 배경만으로 끝내는 밋밋한 구성
7. 검색, 필터, 날짜 선택을 각각 다른 시각 언어로 만드는 것
8. 지도 화면을 네비게이션 툴처럼 공학적으로 만드는 것

---

## 19. Claude Code 구현 계약

이 문서를 읽은 Claude Code는 아래를 따라야 한다.

1. `src/theme/tokens.ts`를 이 문서의 토큰 구조에 맞게 재정의한다.
2. 검색바, 버튼, 카드, 시트, 리스트 아이템을 우선 공용 컴포넌트로 정리한다.
3. 지도, 리스트, 상세, 스냅샷, 설정이 한 제품처럼 느껴지도록 표면과 타이포를 통일한다.
4. 새 UI를 만들 때 기존 시스템을 깨는 임의 스타일을 넣지 않는다.
5. 브랜드 포인트 컬러는 CTA와 핵심 상태에만 사용한다.
6. 사진, 지도, 기록 화면에서만 감성형 배경이나 이미지 레이어를 허용한다.
7. 글라스모피즘은 문서에서 허용한 대상에만 제한적으로 사용한다.
8. 기본 결과물은 `조용하지만 확실한 고급감`을 보여야 한다.

---

## 20. 토큰 구현 예시

```ts
export const tokens = {
  color: {
    bg: {
      canvas: "#F7F4F2",
      elevated: "#FCFAF8",
      soft: "#F1ECE9",
      strong: "#231F26",
    },
    overlay: {
      dim: "rgba(17,14,19,0.18)",
    },
    text: {
      primary: "#201B22",
      secondary: "#6E6772",
      tertiary: "#9D96A1",
      inverse: "#FFFFFF",
    },
    border: {
      soft: "rgba(32,27,34,0.08)",
      strong: "rgba(32,27,34,0.14)",
    },
    glass: {
      fill: "rgba(252,250,248,0.82)",
      fillStrong: "rgba(252,250,248,0.90)",
      stroke: "rgba(255,255,255,0.34)",
    },
    accent: {
      primary: "#E94B82",
      primaryPressed: "#D63D73",
      primarySoft: "#F8DCE7",
      mint: "#27AE60",
      amber: "#D9A441",
      info: "#4E8FD6",
    },
    gradient: {
      blushStart: "#F6D7D0",
      blushEnd: "#E7B8C8",
    },
  },
  spacing: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    10: 40,
    12: 48,
  },
  radius: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    "2xl": 28,
    sheet: 32,
    full: 999,
  },
  typography: {
    display: {
      l: { fontSize: 40, lineHeight: 48, fontWeight: "700" },
      m: { fontSize: 32, lineHeight: 40, fontWeight: "700" },
    },
    heading: {
      l: { fontSize: 28, lineHeight: 36, fontWeight: "700" },
      m: { fontSize: 24, lineHeight: 32, fontWeight: "700" },
    },
    title: {
      l: { fontSize: 20, lineHeight: 28, fontWeight: "700" },
      m: { fontSize: 18, lineHeight: 26, fontWeight: "600" },
    },
    body: {
      l: { fontSize: 17, lineHeight: 24, fontWeight: "400" },
      m: { fontSize: 15, lineHeight: 22, fontWeight: "400" },
      s: { fontSize: 14, lineHeight: 20, fontWeight: "400" },
    },
    caption: { fontSize: 13, lineHeight: 18, fontWeight: "500" },
    micro: { fontSize: 12, lineHeight: 16, fontWeight: "500" },
    button: {
      l: { fontSize: 17, lineHeight: 22, fontWeight: "600" },
      m: { fontSize: 15, lineHeight: 20, fontWeight: "600" },
    },
  },
  shadow: {
    sm: {
      shadowColor: "rgba(32,27,34,0.06)",
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 12,
    },
    md: {
      shadowColor: "rgba(32,27,34,0.08)",
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 24,
    },
    lg: {
      shadowColor: "rgba(32,27,34,0.10)",
      shadowOffset: { width: 0, height: 12 },
      shadowRadius: 32,
    },
    xl: {
      shadowColor: "rgba(32,27,34,0.12)",
      shadowOffset: { width: 0, height: 18 },
      shadowRadius: 44,
    },
    glass: {
      shadowColor: "rgba(32,27,34,0.10)",
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 28,
    },
  },
  motion: {
    fast: 120,
    normal: 180,
    emphasis: 260,
    sheet: 320,
    page: 280,
    breathe: 1400,
  },
  component: {
    header: {
      height: 56,
      horizontalPadding: 20,
      iconButton: 48,
    },
    searchBar: {
      height: 56,
      radius: 28,
      icon: 20,
      horizontalPadding: 20,
    },
    input: {
      height: 56,
      heightLarge: 64,
      radius: 20,
      horizontalPadding: 16,
      verticalPadding: 16,
    },
    textarea: {
      minHeight: 132,
      maxHeight: 196,
      composerMinHeight: 52,
      composerMaxHeight: 116,
      radius: 20,
    },
    chip: {
      height: 44,
      radius: 22,
    },
    segmentedControl: {
      height: 52,
      thumbHeight: 44,
      radius: 26,
    },
    settingsRow: {
      height: 56,
      heightComfortable: 64,
      iconFrame: 32,
    },
    toggleRow: {
      height: 56,
      heightComfortable: 64,
      switchTrackWidth: 52,
      switchTrackHeight: 32,
      switchThumb: 28,
    },
    button: {
      primaryHeight: 56,
      floatingIcon: 48,
      fab: 56,
    },
    card: {
      radius: 24,
      padding: 20,
      gap: 12,
    },
    resultRow: {
      compactHeight: 72,
      mediaHeight: 88,
      thumb: 56,
    },
    archiveRow: {
      minHeight: 92,
      thumb: 64,
    },
    avatar: {
      xs: 32,
      sm: 40,
      md: 56,
      lg: 80,
      xl: 96,
    },
    badge: {
      compactHeight: 24,
      defaultHeight: 28,
    },
    emptyState: {
      icon: 48,
      verticalPadding: 64,
      maxWidth: 280,
    },
    skeleton: {
      line: 12,
      lineLarge: 16,
      cardHeight: 104,
      heroHeight: 320,
    },
    gallery: {
      trayThumb: 80,
      gap: 8,
      radius: 16,
    },
    tabBar: {
      contentHeight: 64,
      icon: 24,
    },
    modal: {
      horizontalMargin: 20,
      maxWidth: 360,
      radius: 28,
      padding: 24,
    },
    sheet: {
      topRadius: 32,
      handleWidth: 36,
      handleHeight: 4,
    },
    actionSheetRow: {
      height: 56,
      heightComfortable: 64,
      iconFrame: 32,
    },
    ctaBar: {
      compactHeight: 88,
      prominentHeight: 96,
      buttonHeight: 56,
    },
    warningBlock: {
      radius: 20,
      padding: 16,
      icon: 20,
    },
  },
};
```

---

## 21. 디자인 QA 체크리스트

1. 모든 핵심 표면이 같은 반경 철학 안에 있는가
2. 검색, 필터, 시트, 카드가 하나의 시각 언어를 공유하는가
3. 여백이 충분해서 화면이 숨 쉬는가
4. 제목이 크고 명확해서 첫 시선이 자연스럽게 정리되는가
5. 포인트 컬러가 절제되어 있는가
6. 지도는 배경이고 시트가 경험 중심으로 느껴지는가
7. 상세 화면은 도구가 아니라 콘텐츠처럼 느껴지는가
8. 스냅샷과 기록 화면이 조용한 아카이브 무드를 가지는가
9. 아무 화면도 설정앱이나 관리자 화면처럼 보이지 않는가
10. CTA는 항상 하나가 가장 강하게 보이는가

---

## 22. 최종 요약

이 디자인 시스템의 핵심은 `soft premium lifestyle UI`다.  
수단은 `큰 라운드`, `밝고 따뜻한 표면`, `강한 텍스트 위계`, `절제된 포인트 컬러`, `플로팅 검색/시트 구조`, `부드러운 motion`이다.  
Claude Code는 이 문서만으로도 화면을 구현할 수 있어야 하며, 결과물은 `기능성 앱`보다 `감성적인 커플 기록 서비스`처럼 보여야 한다.
