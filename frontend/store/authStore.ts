// src/stores/authStore.ts
import { create } from 'zustand';
import { AuthStore, User } from '../types/auth';

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  
  setAuth: (user: User, token: string) => set({ user, token }),
  clearAuth: () => set({ user: null, token: null }),
  setToken: (token: string) => set({ token }),
  isAuthenticated: () => !!get().token,
}));