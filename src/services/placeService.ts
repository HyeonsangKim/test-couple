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
    await placeService.finalDeletePlace(placeId);
  },

  rejectDelete: async (placeId: string): Promise<Place> => {
    await delay(200);
    return placeService.updatePlace(placeId, { deleteRequest: null });
  },

  finalDeletePlace: async (placeId: string): Promise<void> => {
    // Import dynamically to avoid circular deps - use direct array access
    const { visitService } = await import('@/services/visitService');
    const { threadService } = await import('@/services/threadService');

    // 1. Find all visits for this place
    const placeVisits = await visitService.getVisitsByPlace(placeId);

    // 2. Delete visit images for each visit
    for (const visit of placeVisits) {
      const images = await visitService.getImagesByVisit(visit.visitId);
      for (const img of images) {
        await visitService.deleteImage(img.imageId);
      }
    }

    // 3. Delete all visits
    for (const visit of placeVisits) {
      await visitService.deleteVisit(visit.visitId);
    }

    // 4. Delete thread messages
    await threadService.deleteMessagesByPlace(placeId);

    // 5. Delete the place
    places = places.filter((p) => p.placeId !== placeId);
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

  processExpiredDeleteRequests: async (mapId: string): Promise<string[]> => {
    const mapPlaces = await placeService.getPlaces(mapId);
    const expired = placeService.checkExpiredDeleteRequests(mapPlaces);
    const deletedIds: string[] = [];
    for (const place of expired) {
      await placeService.finalDeletePlace(place.placeId);
      deletedIds.push(place.placeId);
    }
    return deletedIds;
  },
};
