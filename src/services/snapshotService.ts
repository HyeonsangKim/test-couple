import { delay } from '@/mock/delay';
import { MapSnapshot, Place, VisitRecord, ThreadMessage } from '@/types';

let snapshots: MapSnapshot[] = [];

export const snapshotService = {
  createSnapshot: async (
    originalMapId: string,
    ownerId: string,
    partnerNickname: string,
    places: Place[],
    visits: VisitRecord[],
    threads: ThreadMessage[]
  ): Promise<MapSnapshot> => {
    await delay(500);
    const snapshot: MapSnapshot = {
      id: `snapshot_${Date.now()}`,
      originalMapId,
      ownerId,
      partnerNickname,
      places: [...places],
      visits: [...visits],
      threads: [...threads],
      createdAt: new Date().toISOString(),
    };
    snapshots = [...snapshots, snapshot];
    return snapshot;
  },

  getSnapshots: async (ownerId: string): Promise<MapSnapshot[]> => {
    await delay(200);
    return snapshots.filter((s) => s.ownerId === ownerId);
  },

  getSnapshotById: async (id: string): Promise<MapSnapshot | null> => {
    await delay(200);
    return snapshots.find((s) => s.id === id) ?? null;
  },

  deleteSnapshot: async (id: string): Promise<void> => {
    await delay(200);
    snapshots = snapshots.filter((s) => s.id !== id);
  },
};
