import { create } from 'zustand';
import { SharedMap } from '@/types';
import { mapService } from '@/services/mapService';

interface MapState {
  map: SharedMap | null;
  isLoading: boolean;
  loadMap: () => Promise<void>;
  createMap: (userId: string) => Promise<SharedMap>;
  joinMap: (mapId: string, userId: string) => Promise<SharedMap>;
  updateAnniversary: (date: string | null, label: string | null) => Promise<void>;
  disconnect: () => Promise<void>;
  deleteMap: () => Promise<void>;
}

export const useMapStore = create<MapState>((set) => ({
  map: null,
  isLoading: true,

  loadMap: async () => {
    set({ isLoading: true });
    const map = await mapService.getMap();
    set({ map, isLoading: false });
  },

  createMap: async (userId) => {
    const map = await mapService.createMap(userId);
    set({ map });
    return map;
  },

  joinMap: async (mapId, userId) => {
    const map = await mapService.joinMap(mapId, userId);
    set({ map });
    return map;
  },

  updateAnniversary: async (date, label) => {
    const map = await mapService.updateAnniversary(date, label);
    set({ map });
  },

  disconnect: async () => {
    await mapService.disconnect();
    set({ map: null });
  },

  deleteMap: async () => {
    await mapService.deleteMap();
    set({ map: null });
  },
}));
