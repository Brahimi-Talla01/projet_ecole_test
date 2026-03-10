import { create } from 'zustand';
import { AuthSlice, createAuthSlice } from './slices/auth.slice';

// Store global
export type AppStore = AuthSlice;

export const useAppStore = create<AppStore>()((...args) => ({
  ...createAuthSlice(...args),
}));