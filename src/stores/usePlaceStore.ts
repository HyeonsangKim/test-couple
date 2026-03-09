import { create } from 'zustand';
import { Place, FilterState } from '@/types';
import { placeService } from '@/services/placeService';

interface PlaceState {
  places: Place[];
  selectedPlace: Place | null;
  filter: FilterState;
  isLoading: boolean;
  loadPlaces: (mapId: string) => Promise<void>;
  selectPlace: (place: Place | null) => void;
  addPlace: (data: Partial<Place> & { name: string; latitude: number; longitude: number; mapId: string; createdByUserId: string }) => Promise<Place>;
  updatePlace: (placeId: string, updates: Partial<Place>) => Promise<void>;
  requestDelete: (placeId: string, requestedByUserId: string) => Promise<void>;
  cancelDelete: (placeId: string) => Promise<void>;
  approveDelete: (placeId: string) => Promise<void>;
  rejectDelete: (placeId: string) => Promise<void>;
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilter: () => void;
  checkDuplicate: (mapId: string, externalPlaceId: string) => Promise<Place | null>;
}

const defaultFilter: FilterState = {
  status: 'all',
  category: 'all',
  searchQuery: '',
};

export const usePlaceStore = create<PlaceState>((set, get) => ({
  places: [],
  selectedPlace: null,
  filter: { ...defaultFilter },
  isLoading: false,

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

  updatePlace: async (placeId, updates) => {
    const place = await placeService.updatePlace(placeId, updates);
    set((s) => ({
      places: s.places.map((p) => (p.placeId === placeId ? place : p)),
      selectedPlace: s.selectedPlace?.placeId === placeId ? place : s.selectedPlace,
    }));
  },

  requestDelete: async (placeId, requestedByUserId) => {
    const place = await placeService.requestDelete(placeId, requestedByUserId);
    set((s) => ({
      places: s.places.map((p) => (p.placeId === placeId ? place : p)),
      selectedPlace: s.selectedPlace?.placeId === placeId ? place : s.selectedPlace,
    }));
  },

  cancelDelete: async (placeId) => {
    const place = await placeService.cancelDelete(placeId);
    set((s) => ({
      places: s.places.map((p) => (p.placeId === placeId ? place : p)),
      selectedPlace: s.selectedPlace?.placeId === placeId ? place : s.selectedPlace,
    }));
  },

  approveDelete: async (placeId) => {
    await placeService.approveDelete(placeId);
    set((s) => ({
      places: s.places.filter((p) => p.placeId !== placeId),
      selectedPlace: s.selectedPlace?.placeId === placeId ? null : s.selectedPlace,
    }));
  },

  rejectDelete: async (placeId) => {
    const place = await placeService.rejectDelete(placeId);
    set((s) => ({
      places: s.places.map((p) => (p.placeId === placeId ? place : p)),
      selectedPlace: s.selectedPlace?.placeId === placeId ? place : s.selectedPlace,
    }));
  },

  setFilter: (filter) =>
    set((s) => ({ filter: { ...s.filter, ...filter } })),

  resetFilter: () => set({ filter: { ...defaultFilter } }),

  checkDuplicate: async (mapId, externalPlaceId) => {
    return placeService.checkDuplicate(mapId, externalPlaceId);
  },
}));
