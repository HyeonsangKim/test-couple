import { create } from 'zustand';
import { PlaceStatus, PlaceCategory, MapRegion, MapApiResult } from '@/types';

interface HomeState {
  // Shared state (map + list tabs)
  homeSearchQuery: string;
  homeStatusFilter: PlaceStatus | 'all';
  homeCategoryFilter: PlaceCategory | 'all';

  // Map-only state
  mapRegion: MapRegion | null;
  mapApiResults: MapApiResult[];
  mapSearchSheetOpen: boolean;

  // Shared actions
  setHomeSearchQuery: (query: string) => void;
  setHomeStatusFilter: (status: PlaceStatus | 'all') => void;
  setHomeCategoryFilter: (category: PlaceCategory | 'all') => void;
  resetFilters: () => void;

  // Map-only actions
  setMapRegion: (region: MapRegion) => void;
  setMapApiResults: (results: MapApiResult[]) => void;
  setMapSearchSheetOpen: (open: boolean) => void;
}

export const useHomeStore = create<HomeState>((set) => ({
  homeSearchQuery: '',
  homeStatusFilter: 'all',
  homeCategoryFilter: 'all',
  mapRegion: null,
  mapApiResults: [],
  mapSearchSheetOpen: false,

  setHomeSearchQuery: (query) => set({ homeSearchQuery: query }),
  setHomeStatusFilter: (status) => set({ homeStatusFilter: status }),
  setHomeCategoryFilter: (category) => set({ homeCategoryFilter: category }),
  resetFilters: () => set({ homeStatusFilter: 'all', homeCategoryFilter: 'all', homeSearchQuery: '' }),

  setMapRegion: (region) => set({ mapRegion: region }),
  setMapApiResults: (results) => set({ mapApiResults: results }),
  setMapSearchSheetOpen: (open) => set({ mapSearchSheetOpen: open }),
}));
