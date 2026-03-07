import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalStore } from '@/core/store';
import { authRepository } from '../../data/repositories/AuthRepository';

/**
 * Hook pour la déconnexion
 */
export function useLogout() {
  const router = useRouter();
  const { logout: clearAuthState } = useGlobalStore();

  const logout = useCallback(async () => {
    try {
      // 1. Appeler l'API de logout (supprime les cookies httpOnly)
      await authRepository.logout();

      // 2. Clear le state Zustand
      clearAuthState();

      // 3. Rediriger vers la page de login
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      
      // Même en cas d'erreur, on déconnecte localement
      clearAuthState();
      router.push('/login');
    }
  }, [clearAuthState, router]);

  return { logout };
}