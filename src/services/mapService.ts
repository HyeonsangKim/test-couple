import { delay } from '@/mock/delay';
import { MOCK_MAP } from '@/mock/data';
import { SharedMap } from '@/types';

let currentMap: SharedMap | null = { ...MOCK_MAP };

export const mapService = {
  getMap: async (): Promise<SharedMap | null> => {
    await delay(200);
    return currentMap;
  },

  createMap: async (userId: string): Promise<SharedMap> => {
    await delay(300);
    currentMap = {
      mapId: `map_${Date.now()}`,
      memberUserIds: [userId],
      activeInviteCodeId: null,
      anniversaryDate: null,
      anniversaryLabel: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return currentMap;
  },

  joinMap: async (mapId: string, userId: string): Promise<SharedMap> => {
    await delay(300);
    if (!currentMap) throw new Error('Map not found');
    currentMap = {
      ...currentMap,
      memberUserIds: [...currentMap.memberUserIds, userId],
      updatedAt: new Date().toISOString(),
    };
    return currentMap;
  },

  updateAnniversary: async (date: string | null, label: string | null): Promise<SharedMap> => {
    await delay(200);
    if (!currentMap) throw new Error('Map not found');
    currentMap = {
      ...currentMap,
      anniversaryDate: date,
      anniversaryLabel: label,
      updatedAt: new Date().toISOString(),
    };
    return currentMap;
  },

  disconnect: async (): Promise<void> => {
    await delay(300);
    if (currentMap) {
      currentMap = {
        ...currentMap,
        memberUserIds: [currentMap.memberUserIds[0]],
        updatedAt: new Date().toISOString(),
      };
    }
  },

  deleteMap: async (): Promise<void> => {
    await delay(200);
    currentMap = null;
  },
};
