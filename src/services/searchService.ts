import { delay } from '@/mock/delay';
import { MapApiResult } from '@/types';

const MOCK_EXTERNAL_RESULTS: MapApiResult[] = [
  { externalPlaceId: 'ext_1', name: '강남 카페거리', latitude: 37.4979, longitude: 127.0276, addressText: '서울시 강남구', category: 'food' },
  { externalPlaceId: 'ext_2', name: '홍대 놀이터', latitude: 37.5563, longitude: 126.9236, addressText: '서울시 마포구', category: 'activity' },
  { externalPlaceId: 'ext_3', name: '남산타워', latitude: 37.5512, longitude: 126.9882, addressText: '서울시 용산구', category: 'travel' },
  { externalPlaceId: 'ext_4', name: '이태원 레스토랑', latitude: 37.5345, longitude: 126.9946, addressText: '서울시 용산구', category: 'food' },
  { externalPlaceId: 'ext_5', name: '경복궁', latitude: 37.5796, longitude: 126.9770, addressText: '서울시 종로구', category: 'travel' },
  { externalPlaceId: 'ext_6', name: '한강 공원', latitude: 37.5283, longitude: 126.9346, addressText: '서울시 영등포구', category: 'activity' },
];

export const searchService = {
  searchPlaces: async (query: string): Promise<MapApiResult[]> => {
    await delay(300);
    if (!query.trim()) return [];
    return MOCK_EXTERNAL_RESULTS.filter(
      (r) => r.name.includes(query) || r.addressText?.includes(query)
    );
  },

  searchByRegion: async (lat: number, lng: number, latDelta: number, lngDelta: number): Promise<MapApiResult[]> => {
    await delay(300);
    return MOCK_EXTERNAL_RESULTS.filter((r) => {
      return Math.abs(r.latitude - lat) < latDelta && Math.abs(r.longitude - lng) < lngDelta;
    });
  },
};
