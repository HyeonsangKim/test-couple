import { generateId } from '@/utils/id';
import { Place, Visit, VisitImage, ThreadMessage, InviteCode, PlaceSourceType, PlaceCategory } from '@/types';
import { addHours } from 'date-fns';
import { TIMING } from '@/constants';

export const createPlace = (
  overrides: Partial<Place> & { name: string; latitude: number; longitude: number; mapId: string; createdByUserId: string }
): Place => ({
  placeId: generateId(),
  addressText: null,
  sourceType: 'custom_pin' as PlaceSourceType,
  status: 'wishlist',
  category: 'uncategorized' as PlaceCategory,
  categoryManual: false,
  heroImageId: null,
  externalPlaceId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deleteRequest: null,
  ...overrides,
});

export const createVisit = (
  overrides: Partial<Visit> & { placeId: string; visitDate: string; createdByUserId: string }
): Visit => ({
  visitId: generateId(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createVisitImage = (
  overrides: Partial<VisitImage> & { visitId: string; uri: string }
): VisitImage => ({
  imageId: generateId(),
  width: null,
  height: null,
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createThreadMessage = (
  overrides: Partial<ThreadMessage> & { placeId: string; authorUserId: string; body: string }
): ThreadMessage => ({
  messageId: generateId(),
  createdAt: new Date().toISOString(),
  updatedAt: null,
  ...overrides,
});

export const createInviteCode = (mapId: string): InviteCode => {
  const now = new Date();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return {
    inviteCodeId: generateId(),
    mapId,
    code,
    status: 'active',
    expiresAt: addHours(now, TIMING.INVITE_CODE_EXPIRY_HOURS).toISOString(),
    usedByUserId: null,
    usedAt: null,
    createdAt: now.toISOString(),
  };
};
