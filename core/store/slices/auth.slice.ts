import { StateCreator } from 'zustand';
import { User } from '@/features/authentication/domain/entities/User';


export interface AuthSlice {
      // État
      user: User | null;
      isAuthenticated: boolean;
      isLoading: boolean;
      
      // Actions
      setUser: (user: User | null) => void;
      setLoading: (loading: boolean) => void;
      logout: () => void;
      
      // Getters helpers
      isCustomer: () => boolean;
      isProvider: () => boolean;
      hasVerifiedEmail: () => boolean;
}


export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
      // État initial
      user: null,
      isAuthenticated: false,
      isLoading: false,


      // Définir l'utilisateur connecté

      setUser: (user) =>
            set({
                  user,
                  isAuthenticated: !!user,
            }),

      // Définir l'état de chargement
      setLoading: (loading) =>
            set({
                  isLoading: loading,
            }),

      // Déconnexion
      logout: () =>
            set({
                  user: null,
                  isAuthenticated: false,
            }),

      // Vérifier si l'utilisateur est un client
      isCustomer: () => {
            const { user } = get();
            return user?.isCustomer() || false;
      },

      // Vérifier si l'utilisateur est un prestataire
      isProvider: () => {
            const { user } = get();
            return user?.isProvider() || false;
      },

      // Vérifier si l'email est vérifié
      hasVerifiedEmail: () => {
            const { user } = get();
            return user?.hasVerifiedEmail() || false;
      },
});