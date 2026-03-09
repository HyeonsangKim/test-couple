import { delay } from '@/mock/delay';
import { Snapshot, Place, Visit, VisitImage, ThreadMessage } from '@/types';

let snapshots: Snapshot[] = [];

export const snapshotService = {
  createSnapshot: async (
    sourceMapId: string,
    partnerUserId: string,
    places: Place[],
    visits: Visit[],
    visitImages: VisitImage[],
    threadMessages: ThreadMessage[]
  ): Promise<Snapshot> => {
    await delay(500);
    const snapshot: Snapshot = {
      snapshotId: `snapshot_${Date.now()}`,
      sourceMapId,
      partnerUserId,
      places: [...places],
      visits: [...visits],
      visitImages: [...visitImages],
      threadMessages: [...threadMessages],
      createdAt: new Date().toISOString(),
    };
    snapshots = [...snapshots, snapshot];
    return snapshot;
  },

  getSnapshots: async (): Promise<Snapshot[]> => {
    await delay(200);
    return [...snapshots];
  },

  getSnapshotById: async (snapshotId: string): Promise<Snapshot | null> => {
    await delay(200);
    return snapshots.find((s) => s.snapshotId === snapshotId) ?? null;
  },

  getSnapshotByPartner: async (partnerUserId: string): Promise<Snapshot | null> => {
    await delay(200);
    return snapshots.find((s) => s.partnerUserId === partnerUserId) ?? null;
  },

  deleteSnapshot: async (snapshotId: string): Promise<void> => {
    await delay(200);
    snapshots = snapshots.filter((s) => s.snapshotId !== snapshotId);
  },
};
