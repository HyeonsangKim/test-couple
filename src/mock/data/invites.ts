import { InviteCode } from '@/types';

const now = new Date();
const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours from now (near expiry)

export const MOCK_INVITE: InviteCode | null = {
  code: 'ABC123',
  mapId: 'map_1',
  password: '1234',
  createdBy: 'user_me',
  createdAt: new Date(now.getTime() - 22 * 60 * 60 * 1000).toISOString(),
  expiresAt,
};
