import { delay } from '@/mock/delay';
import { MOCK_PLACES } from '@/mock/data';
import { createPlace } from '@/mock/generators';
import { Place, PlaceStatus, Category, DeleteRequest } from '@/types';
import { addDays } from 'date-fns';
import { TIMING } from '@/constants';

let places: Place[] = [...MOCK_PLACES];

export const placeService = {
  getPlaces: async (mapId: string): Promise<Place[]> => {
    await delay(200);
    return places.filter((p) => p.mapId === mapId);
  },

  getPlaceById: async (id: string): Promise<Place | null> => {
    await delay(100);
    return places.find((p) => p.id === id) ?? null;
  },

  addPlace: async (data: Partial<Place> & { name: string; latitude: number; longitude: number; mapId: string; createdBy: string }): Promise<Place> => {
    await delay(300);
    const place = createPlace(data);
    places = [...places, place];
    return place;
  },

  updatePlace: async (id: string, updates: Partial<Place>): Promise<Place> => {
    await delay(200);
    places = places.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
    const updated = places.find((p) => p.id === id);
    if (!updated) throw new Error('Place not found');
    return updated;
  },

  requestDelete: async (id: string, requestedBy: string): Promise<Place> => {
    await delay(200);
    const now = new Date();
    const deleteRequest: DeleteRequest = {
      requestedBy,
      requestedAt: now.toISOString(),
      expiresAt: addDays(now, TIMING.DELETE_GRACE_PERIOD_DAYS).toISOString(),
    };
    return placeService.updatePlace(id, { deleteRequest });
  },

  cancelDelete: async (id: string): Promise<Place> => {
    await delay(200);
    return placeService.updatePlace(id, { deleteRequest: null });
  },

  approveDelete: async (id: string): Promise<void> => {
    await delay(200);
    places = places.filter((p) => p.id !== id);
  },

  checkDuplicate: async (mapId: string, externalPlaceId: string): Promise<Place | null> => {
    await delay(100);
    return places.find((p) => p.mapId === mapId && p.externalPlaceId === externalPlaceId) ?? null;
  },
};
