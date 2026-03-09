import { delay } from '@/mock/delay';
import { MOCK_VISITS, MOCK_VISIT_IMAGES } from '@/mock/data';
import { createVisit, createVisitImage } from '@/mock/generators';
import { Visit, VisitImage } from '@/types';

let visits: Visit[] = [...MOCK_VISITS];
let visitImages: VisitImage[] = [...MOCK_VISIT_IMAGES];

export const visitService = {
  getVisitsByPlace: async (placeId: string): Promise<Visit[]> => {
    await delay(200);
    return visits.filter((v) => v.placeId === placeId).sort((a, b) => b.visitDate.localeCompare(a.visitDate));
  },

  getVisitById: async (visitId: string): Promise<Visit | null> => {
    await delay(100);
    return visits.find((v) => v.visitId === visitId) ?? null;
  },

  addVisit: async (data: { placeId: string; visitDate: string; createdByUserId: string }): Promise<Visit> => {
    await delay(300);
    const visit = createVisit(data);
    visits = [...visits, visit];
    return visit;
  },

  updateVisit: async (visitId: string, updates: Partial<Visit>): Promise<Visit> => {
    await delay(200);
    visits = visits.map((v) => (v.visitId === visitId ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v));
    const updated = visits.find((v) => v.visitId === visitId);
    if (!updated) throw new Error('Visit not found');
    return updated;
  },

  deleteVisit: async (visitId: string): Promise<void> => {
    await delay(200);
    visitImages = visitImages.filter((img) => img.visitId !== visitId);
    visits = visits.filter((v) => v.visitId !== visitId);
  },

  getImagesByVisit: async (visitId: string): Promise<VisitImage[]> => {
    await delay(100);
    return visitImages.filter((img) => img.visitId === visitId);
  },

  getImagesByPlace: async (placeId: string): Promise<VisitImage[]> => {
    await delay(100);
    const placeVisitIds = visits.filter((v) => v.placeId === placeId).map((v) => v.visitId);
    return visitImages.filter((img) => placeVisitIds.includes(img.visitId));
  },

  addImages: async (newImages: { visitId: string; uri: string; width?: number; height?: number }[]): Promise<VisitImage[]> => {
    await delay(300);
    const created = newImages.map((img) =>
      createVisitImage({ visitId: img.visitId, uri: img.uri, width: img.width ?? null, height: img.height ?? null })
    );
    visitImages = [...visitImages, ...created];
    return created;
  },

  deleteImage: async (imageId: string): Promise<void> => {
    await delay(100);
    visitImages = visitImages.filter((img) => img.imageId !== imageId);
  },

  getImageCountForPlace: async (placeId: string): Promise<number> => {
    await delay(50);
    const placeVisitIds = visits.filter((v) => v.placeId === placeId).map((v) => v.visitId);
    return visitImages.filter((img) => placeVisitIds.includes(img.visitId)).length;
  },

  getAllVisits: async (): Promise<Visit[]> => {
    await delay(200);
    return [...visits];
  },

  getAllVisitImages: async (): Promise<VisitImage[]> => {
    await delay(200);
    return [...visitImages];
  },
};
