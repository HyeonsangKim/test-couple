import { delay } from '@/mock/delay';
import { MOCK_MAP } from '@/mock/data';
import { SharedMap } from '@/types';
import { generateId } from '@/utils/id';

let maps: SharedMap[] = [{ ...MOCK_MAP }];
let activeMapIdByUserId: Record<string, string | null> = {
  user_me: 'map_1',
  user_partner: 'map_1',
};

export const mapService = {
  getMap: async (userId: string): Promise<SharedMap | null> => {
    await delay(200);
    const activeMapId = activeMapIdByUserId[userId];
    if (!activeMapId) return null;
    return maps.find((m) => m.mapId === activeMapId) ?? null;
  },

  getMapById: async (mapId: string): Promise<SharedMap | null> => {
    await delay(100);
    return maps.find((m) => m.mapId === mapId) ?? null;
  },

  createMap: async (userId: string): Promise<SharedMap> => {
    await delay(300);
    const map: SharedMap = {
      mapId: generateId(),
      memberUserIds: [userId],
      activeInviteCodeId: null,
      anniversaryDate: null,
      anniversaryLabel: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    maps = [...maps, map];
    activeMapIdByUserId[userId] = map.mapId;
    return map;
  },

  joinMap: async (targetMapId: string, userId: string): Promise<SharedMap> => {
    await delay(300);
    const targetMap = maps.find((m) => m.mapId === targetMapId);
    if (!targetMap) throw new Error('Target map not found');
    if (targetMap.memberUserIds.length >= 2) throw new Error('Map already has 2 members');

    // Delete current active map if different
    const currentActiveMapId = activeMapIdByUserId[userId];
    if (currentActiveMapId && currentActiveMapId !== targetMapId) {
      const currentMap = maps.find((m) => m.mapId === currentActiveMapId);
      if (currentMap) {
        // Clear active for all members of the old map
        currentMap.memberUserIds.forEach((uid) => {
          if (activeMapIdByUserId[uid] === currentActiveMapId) {
            activeMapIdByUserId[uid] = null;
          }
        });
        maps = maps.filter((m) => m.mapId !== currentActiveMapId);
      }
    }

    // Add user to target map
    const updatedMap: SharedMap = {
      ...targetMap,
      memberUserIds: [...targetMap.memberUserIds.filter((id) => id !== userId), userId],
      updatedAt: new Date().toISOString(),
    };
    maps = maps.map((m) => (m.mapId === targetMapId ? updatedMap : m));
    activeMapIdByUserId[userId] = targetMapId;
    return updatedMap;
  },

  updateAnniversary: async (mapId: string, date: string | null, label: string | null): Promise<SharedMap> => {
    await delay(200);
    const map = maps.find((m) => m.mapId === mapId);
    if (!map) throw new Error('Map not found');
    const updated: SharedMap = {
      ...map,
      anniversaryDate: date,
      anniversaryLabel: label,
      updatedAt: new Date().toISOString(),
    };
    maps = maps.map((m) => (m.mapId === mapId ? updated : m));
    return updated;
  },

  disconnect: async (userId: string): Promise<void> => {
    await delay(300);
    const activeMapId = activeMapIdByUserId[userId];
    if (!activeMapId) return;
    const map = maps.find((m) => m.mapId === activeMapId);
    if (map) {
      const updated: SharedMap = {
        ...map,
        memberUserIds: map.memberUserIds.filter((id) => id !== userId),
        updatedAt: new Date().toISOString(),
      };
      maps = maps.map((m) => (m.mapId === activeMapId ? updated : m));
    }
    activeMapIdByUserId[userId] = null;
  },

  deleteMap: async (mapId: string): Promise<void> => {
    await delay(200);
    const map = maps.find((m) => m.mapId === mapId);
    if (map) {
      map.memberUserIds.forEach((uid) => {
        if (activeMapIdByUserId[uid] === mapId) {
          activeMapIdByUserId[uid] = null;
        }
      });
    }
    maps = maps.filter((m) => m.mapId !== mapId);
  },
};
