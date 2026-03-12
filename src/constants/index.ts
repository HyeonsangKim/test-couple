import { Ionicons } from '@expo/vector-icons';
import { PlaceCategory } from '@/types';
import { colors, component, layout, spacing } from '@/theme/tokens';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

export const CATEGORIES: { key: PlaceCategory; label: string; icon: IoniconsName; color: string }[] = [
  { key: 'food', label: '맛집', icon: 'restaurant-outline', color: colors.category.food },
  { key: 'travel', label: '여행', icon: 'airplane-outline', color: colors.category.travel },
  { key: 'activity', label: '놀거리', icon: 'game-controller-outline', color: colors.category.activity },
  { key: 'special', label: '특별한 장소', icon: 'heart', color: colors.category.special },
  { key: 'uncategorized', label: '기타', icon: 'location-outline', color: colors.category.uncategorized },
];

export const LIMITS = {
  MAX_IMAGES_PER_PLACE: 99,
  MAX_THREAD_MESSAGE_LENGTH: 500,
  MAX_PLACE_NAME_LENGTH: 50,
  MAX_NICKNAME_LENGTH: 12,
  MIN_NICKNAME_LENGTH: 1,
  MAX_INVITE_CODE_LENGTH: 8,
};

export const TIMING = {
  DELETE_GRACE_PERIOD_DAYS: 3,
  INVITE_CODE_EXPIRY_HOURS: 24,
};

export const STATUS_LABELS: Record<string, string> = {
  wishlist: '위시리스트',
  visited: '갔다 온 곳',
  orphan: '기록만 남은 곳',
  all: '전체',
};

export const CATEGORY_LABELS: Record<string, string> = {
  food: '맛집',
  travel: '여행',
  activity: '놀거리',
  special: '특별한 장소',
  uncategorized: '미분류',
  all: '전체',
};

export const NOTIFICATION_LABELS: Record<string, string> = {
  inviteAndConnection: '초대/연결',
  visit: '방문기록',
  threadMessage: '메모',
  placeDelete: '플레이스 삭제',
  disconnect: '연결 해제',
  anniversary: '기념일',
};

export const DEFAULT_MAP_REGION = {
  latitude: 37.5665,
  longitude: 126.978,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const TAB_FLOATING_EDGE_OFFSET = layout.screenPaddingH;
const TAB_FLOATING_STACK_GAP = layout.screenPaddingH;

// Tab scene content 영역(탭 바 상단) 기준 플로팅 배치 규칙
export const TAB_FLOATING = {
  horizontal: TAB_FLOATING_EDGE_OFFSET,
  fabBottom: TAB_FLOATING_EDGE_OFFSET,
  locationBottom: TAB_FLOATING_EDGE_OFFSET + component.button.fab + TAB_FLOATING_STACK_GAP,
  listContentBottomPadding: TAB_FLOATING_EDGE_OFFSET + component.button.fab + spacing[8],
} as const;
