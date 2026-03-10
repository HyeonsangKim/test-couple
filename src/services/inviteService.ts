import { delay } from '@/mock/delay';
import { MOCK_INVITE } from '@/mock/data';
import { createInviteCode } from '@/mock/generators';
import { InviteCode } from '@/types';
import { isExpired } from '@/utils/date';

let inviteCodes: InviteCode[] = MOCK_INVITE ? [{ ...MOCK_INVITE }] : [];

export const inviteService = {
  getActiveInvite: async (mapId: string): Promise<InviteCode | null> => {
    await delay(200);
    const invite = inviteCodes.find((ic) => ic.mapId === mapId && ic.status === 'active');
    if (!invite) return null;
    if (isExpired(invite.expiresAt)) {
      inviteCodes = inviteCodes.map((ic) =>
        ic.inviteCodeId === invite.inviteCodeId ? { ...ic, status: 'expired' } : ic
      );
      return null;
    }
    return invite;
  },

  createInvite: async (mapId: string): Promise<InviteCode> => {
    await delay(300);
    // Revoke any existing active invite for this map
    inviteCodes = inviteCodes.map((ic) =>
      ic.mapId === mapId && ic.status === 'active' ? { ...ic, status: 'revoked' } : ic
    );
    const newInvite = createInviteCode(mapId);
    inviteCodes = [...inviteCodes, newInvite];
    return newInvite;
  },

  validateInvite: async (code: string, userId?: string): Promise<{ valid: boolean; mapId?: string; error?: string }> => {
    await delay(500);
    const invite = inviteCodes.find((ic) => ic.code.toUpperCase() === code.toUpperCase());
    if (!invite) return { valid: false, error: '유효하지 않은 초대 코드입니다.' };
    if (invite.status !== 'active') return { valid: false, error: '이미 사용되었거나 만료된 초대 코드입니다.' };
    if (isExpired(invite.expiresAt)) {
      inviteCodes = inviteCodes.map((ic) =>
        ic.inviteCodeId === invite.inviteCodeId ? { ...ic, status: 'expired' } : ic
      );
      return { valid: false, error: '만료된 초대 코드입니다.' };
    }
    const mapId = invite.mapId;
    inviteCodes = inviteCodes.map((ic) =>
      ic.inviteCodeId === invite.inviteCodeId
        ? { ...ic, status: 'used', usedByUserId: userId ?? null, usedAt: new Date().toISOString() }
        : ic
    );
    return { valid: true, mapId };
  },

  revokeInvite: async (mapId: string): Promise<void> => {
    await delay(200);
    inviteCodes = inviteCodes.map((ic) =>
      ic.mapId === mapId && ic.status === 'active' ? { ...ic, status: 'revoked' } : ic
    );
  },
};
