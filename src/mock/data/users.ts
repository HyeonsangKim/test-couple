import { UserProfile, NotificationSettings } from '@/types';

export const MOCK_USERS: UserProfile[] = [
  {
    userId: 'user_me',
    nickname: '나',
    profileImageUri: null,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
  },
  {
    userId: 'user_partner',
    nickname: '자기',
    profileImageUri: null,
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
];

export const CURRENT_USER_ID = 'user_me';

export const MOCK_NOTIFICATION_SETTINGS: NotificationSettings = {
  userId: 'user_me',
  inviteAndConnection: true,
  visit: true,
  threadMessage: true,
  placeDelete: true,
  disconnect: true,
  anniversary: true,
  updatedAt: '2024-01-15T09:00:00Z',
};
