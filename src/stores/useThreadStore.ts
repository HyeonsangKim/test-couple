import { create } from 'zustand';
import { ThreadMessage } from '@/types';
import { threadService } from '@/services/threadService';

interface ThreadState {
  messages: ThreadMessage[];
  isLoading: boolean;
  loadThread: (placeId: string) => Promise<void>;
  addMessage: (data: { placeId: string; authorId: string; content: string }) => Promise<void>;
  updateMessage: (id: string, content: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

export const useThreadStore = create<ThreadState>((set) => ({
  messages: [],
  isLoading: false,

  loadThread: async (placeId) => {
    set({ isLoading: true });
    const messages = await threadService.getThreadByPlace(placeId);
    set({ messages, isLoading: false });
  },

  addMessage: async (data) => {
    const msg = await threadService.addMessage(data);
    set((s) => ({ messages: [...s.messages, msg] }));
  },

  updateMessage: async (id, content) => {
    const msg = await threadService.updateMessage(id, content);
    set((s) => ({ messages: s.messages.map((m) => (m.id === id ? msg : m)) }));
  },

  deleteMessage: async (id) => {
    await threadService.deleteMessage(id);
    set((s) => ({ messages: s.messages.filter((m) => m.id !== id) }));
  },
}));
