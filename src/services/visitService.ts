import { delay } from '@/mock/delay';
import { MOCK_VISITS } from '@/mock/data';
import { createVisitRecord } from '@/mock/generators';
import { VisitRecord } from '@/types';

let visits: VisitRecord[] = [...MOCK_VISITS];

export const visitService = {
  getVisitsByPlace: async (placeId: string): Promise<VisitRecord[]> => {
    await delay(200);
    return visits.filter((v) => v.placeId === placeId).sort((a, b) => b.date.localeCompare(a.date));
  },

  getVisitById: async (id: string): Promise<VisitRecord | null> => {
    await delay(100);
    return visits.find((v) => v.id === id) ?? null;
  },

  addVisit: async (data: { placeId: string; date: string; imageUris: string[]; createdBy: string }): Promise<VisitRecord> => {
    await delay(300);
    const visit = createVisitRecord(data);
    visits = [...visits, visit];
    return visit;
  },

  updateVisit: async (id: string, updates: Partial<VisitRecord>): Promise<VisitRecord> => {
    await delay(200);
    visits = visits.map((v) => (v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v));
    const updated = visits.find((v) => v.id === id);
    if (!updated) throw new Error('Visit not found');
    return updated;
  },

  deleteVisit: async (id: string): Promise<void> => {
    await delay(200);
    visits = visits.filter((v) => v.id !== id);
  },

  getImageCountForPlace: async (placeId: string): Promise<number> => {
    await delay(50);
    return visits.filter((v) => v.placeId === placeId).reduce((sum, v) => sum + v.imageUris.length, 0);
  },

  getAllVisits: async (): Promise<VisitRecord[]> => {
    await delay(200);
    return [...visits];
  },
};
