// src/stores/authStore.ts
// import { create } from 'zustand';
// import { AuthStore, User } from '../types/auth';

// export const useAuthStore = create<AuthStore>((set, get) => ({
//   user: null,
//   token: null,

//   setAuth: (user: User, token: string) => set({ user, token }),
//   clearAuth: () => set({ user: null, token: null }),
//   setToken: (token: string) => set({ token }),
//   isAuthenticated: () => !!get().token,
// }));
// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthStore, User } from "../types/auth";

export const useAuthStore = create(
  persist<AuthStore>(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user: User, token: string) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null }),
      setToken: (token: string) => set({ token }),
      isAuthenticated: () => !!get().token,
      updateUser: (updates: Partial<User>) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
    }),
    {
      name: "auth-storage", // key in localStorage
    }
  )
);
