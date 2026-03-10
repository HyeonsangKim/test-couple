import { create } from 'zustand';
import { UserProfile, NotificationSettings } from '@/types';
import { authService } from '@/services/authService';

interface AuthState {
  currentUser: UserProfile | null;
  partner: UserProfile | null;
  notificationSettings: NotificationSettings | null;
  isOnboarded: boolean;
  isLoading: boolean;
  init: () => Promise<void>;
  setOnboarded: (val: boolean) => void;
  loadPartner: (memberUserIds: string[]) => Promise<void>;
  getUserById: (userId: string) => UserProfile | undefined;
  updateProfile: (updates: { nickname?: string; profileImageUri?: string | null }) => Promise<void>;
  loadNotificationSettings: () => Promise<void>;
  updateNotificationSettings: (updates: Partial<NotificationSettings>) => Promise<void>;
  logout: () => Promise<void>;
  withdraw: (isConnected: boolean) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  partner: null,
  notificationSettings: null,
  isOnboarded: true,
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

  loadPartner: async (memberUserIds) => {
    const partner = await authService.getPartner(memberUserIds);
    set({ partner });
  },

  getUserById: (userId) => authService.getUserById(userId),

  updateProfile: async (updates) => {
    const user = get().currentUser;
    if (!user) return;
    const updated = await authService.updateProfile(user.userId, updates);
    set({ currentUser: updated });
  },

  loadNotificationSettings: async () => {
    const settings = await authService.getNotificationSettings();
    set({ notificationSettings: settings });
  },

  updateNotificationSettings: async (updates) => {
    const settings = await authService.updateNotificationSettings(updates);
    set({ notificationSettings: settings });
  },

  logout: async () => {
    await authService.logout();
    set({ currentUser: null, partner: null, isOnboarded: false });
  },

  withdraw: async (isConnected) => {
    const user = get().currentUser;
    if (!user) return;
    await authService.withdraw(user.userId, isConnected);
    set({ currentUser: null, partner: null, isOnboarded: false, notificationSettings: null });
  },
}));
