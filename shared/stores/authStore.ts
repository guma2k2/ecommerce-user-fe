import { create } from 'zustand';
import type { CustomerProfile } from '@/features/auth/types/customerTypes';

interface AuthState {
  accessToken: string | null;
  user: CustomerProfile | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  setAccessToken: (token: string | null) => void;
  setUserProfile: (profile: CustomerProfile | null) => void;
  clearAuth: () => void;
  setInitializing: (isInitializing: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitializing: true,

  setAccessToken: (token) =>
    set({
      accessToken: token,
      isAuthenticated: Boolean(token),
    }),

  setUserProfile: (profile) =>
    set({
      user: profile,
    }),

  clearAuth: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isInitializing: false,
    }),

  setInitializing: (isInitializing) =>
    set({
      isInitializing,
    }),
}));
