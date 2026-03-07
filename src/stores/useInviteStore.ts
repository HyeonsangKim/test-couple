import { create } from 'zustand';
import { InviteCode } from '@/types';
import { inviteService } from '@/services/inviteService';

interface InviteState {
  invite: InviteCode | null;
  isLoading: boolean;
  error: string | null;
  loadInvite: (mapId: string) => Promise<void>;
  createInvite: (mapId: string, createdBy: string, password: string) => Promise<void>;
  validateInvite: (code: string, password: string) => Promise<{ valid: boolean; mapId?: string; error?: string }>;
  revokeInvite: () => Promise<void>;
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

  createInvite: async (mapId, createdBy, password) => {
    set({ isLoading: true, error: null });
    const invite = await inviteService.createInvite(mapId, createdBy, password);
    set({ invite, isLoading: false });
  },

  validateInvite: async (code, password) => {
    set({ isLoading: true, error: null });
    const result = await inviteService.validateInvite(code, password);
    set({ isLoading: false, error: result.error ?? null });
    return result;
  },

  revokeInvite: async () => {
    await inviteService.revokeInvite();
    set({ invite: null });
  },

  clearError: () => set({ error: null }),
}));
