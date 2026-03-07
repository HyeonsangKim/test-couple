import { Category } from '@/types';

export const CATEGORIES: { key: Category; label: string; emoji: string }[] = [
  { key: 'food', label: '맛집', emoji: '🍽️' },
  { key: 'travel', label: '여행', emoji: '✈️' },
  { key: 'fun', label: '놀거리', emoji: '🎉' },
  { key: 'special', label: '특별한 장소', emoji: '💝' },
  { key: 'none', label: '미분류', emoji: '📍' },
];

export const LIMITS = {
  MAX_IMAGES_PER_PLACE: 99,
  MAX_THREAD_MESSAGE_LENGTH: 500,
  MAX_PLACE_NAME_LENGTH: 50,
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
  fun: '놀거리',
  special: '특별한 장소',
  none: '미분류',
  all: '전체',
};
