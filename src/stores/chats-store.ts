import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface Chats {
  displayName: string;
  userId: string;
  message: string;
}
export const useMessages = create<{
  messages: Chats[];
  addMessage: (message: Chats) => void;
}>()(
  immer((set) => ({
    messages: [],
    addMessage: (message: Chats) => {
      set((state) => {
        state.messages.push(message);
      });
    },
  })),
);
