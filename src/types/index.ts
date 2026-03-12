// ===== Canonical Enums =====
export type PlaceSourceType = 'official' | 'custom_pin';
export type PlaceStatus = 'wishlist' | 'visited' | 'orphan';
export type PlaceAddStatus = 'wishlist' | 'visited';
export type PlaceCategory = 'food' | 'travel' | 'activity' | 'special' | 'uncategorized';
export type InviteCodeStatus = 'active' | 'used' | 'expired' | 'revoked';
export type DeleteRequestStatus = 'pending' | 'approved' | 'rejected' | 'canceled' | 'expired';

// ===== Core Data Models =====
export interface UserProfile {
  userId: string;
  nickname: string;
  profileImageUri: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SharedMap {
  mapId: string;
  memberUserIds: string[];
  activeInviteCodeId: string | null;
  anniversaryDate: string | null;
  anniversaryLabel: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InviteCode {
  inviteCodeId: string;
  mapId: string;
  code: string;
  status: InviteCodeStatus;
  expiresAt: string;
  usedByUserId: string | null;
  usedAt: string | null;
  createdAt: string;
}

export interface Place {
  placeId: string;
  mapId: string;
  sourceType: PlaceSourceType;
  externalPlaceId: string | null;
  name: string;
  latitude: number;
  longitude: number;
  addressText: string | null;
  category: PlaceCategory;
  status: PlaceStatus;
  heroImageId: string | null;
  deleteRequest: DeleteRequest | null;
  categoryManual: boolean;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteRequest {
  requestedByUserId: string;
  requestedAt: string;
  expiresAt: string;
  status: DeleteRequestStatus;
}

export interface Visit {
  visitId: string;
  placeId: string;
  visitDate: string; // YYYY-MM-DD
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisitImage {
  imageId: string;
  visitId: string;
  uri: string;
  width: number | null;
  height: number | null;
  createdAt: string;
}

export interface ThreadMessage {
  messageId: string;
  placeId: string;
  authorUserId: string;
  body: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface Snapshot {
  snapshotId: string;
  sourceMapId: string;
  partnerUserId: string;
  createdAt: string;
  places: Place[];
  visits: Visit[];
  visitImages: VisitImage[];
  threadMessages: ThreadMessage[];
}

export interface NotificationSettings {
  userId: string;
  inviteAndConnection: boolean;
  visit: boolean;
  threadMessage: boolean;
  placeDelete: boolean;
  disconnect: boolean;
  anniversary: boolean;
  updatedAt: string;
}

// ===== App State Types =====
export interface FilterState {
  status: PlaceStatus | 'all';
  category: PlaceCategory[];
  searchQuery: string;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface MapApiResult {
  externalPlaceId: string;
  name: string;
  latitude: number;
  longitude: number;
  addressText: string | null;
  category: PlaceCategory;
}

export interface PlaceAddDraft {
  name: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  addressText?: string | null;
  category: PlaceCategory;
  status: PlaceAddStatus;
  visitDate: string;
  imageUris: string[];
  sourceType: PlaceSourceType;
  externalPlaceId?: string | null;
}
