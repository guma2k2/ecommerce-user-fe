import { create } from 'zustand';
import { STORAGE_KEYS } from '@/shared/constants';
import type { CustomerProfile } from '@/features/auth/types/customerTypes';

const getStoredAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

const getStoredUserProfile = (): CustomerProfile | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

interface AuthState {
  user: CustomerProfile | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  initAuth: () => void;
  setAccessToken: (token: string | null) => void;
  setUserProfile: (profile: CustomerProfile | null) => void;
  clearAuth: () => void;
  setInitializing: (isInitializing: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,

  initAuth: () => {
    const token = getStoredAccessToken();
    const profile = getStoredUserProfile();
    set({
      user: profile,
      isAuthenticated: Boolean(token),
      isInitializing: false,
    });
  },

  setAccessToken: (token) => {
    if (typeof window !== 'undefined') {
      if (token) {
        sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      }
    }
    set({
      isAuthenticated: Boolean(token),
    });
  },

  setUserProfile: (profile) => {
    if (typeof window !== 'undefined') {
      if (profile) {
        sessionStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
      } else {
        sessionStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      }
    }
    set({
      user: profile,
    });
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    }
    set({
      user: null,
      isAuthenticated: false,
      isInitializing: false,
    });
  },

  setInitializing: (isInitializing) =>
    set({
      isInitializing,
    }),
}));
