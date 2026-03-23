"use client";
import { create } from "zustand";
import api from "../../interceptior";
import { Toaster } from "@/utils/toast-marker";
import { immer } from "zustand/middleware/immer";
import initialUserState, { User } from "@/types/user";
interface UserActions {
  register: () => void;
  login: () => void;
  updateField: (field: keyof User, value: any) => void;
  reset: () => void;
  loading: boolean;
  verifiedSession: boolean;
  verifyUserSessionState: () => void;
}
export const useSessionState = create<User & UserActions>()(
  immer((set, get) => ({
    ...initialUserState,
    loading: false,
    verifiedSession: false,
    updateField: (field, value) =>
      set((state) => {
        state[field] = value;
      }),
    register: async () => {
      set((state) => {
        state.loading = true;
      });
      try {
        const response = await api.post("/users/register", get());
        const { accessToken, refreshToken, user } = response.data;
        UserStore.setTokens(accessToken, refreshToken);
        UserStore.setUser(user);
        Toaster.success("Successfully registered");
        if (window) {
          window.location.href = "/dashboard";
        }
      } catch (e) {
        Toaster.errorHttp(e);
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },
    login: async () => {
      set((state) => {
        state.loading = true;
      });
      try {
        const response = await api.post("/users/login", get());
        const { accessToken, refreshToken, user } = response.data;
        UserStore.setTokens(accessToken, refreshToken);
        UserStore.setUser(user);
        Toaster.success("Successfully registered");
        if (window) {
          window.location.href = "/dashboard";
        }
      } catch (e) {
        Toaster.errorHttp(e);
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },
    verifyUserSessionState: async () => {
      set((state) => {
        state.loading = true;
      });
      try {
        const response = await api.post("/users/tokens", get());
        const { accessToken, refreshToken, user } = response.data;
        UserStore.setTokens(accessToken, refreshToken);
        UserStore.setUser(user);
        set((state) => {
          state.verifiedSession = true;
        });
        set({ ...user });
      } catch (e) {
        Toaster.errorHttp(e);
      } finally {
        set((state) => {
          state.loading = false;
        });
      }
    },
    reset: () => set(() => ({ ...initialUserState })),
  })),
);

export class UserStore {
  static refreshToken() {
    if (typeof window === "undefined" || !window.localStorage) return;
    return localStorage.getItem("tk2");
  }
  static accessToken() {
    if (typeof window === "undefined" || !window.localStorage) return;
    return localStorage.getItem("tk1");
  }
  static setTokens(accessToken: string, refreshToken: string) {
    if (typeof window === "undefined" || !window.localStorage) return;
    localStorage.setItem("tk1", accessToken);
    localStorage.setItem("tk2", refreshToken);
  }
  static removeTokens() {
    if (typeof window === "undefined" || !window.localStorage) return;
    localStorage.removeItem("tk1");
    localStorage.removeItem("tk2");
  }
  static setUser(user: User) {
    if (typeof window === "undefined" || !window.localStorage) return;
    localStorage.setItem("oib", JSON.stringify(user));
  }
  static getUser() {
    if (typeof window === "undefined" || !window.localStorage) return;
    return localStorage.getItem("oib");
  }
  static removeUser() {
    if (typeof window === "undefined" || !window.localStorage) return;
    localStorage.removeItem("oib");
  }
}
