export type PlaceStatus = 'wishlist' | 'visited' | 'orphan';
export type PlaceType = 'official' | 'custom';
export type Category = 'food' | 'travel' | 'fun' | 'special' | 'none';

export interface User {
  id: string;
  nickname: string;
  profileColor: string;
  createdAt: string;
}

export interface SharedMap {
  id: string;
  name: string;
  ownerId: string;
  memberIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Place {
  id: string;
  mapId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: PlaceType;
  status: PlaceStatus;
  category: Category;
  categoryManual: boolean;
  heroImageUri: string | null;
  externalPlaceId: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deleteRequest: DeleteRequest | null;
}

export interface DeleteRequest {
  requestedBy: string;
  requestedAt: string;
  expiresAt: string;
}

export interface VisitRecord {
  id: string;
  placeId: string;
  date: string; // YYYY-MM-DD
  imageUris: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ThreadMessage {
  id: string;
  placeId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface InviteCode {
  code: string;
  mapId: string;
  password: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
}

export interface MapSnapshot {
  id: string;
  originalMapId: string;
  ownerId: string;
  partnerNickname: string;
  places: Place[];
  visits: VisitRecord[];
  threads: ThreadMessage[];
  createdAt: string;
}

export interface FilterState {
  status: PlaceStatus | 'all';
  category: Category | 'all';
  searchQuery: string;
  searchScope: 'all' | 'name';
}
