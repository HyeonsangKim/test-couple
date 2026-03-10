import { create } from 'zustand';
import { Snapshot } from '@/types';
import { snapshotService } from '@/services/snapshotService';

interface SnapshotState {
  snapshots: Snapshot[];
  currentSnapshot: Snapshot | null;
  isLoading: boolean;
  loadSnapshots: () => Promise<void>;
  loadSnapshot: (snapshotId: string) => Promise<void>;
  createSnapshot: (
    sourceMapId: string,
    partnerUserId: string,
    mapId: string,
  ) => Promise<Snapshot>;
  getSnapshotByPartner: (partnerUserId: string) => Promise<Snapshot | null>;
  deleteSnapshot: (snapshotId: string) => Promise<void>;
  deleteAllSnapshots: () => Promise<void>;
}

export const useSnapshotStore = create<SnapshotState>((set, get) => ({
  snapshots: [],
  currentSnapshot: null,
  isLoading: false,

  loadSnapshots: async () => {
    set({ isLoading: true });
    const snapshots = await snapshotService.getSnapshots();
    set({ snapshots, isLoading: false });
  },

  loadSnapshot: async (snapshotId) => {
    set({ isLoading: true });
    const snapshot = await snapshotService.getSnapshotById(snapshotId);
    set({ currentSnapshot: snapshot, isLoading: false });
  },

  createSnapshot: async (sourceMapId, partnerUserId, mapId) => {
    const { visitService } = await import('@/services/visitService');
    const { threadService } = await import('@/services/threadService');
    const { placeService } = await import('@/services/placeService');

    const places = await placeService.getPlaces(mapId);
    const allVisits = await visitService.getAllVisits();
    const allImages = await visitService.getAllVisitImages();
    const allThreads = await threadService.getAllThreads();

    const placeIds = places.map((p) => p.placeId);
    const visits = allVisits.filter((v) => placeIds.includes(v.placeId));
    const visitIds = visits.map((v) => v.visitId);
    const visitImages = allImages.filter((img) => visitIds.includes(img.visitId));
    const threadMessages = allThreads.filter((t) => placeIds.includes(t.placeId));

    const snapshot = await snapshotService.createSnapshot(
      sourceMapId,
      partnerUserId,
      places,
      visits,
      visitImages,
      threadMessages,
    );
    set((s) => ({ snapshots: [...s.snapshots, snapshot], currentSnapshot: snapshot }));
    return snapshot;
  },

  getSnapshotByPartner: async (partnerUserId) => {
    return snapshotService.getSnapshotByPartner(partnerUserId);
  },

  deleteSnapshot: async (snapshotId) => {
    await snapshotService.deleteSnapshot(snapshotId);
    set((s) => ({
      snapshots: s.snapshots.filter((snap) => snap.snapshotId !== snapshotId),
      currentSnapshot: s.currentSnapshot?.snapshotId === snapshotId ? null : s.currentSnapshot,
    }));
  },

  deleteAllSnapshots: async () => {
    const { snapshots } = get();
    for (const snap of snapshots) {
      await snapshotService.deleteSnapshot(snap.snapshotId);
    }
    set({ snapshots: [], currentSnapshot: null });
  },
}));
