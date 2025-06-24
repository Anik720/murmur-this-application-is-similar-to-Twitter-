import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  access_token: string | null;
  user: User | null;
  setAuth: (access_token: string, user: User) => void;
  setUser: (user: User | null) => void;
  setToken: (access_token: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  access_token: null,
  user: null,
  setAuth: (access_token, user) => set({ access_token, user }),
  setUser: (user) => set({ user }),
  setToken: (access_token) => set({ access_token }),
  clearAuth: () => set({ access_token: null, user: null }),
}));