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

  addMessage: async (data: { placeId: string; authorId: string; content: string }): Promise<ThreadMessage> => {
    await delay(300);
    const msg = createThreadMessage(data);
    threads = [...threads, msg];
    return msg;
  },

  updateMessage: async (id: string, content: string): Promise<ThreadMessage> => {
    await delay(200);
    threads = threads.map((t) => (t.id === id ? { ...t, content, updatedAt: new Date().toISOString() } : t));
    const updated = threads.find((t) => t.id === id);
    if (!updated) throw new Error('Message not found');
    return updated;
  },

  deleteMessage: async (id: string): Promise<void> => {
    await delay(200);
    threads = threads.filter((t) => t.id !== id);
  },
};
