import { User } from '@/types';

export const MOCK_USERS: User[] = [
  {
    id: 'user_me',
    nickname: '나',
    profileColor: '#FF6B9D',
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'user_partner',
    nickname: '자기',
    profileColor: '#9D7AFF',
    createdAt: '2024-01-20T14:30:00Z',
  },
];

export const CURRENT_USER_ID = 'user_me';
