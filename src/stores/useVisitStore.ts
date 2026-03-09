import { create } from 'zustand';
import { Visit, VisitImage } from '@/types';
import { visitService } from '@/services/visitService';

interface VisitState {
  visits: Visit[];
  placeVisits: Visit[];
  placeImages: VisitImage[];
  isLoading: boolean;
  loadVisitsForPlace: (placeId: string) => Promise<void>;
  loadImagesForPlace: (placeId: string) => Promise<void>;
  loadAllVisits: () => Promise<void>;
  addVisit: (data: { placeId: string; visitDate: string; createdByUserId: string }) => Promise<Visit>;
  updateVisit: (visitId: string, updates: Partial<Visit>) => Promise<void>;
  deleteVisit: (visitId: string) => Promise<void>;
  addImages: (images: { visitId: string; uri: string }[]) => Promise<VisitImage[]>;
  deleteImage: (imageId: string) => Promise<void>;
  getImageCount: (placeId: string) => Promise<number>;
  getVisitCountForPlace: (placeId: string) => number;
}

export const useVisitStore = create<VisitState>((set, get) => ({
  visits: [],
  placeVisits: [],
  placeImages: [],
  isLoading: false,

  loadVisitsForPlace: async (placeId) => {
    set({ isLoading: true });
    const placeVisits = await visitService.getVisitsByPlace(placeId);
    set({ placeVisits, isLoading: false });
  },

  loadImagesForPlace: async (placeId) => {
    const placeImages = await visitService.getImagesByPlace(placeId);
    set({ placeImages });
  },

  loadAllVisits: async () => {
    set({ isLoading: true });
    const visits = await visitService.getAllVisits();
    set({ visits, isLoading: false });
  },

  addVisit: async (data) => {
    const visit = await visitService.addVisit(data);
    set((s) => ({
      visits: [...s.visits, visit],
      placeVisits: visit.placeId === s.placeVisits[0]?.placeId
        ? [visit, ...s.placeVisits]
        : s.placeVisits,
    }));
    return visit;
  },

  updateVisit: async (visitId, updates) => {
    await visitService.updateVisit(visitId, updates);
    const updated = await visitService.getVisitById(visitId);
    if (!updated) return;
    set((s) => ({
      visits: s.visits.map((v) => (v.visitId === visitId ? updated : v)),
      placeVisits: s.placeVisits.map((v) => (v.visitId === visitId ? updated : v)),
    }));
  },

  deleteVisit: async (visitId) => {
    await visitService.deleteVisit(visitId);
    set((s) => ({
      visits: s.visits.filter((v) => v.visitId !== visitId),
      placeVisits: s.placeVisits.filter((v) => v.visitId !== visitId),
    }));
  },

  addImages: async (images) => {
    const created = await visitService.addImages(images);
    set((s) => ({ placeImages: [...s.placeImages, ...created] }));
    return created;
  },

  deleteImage: async (imageId) => {
    await visitService.deleteImage(imageId);
    set((s) => ({ placeImages: s.placeImages.filter((img) => img.imageId !== imageId) }));
  },

  getImageCount: async (placeId) => {
    return visitService.getImageCountForPlace(placeId);
  },

  getVisitCountForPlace: (placeId) => {
    return get().visits.filter((v) => v.placeId === placeId).length;
  },
}));
