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
    if (isExpired(currentInvite.expiresAt)) {
      currentInvite = null;
      return null;
    }
    return currentInvite;
  },

  createInvite: async (mapId: string, createdBy: string, password: string): Promise<InviteCode> => {
    await delay(300);
    currentInvite = createInviteCode(mapId, createdBy, password);
    return currentInvite;
  },

  validateInvite: async (code: string, password: string): Promise<{ valid: boolean; mapId?: string; error?: string }> => {
    await delay(500);
    if (!currentInvite) return { valid: false, error: '유효하지 않은 초대 코드입니다.' };
    if (currentInvite.code !== code) return { valid: false, error: '유효하지 않은 초대 코드입니다.' };
    if (isExpired(currentInvite.expiresAt)) return { valid: false, error: '만료된 초대 코드입니다.' };
    if (currentInvite.password !== password) return { valid: false, error: '비밀번호가 일치하지 않습니다.' };
    const mapId = currentInvite.mapId;
    currentInvite = null; // consume code
    return { valid: true, mapId };
  },

  revokeInvite: async (): Promise<void> => {
    await delay(200);
    currentInvite = null;
  },
};
