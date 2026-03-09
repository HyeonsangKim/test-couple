import { delay } from '@/mock/delay';
import { MOCK_USERS, CURRENT_USER_ID, MOCK_NOTIFICATION_SETTINGS } from '@/mock/data';
import { UserProfile, NotificationSettings } from '@/types';

let users = [...MOCK_USERS];
let notificationSettings = { ...MOCK_NOTIFICATION_SETTINGS };

export const authService = {
  getCurrentUser: async (): Promise<UserProfile> => {
    await delay(200);
    const user = users.find((u) => u.userId === CURRENT_USER_ID);
    if (!user) throw new Error('User not found');
    return user;
  },

  getPartner: async (memberUserIds: string[]): Promise<UserProfile | null> => {
    await delay(100);
    const partnerId = memberUserIds.find((id) => id !== CURRENT_USER_ID);
    if (!partnerId) return null;
    return users.find((u) => u.userId === partnerId) ?? null;
  },

  getUserById: (userId: string): UserProfile | undefined => {
    return users.find((u) => u.userId === userId);
  },

  updateProfile: async (userId: string, updates: { nickname?: string; profileImageUri?: string | null }): Promise<UserProfile> => {
    await delay(300);
    users = users.map((u) =>
      u.userId === userId ? { ...u, ...updates, updatedAt: new Date().toISOString() } : u
    );
    const updated = users.find((u) => u.userId === userId);
    if (!updated) throw new Error('User not found');
    return updated;
  },

  getNotificationSettings: async (): Promise<NotificationSettings> => {
    await delay(100);
    return notificationSettings;
  },

  updateNotificationSettings: async (updates: Partial<NotificationSettings>): Promise<NotificationSettings> => {
    await delay(200);
    notificationSettings = { ...notificationSettings, ...updates, updatedAt: new Date().toISOString() };
    return notificationSettings;
  },

  logout: async (): Promise<void> => {
    await delay(200);
  },

  withdraw: async (userId: string): Promise<void> => {
    await delay(300);
    users = users.filter((u) => u.userId !== userId);
  },
};
