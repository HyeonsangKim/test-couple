# 커플 공유 지도 앱 — CLAUDE.md

## 프로젝트 개요
커플이 함께 사용하는 공유 지도 앱. React Native Expo (SDK 55) + TypeScript strict mode.

## 기술 스택
- **Expo SDK 55**, Expo Router (파일 기반 라우팅, root: `src/app`)
- **TypeScript** strict mode, 경로 별칭 `@/` → `src/`
- **Zustand** 상태 관리 (stores: `src/stores/`)
- **react-native-maps** 지도
- **date-fns** 날짜 처리
- **expo-image-picker** 이미지 선택

## 아키텍처
```
Component → Zustand Store → Service Layer → Mock Data
```
서비스 레이어(`src/services/`)가 백엔드 전환 지점. mock → API 전환 시 서비스 파일만 교체.

## 디렉토리 구조
- `src/app/` — Expo Router 라우트
- `src/components/` — UI, map, place, invite, filter, common 컴포넌트
- `src/stores/` — Zustand 스토어
- `src/services/` — 데이터 접근 계층
- `src/mock/` — 목업 데이터 + 팩토리
- `src/hooks/` — 커스텀 훅
- `src/theme/` — 디자인 토큰
- `src/types/` — TypeScript 인터페이스
- `src/constants/` — 상수
- `src/utils/` — 유틸리티

## 디자인 시스템
- Primary: #FF6B9D (핑크), Secondary: #9D7AFF (라벤더), Mint: #50D492
- Background: #FFFDF7 (크림), 둥근 모서리, 소프트 그림자
- 한국어 UI

## 핵심 규칙
1. 활성 지도는 1개만 가능
2. 공식 플레이스는 중복 불가 (checkDuplicate)
3. 플레이스당 이미지 99개 제한
4. 스레드 메시지 500자 제한
5. 삭제 요청 3일 유예기간
6. 초대 코드 24시간 만료
7. 연결 해제 시 스냅샷 자동 생성

## 명령어
- `npx expo start` — 개발 서버 시작
- `npx tsc --noEmit` — 타입 체크
