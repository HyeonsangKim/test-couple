import { delay } from '@/mock/delay';
import { MOCK_INVITE } from '@/mock/data';
import { createInviteCode } from '@/mock/generators';
import { InviteCode } from '@/types';
import { isExpired } from '@/utils/date';

let currentInvite: InviteCode | null = MOCK_INVITE ? { ...MOCK_INVITE } : null;

export const inviteService = {
  getActiveInvite: async (mapId: string): Promise<InviteCode | null> => {
    await delay(200);
    if (!currentInvite) return null;
    if (currentInvite.mapId !== mapId) return null;
    if (currentInvite.status !== 'active') return null;
    if (isExpired(currentInvite.expiresAt)) {
      currentInvite = { ...currentInvite, status: 'expired' };
      return null;
    }
    return currentInvite;
  },

  createInvite: async (mapId: string): Promise<InviteCode> => {
    await delay(300);
    if (currentInvite?.status === 'active') {
      currentInvite = { ...currentInvite, status: 'revoked' };
    }
    currentInvite = createInviteCode(mapId);
    return currentInvite;
  },

  validateInvite: async (code: string): Promise<{ valid: boolean; mapId?: string; error?: string }> => {
    await delay(500);
    if (!currentInvite) return { valid: false, error: '유효하지 않은 초대 코드입니다.' };
    if (currentInvite.code.toUpperCase() !== code.toUpperCase()) return { valid: false, error: '유효하지 않은 초대 코드입니다.' };
    if (currentInvite.status !== 'active') return { valid: false, error: '이미 사용되었거나 만료된 초대 코드입니다.' };
    if (isExpired(currentInvite.expiresAt)) {
      currentInvite = { ...currentInvite, status: 'expired' };
      return { valid: false, error: '만료된 초대 코드입니다.' };
    }
    const mapId = currentInvite.mapId;
    currentInvite = { ...currentInvite, status: 'used', usedAt: new Date().toISOString() };
    return { valid: true, mapId };
  },

  revokeInvite: async (): Promise<void> => {
    await delay(200);
    if (currentInvite?.status === 'active') {
      currentInvite = { ...currentInvite, status: 'revoked' };
    }
  },
};
