import { create } from 'zustand';
import { Snapshot, Place, Visit, VisitImage, ThreadMessage } from '@/types';
import { snapshotService } from '@/services/snapshotService';

interface SnapshotState {
  snapshots: Snapshot[];
  currentSnapshot: Snapshot | null;
  isLoading: boolean;
  createSnapshot: (
    sourceMapId: string,
    partnerUserId: string,
    places: Place[],
    visits: Visit[],
    visitImages: VisitImage[],
    threadMessages: ThreadMessage[]
  ) => Promise<Snapshot>;
  loadSnapshots: () => Promise<void>;
  loadSnapshot: (snapshotId: string) => Promise<void>;
  deleteSnapshot: (snapshotId: string) => Promise<void>;
  getSnapshotByPartner: (partnerUserId: string) => Promise<Snapshot | null>;
}

export const useSnapshotStore = create<SnapshotState>((set) => ({
  snapshots: [],
  currentSnapshot: null,
  isLoading: false,

  createSnapshot: async (sourceMapId, partnerUserId, places, visits, visitImages, threadMessages) => {
    set({ isLoading: true });
    const snapshot = await snapshotService.createSnapshot(sourceMapId, partnerUserId, places, visits, visitImages, threadMessages);
    set((s) => ({ snapshots: [...s.snapshots, snapshot], isLoading: false }));
    return snapshot;
  },

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

  deleteSnapshot: async (snapshotId) => {
    await snapshotService.deleteSnapshot(snapshotId);
    set((s) => ({ snapshots: s.snapshots.filter((snap) => snap.snapshotId !== snapshotId) }));
  },

  getSnapshotByPartner: async (partnerUserId) => {
    return snapshotService.getSnapshotByPartner(partnerUserId);
  },
}));
