import { create } from 'zustand';
import { SharedMap } from '@/types';
import { mapService } from '@/services/mapService';

interface MapState {
  map: SharedMap | null;
  isLoading: boolean;
  loadMap: () => Promise<void>;
  createMap: (name: string, ownerId: string) => Promise<SharedMap>;
  joinMap: (mapId: string, userId: string) => Promise<SharedMap>;
  disconnect: () => Promise<void>;
}

export const useMapStore = create<MapState>((set) => ({
  map: null,
  isLoading: true,

  loadMap: async () => {
    set({ isLoading: true });
    const map = await mapService.getMap();
    set({ map, isLoading: false });
  },

  createMap: async (name, ownerId) => {
    const map = await mapService.createMap(name, ownerId);
    set({ map });
    return map;
  },

  joinMap: async (mapId, userId) => {
    const map = await mapService.joinMap(mapId, userId);
    set({ map });
    return map;
  },

  disconnect: async () => {
    await mapService.disconnect();
    set({ map: null });
  },
}));
