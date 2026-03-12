import { StateCreator } from 'zustand';
import { User } from '@/features/authentication/domain/entities/User';

// Constants
export const BRUTE_FORCE_CONFIG = {
  MAX_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 15 * 60 * 1000,
} as const;

// Types
export interface AuthSlice {
      // État utilisateur
      isAuthenticated: boolean;
      user: User | null;
      isLoadingSession: boolean; 

      //  État brute force 
      failedAttempts: number;
      lockedUntil: number | null;

      //  Actions auth 
      setAuthenticated: (value: boolean) => void;
      setUser: (user: User | null) => void;
      setLoadingSession: (value: boolean) => void;
      clearSession: () => void; 

      //  Actions brute force 
      recordFailedAttempt: () => void;
      lockAccount: () => void;
      resetAttempts: () => void;
      isLocked: () => boolean;
      getRemainingLockMs: () => number;
}

// Slice

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
      //  État initial 
      isAuthenticated: false,
      user: null,
      isLoadingSession: true, 
      failedAttempts: 0,
      lockedUntil: null,

      //  Actions auth 

      setAuthenticated: (value) => set({ isAuthenticated: value }),

      setUser: (user) => set({ user, isAuthenticated: user !== null }),

      setLoadingSession: (value) => set({ isLoadingSession: value }),

      clearSession: () => set({ isAuthenticated: false, user: null }),

      //  Actions brute force 

      recordFailedAttempt: () => {
            const { failedAttempts } = get();
            const next = failedAttempts + 1;

            if (next >= BRUTE_FORCE_CONFIG.MAX_ATTEMPTS) {
                  set({
                        failedAttempts: next,
                        lockedUntil: Date.now() + BRUTE_FORCE_CONFIG.LOCKOUT_DURATION_MS,
                  });
            } else {
                  set({ failedAttempts: next });
            }
      },

      lockAccount: () => {
            set({ lockedUntil: Date.now() + BRUTE_FORCE_CONFIG.LOCKOUT_DURATION_MS });
      },

      resetAttempts: () => set({ failedAttempts: 0, lockedUntil: null }),

      isLocked: () => {
            const { lockedUntil } = get();
            if (lockedUntil === null) return false;
            if (Date.now() >= lockedUntil) {
                  set({ lockedUntil: null, failedAttempts: 0 });
                  return false;
            }
            return true;
      },

      getRemainingLockMs: () => {
            const { lockedUntil } = get();
            if (lockedUntil === null) return 0;
            return Math.max(0, lockedUntil - Date.now());
      },
});