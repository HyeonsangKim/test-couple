import { create } from 'zustand';
import { ThreadMessage } from '@/types';
import { threadService } from '@/services/threadService';

interface ThreadState {
  messages: ThreadMessage[];
  isLoading: boolean;
  loadThread: (placeId: string) => Promise<void>;
  addMessage: (data: { placeId: string; authorUserId: string; body: string }) => Promise<void>;
  updateMessage: (messageId: string, body: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
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

  updateMessage: async (messageId, body) => {
    const msg = await threadService.updateMessage(messageId, body);
    set((s) => ({ messages: s.messages.map((m) => (m.messageId === messageId ? msg : m)) }));
  },

  deleteMessage: async (messageId) => {
    await threadService.deleteMessage(messageId);
    set((s) => ({ messages: s.messages.filter((m) => m.messageId !== messageId) }));
  },
}));
