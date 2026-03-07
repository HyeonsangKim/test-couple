import { delay } from '@/mock/delay';
import { MOCK_MAP } from '@/mock/data';
import { SharedMap } from '@/types';

let currentMap: SharedMap | null = { ...MOCK_MAP };

export const mapService = {
  getMap: async (): Promise<SharedMap | null> => {
    await delay(200);
    return currentMap;
  },

  createMap: async (name: string, ownerId: string): Promise<SharedMap> => {
    await delay(300);
    currentMap = {
      id: `map_${Date.now()}`,
      name,
      ownerId,
      memberIds: [ownerId],
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
      memberIds: [...currentMap.memberIds, userId],
      updatedAt: new Date().toISOString(),
    };
    return currentMap;
  },

  disconnect: async (): Promise<void> => {
    await delay(300);
    currentMap = null;
  },
};
