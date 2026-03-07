import { generateId } from '@/utils/id';
import { Place, VisitRecord, ThreadMessage, InviteCode, PlaceType, Category } from '@/types';
import { addHours } from 'date-fns';
import { TIMING } from '@/constants';

export const createPlace = (
  overrides: Partial<Place> & { name: string; latitude: number; longitude: number; mapId: string; createdBy: string }
): Place => ({
  id: generateId(),
  address: '',
  type: 'custom' as PlaceType,
  status: 'wishlist',
  category: 'none' as Category,
  categoryManual: false,
  heroImageUri: null,
  externalPlaceId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deleteRequest: null,
  ...overrides,
});

export const createVisitRecord = (
  overrides: Partial<VisitRecord> & { placeId: string; date: string; createdBy: string }
): VisitRecord => ({
  id: generateId(),
  imageUris: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createThreadMessage = (
  overrides: Partial<ThreadMessage> & { placeId: string; authorId: string; content: string }
): ThreadMessage => ({
  id: generateId(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createInviteCode = (mapId: string, createdBy: string, password: string): InviteCode => {
  const now = new Date();
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  return {
    code,
    mapId,
    password,
    createdBy,
    createdAt: now.toISOString(),
    expiresAt: addHours(now, TIMING.INVITE_CODE_EXPIRY_HOURS).toISOString(),
  };
};
