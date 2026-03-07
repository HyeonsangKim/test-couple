import { create } from 'zustand';
import { VisitRecord } from '@/types';
import { visitService } from '@/services/visitService';

interface VisitState {
  visits: VisitRecord[];
  placeVisits: VisitRecord[];
  isLoading: boolean;
  loadVisitsForPlace: (placeId: string) => Promise<void>;
  loadAllVisits: () => Promise<void>;
  addVisit: (data: { placeId: string; date: string; imageUris: string[]; createdBy: string }) => Promise<VisitRecord>;
  updateVisit: (id: string, updates: Partial<VisitRecord>) => Promise<void>;
  deleteVisit: (id: string) => Promise<void>;
  getImageCount: (placeId: string) => Promise<number>;
  getVisitCountForPlace: (placeId: string) => number;
}

export const useVisitStore = create<VisitState>((set, get) => ({
  visits: [],
  placeVisits: [],
  isLoading: false,

  loadVisitsForPlace: async (placeId) => {
    set({ isLoading: true });
    const placeVisits = await visitService.getVisitsByPlace(placeId);
    set({ placeVisits, isLoading: false });
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

  updateVisit: async (id, updates) => {
    await visitService.updateVisit(id, updates);
    const updated = await visitService.getVisitById(id);
    if (!updated) return;
    set((s) => ({
      visits: s.visits.map((v) => (v.id === id ? updated : v)),
      placeVisits: s.placeVisits.map((v) => (v.id === id ? updated : v)),
    }));
  },

  deleteVisit: async (id) => {
    await visitService.deleteVisit(id);
    set((s) => ({
      visits: s.visits.filter((v) => v.id !== id),
      placeVisits: s.placeVisits.filter((v) => v.id !== id),
    }));
  },

  getImageCount: async (placeId) => {
    return visitService.getImageCountForPlace(placeId);
  },

  getVisitCountForPlace: (placeId) => {
    return get().visits.filter((v) => v.placeId === placeId).length;
  },
}));
