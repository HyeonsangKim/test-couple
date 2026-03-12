import { create } from "zustand";
import { Visit, VisitImage } from "@/types";
import { visitService } from "@/services/visitService";

interface VisitState {
  visits: Visit[];
  placeVisits: Visit[];
  placeImages: VisitImage[];
  activePlaceId: string | null;
  placeVisitsByPlaceId: Record<string, Visit[]>;
  placeImagesByPlaceId: Record<string, VisitImage[]>;
  isLoading: boolean;
  loadVisitsForPlace: (placeId: string) => Promise<void>;
  loadImagesForPlace: (placeId: string) => Promise<void>;
  loadAllVisits: () => Promise<void>;
  addVisit: (data: {
    placeId: string;
    visitDate: string;
    createdByUserId: string;
  }) => Promise<Visit>;
  updateVisit: (visitId: string, updates: Partial<Visit>) => Promise<void>;
  deleteVisit: (visitId: string) => Promise<void>;
  addImages: (
    images: { visitId: string; uri: string }[],
  ) => Promise<VisitImage[]>;
  deleteImage: (imageId: string) => Promise<void>;
  getImageCount: (placeId: string) => Promise<number>;
  getVisitCountForPlace: (placeId: string) => number;
}

export const useVisitStore = create<VisitState>((set, get) => {
  let visitsLoadSequence = 0;
  let imagesLoadSequence = 0;

  return {
    visits: [],
    placeVisits: [],
    placeImages: [],
    activePlaceId: null,
    placeVisitsByPlaceId: {},
    placeImagesByPlaceId: {},
    isLoading: false,

    loadVisitsForPlace: async (placeId) => {
      visitsLoadSequence += 1;
      const loadToken = visitsLoadSequence;

      set({ isLoading: true, activePlaceId: placeId });
      const placeVisits = await visitService.getVisitsByPlace(placeId);

      set((s) => {
        const nextByPlace = {
          ...s.placeVisitsByPlaceId,
          [placeId]: placeVisits,
        };
        if (loadToken !== visitsLoadSequence || s.activePlaceId !== placeId) {
          return { placeVisitsByPlaceId: nextByPlace };
        }

        return {
          placeVisitsByPlaceId: nextByPlace,
          placeVisits,
          isLoading: false,
        };
      });
    },

    loadImagesForPlace: async (placeId) => {
      imagesLoadSequence += 1;
      const loadToken = imagesLoadSequence;

      set({ activePlaceId: placeId });
      const placeImages = await visitService.getImagesByPlace(placeId);

      set((s) => {
        const nextByPlace = {
          ...s.placeImagesByPlaceId,
          [placeId]: placeImages,
        };
        if (loadToken !== imagesLoadSequence || s.activePlaceId !== placeId) {
          return { placeImagesByPlaceId: nextByPlace };
        }

        return {
          placeImagesByPlaceId: nextByPlace,
          placeImages,
        };
      });
    },

    loadAllVisits: async () => {
      set({ isLoading: true });
      const visits = await visitService.getAllVisits();
      set({ visits, isLoading: false });
    },

    addVisit: async (data) => {
      const visit = await visitService.addVisit(data);
      set((s) => {
        const placeVisits = [
          visit,
          ...(s.placeVisitsByPlaceId[visit.placeId] ?? []),
        ].sort((a, b) => b.visitDate.localeCompare(a.visitDate));
        const nextByPlace = {
          ...s.placeVisitsByPlaceId,
          [visit.placeId]: placeVisits,
        };

        return {
          visits: [...s.visits, visit],
          placeVisitsByPlaceId: nextByPlace,
          placeVisits:
            s.activePlaceId === visit.placeId ? placeVisits : s.placeVisits,
        };
      });
      return visit;
    },

    updateVisit: async (visitId, updates) => {
      const updated = await visitService.updateVisit(visitId, updates);
      set((s) => {
        const nextVisits = s.visits.map((v) =>
          v.visitId === visitId ? updated : v,
        );
        const nextByPlace = { ...s.placeVisitsByPlaceId };

        for (const [placeId, placeVisits] of Object.entries(nextByPlace)) {
          nextByPlace[placeId] = placeVisits.map((v) =>
            v.visitId === visitId ? updated : v,
          );
        }

        return {
          visits: nextVisits,
          placeVisitsByPlaceId: nextByPlace,
          placeVisits:
            s.activePlaceId && nextByPlace[s.activePlaceId]
              ? nextByPlace[s.activePlaceId]
              : s.placeVisits,
        };
      });
    },

    deleteVisit: async (visitId) => {
      await visitService.deleteVisit(visitId);
      set((s) => {
        const deletedVisit =
          s.visits.find((v) => v.visitId === visitId) ??
          s.placeVisits.find((v) => v.visitId === visitId) ??
          null;
        const deletedPlaceId = deletedVisit?.placeId ?? null;

        const nextVisits = s.visits.filter((v) => v.visitId !== visitId);
        const nextByPlace = { ...s.placeVisitsByPlaceId };
        if (deletedPlaceId) {
          nextByPlace[deletedPlaceId] = (
            nextByPlace[deletedPlaceId] ?? []
          ).filter((v) => v.visitId !== visitId);
        }

        const nextImagesByPlace: Record<string, VisitImage[]> = {};
        for (const [placeId, placeImages] of Object.entries(
          s.placeImagesByPlaceId,
        )) {
          nextImagesByPlace[placeId] = placeImages.filter(
            (img) => img.visitId !== visitId,
          );
        }

        return {
          visits: nextVisits,
          placeVisitsByPlaceId: nextByPlace,
          placeImagesByPlaceId: nextImagesByPlace,
          placeVisits:
            s.activePlaceId && nextByPlace[s.activePlaceId]
              ? nextByPlace[s.activePlaceId]
              : s.placeVisits,
          placeImages: s.placeImages.filter((img) => img.visitId !== visitId),
        };
      });
    },

    addImages: async (images) => {
      const created = await visitService.addImages(images);
      const placeIdByVisitId: Record<string, string> = {};

      for (const { visitId } of images) {
        if (placeIdByVisitId[visitId]) continue;
        const inMemoryVisit = get().visits.find(
          (visit) => visit.visitId === visitId,
        );
        if (inMemoryVisit) {
          placeIdByVisitId[visitId] = inMemoryVisit.placeId;
          continue;
        }
        const resolvedVisit = await visitService.getVisitById(visitId);
        if (resolvedVisit) {
          placeIdByVisitId[visitId] = resolvedVisit.placeId;
        }
      }

      set((s) => {
        const nextByPlace = { ...s.placeImagesByPlaceId };
        for (const image of created) {
          const placeId = placeIdByVisitId[image.visitId];
          if (!placeId) continue;
          nextByPlace[placeId] = [...(nextByPlace[placeId] ?? []), image];
        }

        return {
          placeImagesByPlaceId: nextByPlace,
          placeImages:
            s.activePlaceId && nextByPlace[s.activePlaceId]
              ? nextByPlace[s.activePlaceId]
              : s.placeImages,
        };
      });

      return created;
    },

    deleteImage: async (imageId) => {
      await visitService.deleteImage(imageId);
      set((s) => {
        const nextByPlace: Record<string, VisitImage[]> = {};
        for (const [placeId, placeImages] of Object.entries(
          s.placeImagesByPlaceId,
        )) {
          nextByPlace[placeId] = placeImages.filter(
            (img) => img.imageId !== imageId,
          );
        }

        return {
          placeImagesByPlaceId: nextByPlace,
          placeImages: s.placeImages.filter((img) => img.imageId !== imageId),
        };
      });
    },

    getImageCount: async (placeId) => {
      return visitService.getImageCountForPlace(placeId);
    },

    getVisitCountForPlace: (placeId) => {
      return get().visits.filter((v) => v.placeId === placeId).length;
    },
  };
});
