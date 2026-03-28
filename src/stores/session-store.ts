"use client";
import { create } from "zustand";
import api from "../../interceptior";
import { initializeApp } from "firebase/app";
import { Toaster } from "@/utils/toast-marker";
import { immer } from "zustand/middleware/immer";
import initialUserState, { User } from "@/types/user";
import { getMessaging, getToken } from "firebase/messaging";
export const firebaseConfig = {
  apiKey: "AIzaSyBIuccc_5plQWbfbpcFjJH_SPORf5BjHMA",
  authDomain: "cloud-meeting-c3b80.firebaseapp.com",
  projectId: "cloud-meeting-c3b80",
  storageBucket: "cloud-meeting-c3b80.firebasestorage.app",
  messagingSenderId: "341999955537",
  appId: "1:341999955537:web:3880b187dfbd1f3fae1270",
  measurementId: "G-MHYNFJBE9Y",
};
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
        const app = initializeApp(firebaseConfig);
        const messaging = getMessaging(app);
        UserStore.setTokens(accessToken, refreshToken);
        UserStore.setUser(user);
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          });
          if (token && token.length > 0 && token != (user as User).chatToken) {
            const chatTokenResponse = await api.put("/users/chat-token", {
              chatToken: token,
            });
            UserStore.setUser(chatTokenResponse.data.user);
          }
        }
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
