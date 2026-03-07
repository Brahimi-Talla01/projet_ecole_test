import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createAuthSlice, AuthSlice } from './slices/auth.slice';
import { createUISlice, UISlice } from './slices/ui.slice';

/**
 * Type du store global
 */
type StoreState = AuthSlice & UISlice;

/**
 * Store global de l'application
 * Combine tous les slices (auth, ui, etc.)
 */
export const useGlobalStore = create<StoreState>()(
  devtools(
    (...args) => ({
      ...createAuthSlice(...args),
      ...createUISlice(...args),
    }),
    {
      name: 'SuperApp-Store', // Nom dans Redux DevTools
    }
  )
);

/**
 * Sélecteurs optimisés pour éviter les re-renders inutiles
 */

// Auth selectors
export const useAuth = () =>
  useGlobalStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    setUser: state.setUser,
    setLoading: state.setLoading,
    logout: state.logout,
    isCustomer: state.isCustomer,
    isProvider: state.isProvider,
    hasVerifiedEmail: state.hasVerifiedEmail,
  }));

export const useUser = () => useGlobalStore((state) => state.user);

export const useIsAuthenticated = () =>
  useGlobalStore((state) => state.isAuthenticated);

// UI selectors
export const useTheme = () =>
  useGlobalStore((state) => ({
    theme: state.theme,
    setTheme: state.setTheme,
    toggleTheme: state.toggleTheme,
  }));

export const useModal = () =>
  useGlobalStore((state) => ({
    isModalOpen: state.isModalOpen,
    modalContent: state.modalContent,
    openModal: state.openModal,
    closeModal: state.closeModal,
  }));

export const useToast = () =>
  useGlobalStore((state) => ({
    toast: state.toast,
    showToast: state.showToast,
    hideToast: state.hideToast,
  }));