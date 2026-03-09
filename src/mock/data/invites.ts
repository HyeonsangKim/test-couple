import { InviteCode } from '@/types';

const now = new Date();
const expiresAt = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();

export const MOCK_INVITE: InviteCode | null = {
  inviteCodeId: 'invite_1',
  mapId: 'map_1',
  code: 'AB12CD34',
  status: 'active',
  expiresAt,
  usedByUserId: null,
  usedAt: null,
  createdAt: new Date(now.getTime() - 22 * 60 * 60 * 1000).toISOString(),
};
