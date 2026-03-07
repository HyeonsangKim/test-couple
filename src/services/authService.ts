import { delay } from '@/mock/delay';
import { MOCK_USERS, CURRENT_USER_ID } from '@/mock/data';
import { MOCK_MAP } from '@/mock/data';
import { User, SharedMap } from '@/types';

export const authService = {
  getCurrentUser: async (): Promise<User> => {
    await delay(200);
    const user = MOCK_USERS.find((u) => u.id === CURRENT_USER_ID);
    if (!user) throw new Error('User not found');
    return user;
  },

  getPartner: async (mapMemberIds: string[]): Promise<User | null> => {
    await delay(100);
    const partnerId = mapMemberIds.find((id) => id !== CURRENT_USER_ID);
    if (!partnerId) return null;
    return MOCK_USERS.find((u) => u.id === partnerId) ?? null;
  },

  getUserById: (userId: string): User | undefined => {
    return MOCK_USERS.find((u) => u.id === userId);
  },
};
