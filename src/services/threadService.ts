import { delay } from '@/mock/delay';
import { MOCK_THREADS } from '@/mock/data';
import { createThreadMessage } from '@/mock/generators';
import { ThreadMessage } from '@/types';

let threads: ThreadMessage[] = [...MOCK_THREADS];

export const threadService = {
  getThreadByPlace: async (placeId: string): Promise<ThreadMessage[]> => {
    await delay(200);
    return threads.filter((t) => t.placeId === placeId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },

  addMessage: async (data: { placeId: string; authorUserId: string; body: string }): Promise<ThreadMessage> => {
    await delay(300);
    const msg = createThreadMessage(data);
    threads = [...threads, msg];
    return msg;
  },

  updateMessage: async (messageId: string, actorUserId: string, body: string): Promise<ThreadMessage> => {
    await delay(200);
    const msg = threads.find((t) => t.messageId === messageId);
    if (!msg) throw new Error('Message not found');
    if (msg.authorUserId !== actorUserId) throw new Error('Only the author can edit this message');
    threads = threads.map((t) => (t.messageId === messageId ? { ...t, body, updatedAt: new Date().toISOString() } : t));
    const updated = threads.find((t) => t.messageId === messageId);
    if (!updated) throw new Error('Message not found');
    return updated;
  },

  deleteMessage: async (messageId: string, actorUserId: string): Promise<void> => {
    await delay(200);
    const msg = threads.find((t) => t.messageId === messageId);
    if (!msg) throw new Error('Message not found');
    if (msg.authorUserId !== actorUserId) throw new Error('Only the author can delete this message');
    threads = threads.filter((t) => t.messageId !== messageId);
  },

  deleteMessagesByPlace: async (placeId: string): Promise<void> => {
    threads = threads.filter((t) => t.placeId !== placeId);
  },

  getAllThreads: async (): Promise<ThreadMessage[]> => {
    await delay(200);
    return [...threads];
  },
};
