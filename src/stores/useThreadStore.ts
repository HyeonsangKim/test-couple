import { create } from 'zustand';
import { ThreadMessage } from '@/types';
import { threadService } from '@/services/threadService';

interface ThreadState {
  messages: ThreadMessage[];
  isLoading: boolean;
  loadMessages: (placeId: string) => Promise<void>;
  addMessage: (data: { placeId: string; authorUserId: string; body: string }) => Promise<void>;
  updateMessage: (messageId: string, actorUserId: string, body: string) => Promise<void>;
  deleteMessage: (messageId: string, actorUserId: string) => Promise<void>;
}

export const useThreadStore = create<ThreadState>((set) => ({
  messages: [],
  isLoading: false,

  loadMessages: async (placeId) => {
    set({ isLoading: true });
    const messages = await threadService.getThreadByPlace(placeId);
    set({ messages, isLoading: false });
  },

  addMessage: async (data) => {
    const msg = await threadService.addMessage(data);
    set((s) => ({ messages: [...s.messages, msg] }));
  },

  updateMessage: async (messageId, actorUserId, body) => {
    const updated = await threadService.updateMessage(messageId, actorUserId, body);
    set((s) => ({
      messages: s.messages.map((m) => (m.messageId === messageId ? updated : m)),
    }));
  },

  deleteMessage: async (messageId, actorUserId) => {
    await threadService.deleteMessage(messageId, actorUserId);
    set((s) => ({
      messages: s.messages.filter((m) => m.messageId !== messageId),
    }));
  },
}));
