import { create } from 'zustand';
import { User, SharedMap } from '@/types';
import { authService } from '@/services/authService';

interface AuthState {
  currentUser: User | null;
  partner: User | null;
  isOnboarded: boolean;
  isLoading: boolean;
  init: () => Promise<void>;
  setOnboarded: (val: boolean) => void;
  loadPartner: (memberIds: string[]) => Promise<void>;
  getUserById: (id: string) => User | undefined;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  partner: null,
  isOnboarded: true, // Start as true for mock (already has map)
  isLoading: true,

  init: async () => {
    try {
      const user = await authService.getCurrentUser();
      set({ currentUser: user, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setOnboarded: (val) => set({ isOnboarded: val }),

  loadPartner: async (memberIds) => {
    const partner = await authService.getPartner(memberIds);
    set({ partner });
  },

  getUserById: (id) => authService.getUserById(id),
}));
