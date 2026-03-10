import { create } from 'zustand';
import { SharedMap } from '@/types';
import { mapService } from '@/services/mapService';

interface MapState {
  map: SharedMap | null;
  isLoading: boolean;
  loadMap: (userId: string) => Promise<void>;
  createMap: (userId: string) => Promise<SharedMap>;
  joinMap: (targetMapId: string, userId: string) => Promise<SharedMap>;
  updateAnniversary: (date: string | null, label: string | null) => Promise<void>;
  disconnect: (userId: string) => Promise<void>;
  deleteMap: () => Promise<void>;
  isConnected: () => boolean;
}

export const useMapStore = create<MapState>((set, get) => ({
  map: null,
  isLoading: true,

  loadMap: async (userId) => {
    set({ isLoading: true });
    const map = await mapService.getMap(userId);
    set({ map, isLoading: false });
  },

  createMap: async (userId) => {
    const map = await mapService.createMap(userId);
    set({ map });
    return map;
  },

  joinMap: async (targetMapId, userId) => {
    const map = await mapService.joinMap(targetMapId, userId);
    set({ map });
    return map;
  },

  updateAnniversary: async (date, label) => {
    const { map } = get();
    if (!map) return;
    const updated = await mapService.updateAnniversary(map.mapId, date, label);
    set({ map: updated });
  },

  disconnect: async (userId) => {
    await mapService.disconnect(userId);
    set({ map: null });
  },

  deleteMap: async () => {
    const { map } = get();
    if (!map) return;
    await mapService.deleteMap(map.mapId);
    set({ map: null });
  },

  isConnected: () => {
    const { map } = get();
    return (map?.memberUserIds.length ?? 0) >= 2;
  },
}));
