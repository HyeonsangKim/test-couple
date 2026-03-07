import { create } from 'zustand';
import { Place, PlaceStatus, Category, FilterState } from '@/types';
import { placeService } from '@/services/placeService';

interface PlaceState {
  places: Place[];
  selectedPlace: Place | null;
  filter: FilterState;
  isLoading: boolean;
  viewMode: 'map' | 'list';
  loadPlaces: (mapId: string) => Promise<void>;
  selectPlace: (place: Place | null) => void;
  addPlace: (data: Partial<Place> & { name: string; latitude: number; longitude: number; mapId: string; createdBy: string }) => Promise<Place>;
  updatePlace: (id: string, updates: Partial<Place>) => Promise<void>;
  requestDelete: (id: string, requestedBy: string) => Promise<void>;
  cancelDelete: (id: string) => Promise<void>;
  approveDelete: (id: string) => Promise<void>;
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilter: () => void;
  setViewMode: (mode: 'map' | 'list') => void;
  checkDuplicate: (mapId: string, externalPlaceId: string) => Promise<Place | null>;
}

const defaultFilter: FilterState = {
  status: 'all',
  category: 'all',
  searchQuery: '',
  searchScope: 'all',
};

export const usePlaceStore = create<PlaceState>((set, get) => ({
  places: [],
  selectedPlace: null,
  filter: { ...defaultFilter },
  isLoading: false,
  viewMode: 'map',

  loadPlaces: async (mapId) => {
    set({ isLoading: true });
    const places = await placeService.getPlaces(mapId);
    set({ places, isLoading: false });
  },

  selectPlace: (place) => set({ selectedPlace: place }),

  addPlace: async (data) => {
    const place = await placeService.addPlace(data);
    set((s) => ({ places: [...s.places, place] }));
    return place;
  },

  updatePlace: async (id, updates) => {
    const place = await placeService.updatePlace(id, updates);
    set((s) => ({
      places: s.places.map((p) => (p.id === id ? place : p)),
      selectedPlace: s.selectedPlace?.id === id ? place : s.selectedPlace,
    }));
  },

  requestDelete: async (id, requestedBy) => {
    const place = await placeService.requestDelete(id, requestedBy);
    set((s) => ({
      places: s.places.map((p) => (p.id === id ? place : p)),
      selectedPlace: s.selectedPlace?.id === id ? place : s.selectedPlace,
    }));
  },

  cancelDelete: async (id) => {
    const place = await placeService.cancelDelete(id);
    set((s) => ({
      places: s.places.map((p) => (p.id === id ? place : p)),
      selectedPlace: s.selectedPlace?.id === id ? place : s.selectedPlace,
    }));
  },

  approveDelete: async (id) => {
    await placeService.approveDelete(id);
    set((s) => ({
      places: s.places.filter((p) => p.id !== id),
      selectedPlace: s.selectedPlace?.id === id ? null : s.selectedPlace,
    }));
  },

  setFilter: (filter) =>
    set((s) => ({ filter: { ...s.filter, ...filter } })),

  resetFilter: () => set({ filter: { ...defaultFilter } }),

  setViewMode: (mode) => set({ viewMode: mode }),

  checkDuplicate: async (mapId, externalPlaceId) => {
    return placeService.checkDuplicate(mapId, externalPlaceId);
  },
}));
