import { create } from 'zustand';
import { InviteCode } from '@/types';
import { inviteService } from '@/services/inviteService';

interface InviteState {
  invite: InviteCode | null;
  isLoading: boolean;
  error: string | null;
  loadInvite: (mapId: string) => Promise<void>;
  createInvite: (mapId: string) => Promise<void>;
  validateInvite: (
    code: string,
  ) => Promise<{ valid: boolean; mapId?: string; inviteCodeId?: string; error?: string }>;
  consumeInvite: (inviteCodeId: string, userId: string) => Promise<void>;
  revokeInvite: (mapId: string) => Promise<void>;
  clearError: () => void;
}

export const useInviteStore = create<InviteState>((set) => ({
  invite: null,
  isLoading: false,
  error: null,

  loadInvite: async (mapId) => {
    set({ isLoading: true });
    const invite = await inviteService.getActiveInvite(mapId);
    set({ invite, isLoading: false });
  },

  createInvite: async (mapId) => {
    set({ isLoading: true, error: null });
    const invite = await inviteService.createInvite(mapId);
    set({ invite, isLoading: false });
  },

  validateInvite: async (code) => {
    set({ isLoading: true, error: null });
    const result = await inviteService.validateInvite(code);
    set({ isLoading: false, error: result.error ?? null });
    return result;
  },

  consumeInvite: async (inviteCodeId, userId) => {
    await inviteService.consumeInvite(inviteCodeId, userId);
    set({ invite: null });
  },

  revokeInvite: async (mapId) => {
    await inviteService.revokeInvite(mapId);
    set({ invite: null });
  },

  clearError: () => set({ error: null }),
}));
