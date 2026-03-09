import { delay } from '@/mock/delay';
import { MOCK_PLACES } from '@/mock/data';
import { createPlace } from '@/mock/generators';
import { Place, DeleteRequest } from '@/types';
import { addDays } from 'date-fns';
import { TIMING } from '@/constants';

let places: Place[] = [...MOCK_PLACES];

export const placeService = {
  getPlaces: async (mapId: string): Promise<Place[]> => {
    await delay(200);
    return places.filter((p) => p.mapId === mapId);
  },

  getPlaceById: async (placeId: string): Promise<Place | null> => {
    await delay(100);
    return places.find((p) => p.placeId === placeId) ?? null;
  },

  addPlace: async (data: Partial<Place> & { name: string; latitude: number; longitude: number; mapId: string; createdByUserId: string }): Promise<Place> => {
    await delay(300);
    const place = createPlace(data);
    places = [...places, place];
    return place;
  },

  updatePlace: async (placeId: string, updates: Partial<Place>): Promise<Place> => {
    await delay(200);
    places = places.map((p) => (p.placeId === placeId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
    const updated = places.find((p) => p.placeId === placeId);
    if (!updated) throw new Error('Place not found');
    return updated;
  },

  requestDelete: async (placeId: string, requestedByUserId: string): Promise<Place> => {
    await delay(200);
    const now = new Date();
    const deleteRequest: DeleteRequest = {
      requestedByUserId,
      requestedAt: now.toISOString(),
      expiresAt: addDays(now, TIMING.DELETE_GRACE_PERIOD_DAYS).toISOString(),
      status: 'pending',
    };
    return placeService.updatePlace(placeId, { deleteRequest });
  },

  cancelDelete: async (placeId: string): Promise<Place> => {
    await delay(200);
    return placeService.updatePlace(placeId, { deleteRequest: null });
  },

  approveDelete: async (placeId: string): Promise<void> => {
    await delay(200);
    places = places.filter((p) => p.placeId !== placeId);
  },

  rejectDelete: async (placeId: string): Promise<Place> => {
    await delay(200);
    return placeService.updatePlace(placeId, { deleteRequest: null });
  },

  checkDuplicate: async (mapId: string, externalPlaceId: string): Promise<Place | null> => {
    await delay(100);
    return places.find((p) => p.mapId === mapId && p.externalPlaceId === externalPlaceId) ?? null;
  },

  checkExpiredDeleteRequests: (mapPlaces: Place[]): Place[] => {
    const now = new Date();
    return mapPlaces.filter(
      (p) => p.deleteRequest?.status === 'pending' && new Date(p.deleteRequest.expiresAt) <= now
    );
  },
};
