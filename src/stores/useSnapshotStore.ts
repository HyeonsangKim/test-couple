import { create } from 'zustand';
import { MapSnapshot, Place, VisitRecord, ThreadMessage } from '@/types';
import { snapshotService } from '@/services/snapshotService';

interface SnapshotState {
  snapshots: MapSnapshot[];
  currentSnapshot: MapSnapshot | null;
  isLoading: boolean;
  createSnapshot: (
    originalMapId: string,
    ownerId: string,
    partnerNickname: string,
    places: Place[],
    visits: VisitRecord[],
    threads: ThreadMessage[]
  ) => Promise<MapSnapshot>;
  loadSnapshots: (ownerId: string) => Promise<void>;
  loadSnapshot: (id: string) => Promise<void>;
  deleteSnapshot: (id: string) => Promise<void>;
}

export const useSnapshotStore = create<SnapshotState>((set) => ({
  snapshots: [],
  currentSnapshot: null,
  isLoading: false,

  createSnapshot: async (originalMapId, ownerId, partnerNickname, places, visits, threads) => {
    set({ isLoading: true });
    const snapshot = await snapshotService.createSnapshot(originalMapId, ownerId, partnerNickname, places, visits, threads);
    set((s) => ({ snapshots: [...s.snapshots, snapshot], isLoading: false }));
    return snapshot;
  },

  loadSnapshots: async (ownerId) => {
    set({ isLoading: true });
    const snapshots = await snapshotService.getSnapshots(ownerId);
    set({ snapshots, isLoading: false });
  },

  loadSnapshot: async (id) => {
    set({ isLoading: true });
    const snapshot = await snapshotService.getSnapshotById(id);
    set({ currentSnapshot: snapshot, isLoading: false });
  },

  deleteSnapshot: async (id) => {
    await snapshotService.deleteSnapshot(id);
    set((s) => ({ snapshots: s.snapshots.filter((snap) => snap.id !== id) }));
  },
}));
