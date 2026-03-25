import { create } from "zustand";
import { Participant } from "@/types/participant";
import { immer } from "zustand/middleware/immer";

export const useWaitingListStore = create<{
  waiters: Participant[];
  addWaiter: (waiter: Participant) => void;
  removeWaiter: (userId: string) => void;
  clearWaiters: () => void;
  pass: (userId: string) => boolean;
}>()(
  immer((set, get) => ({
    waiters: [],
    addWaiter: (waiter: Participant) => {
      const waiterExists = useWaitingListStore
        .getState()
        .waiters.find((w) => w.userId === waiter.userId);
      if (waiterExists) return;
      set((state) => {
        state.waiters.push(waiter);
      });
    },
    pass: (userId: string): boolean => {
      if (get().waiters.find((w) => w.userId === userId)) {
        return true;
      }
      return false;
    },
    removeWaiter: (userId: string) => {
      set((state) => {
        state.waiters = state.waiters.filter(
          (waiter) => waiter.userId !== userId,
        );
      });
    },
    clearWaiters: () => {
      set((state) => {
        state.waiters = [];
      });
    },
  })),
);
