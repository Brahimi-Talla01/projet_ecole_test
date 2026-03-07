import { useEffect } from 'react';
import { useGlobalStore } from '@/core/store';
import { apiClient } from '@/core/api/client';
import { UserDto } from '../../data/dtos/LoginDto';
import { UserMapper } from '../../data/mappers/user.mapper';

/**
 * Hook pour récupérer l'utilisateur courant au chargement de l'app
 * Vérifie si un utilisateur est connecté (via cookie httpOnly)
 */
export function useCurrentUser() {
  const { setUser, setLoading, user, isLoading } = useGlobalStore();

  useEffect(() => {
    let isMounted = true;

    const fetchCurrentUser = async () => {
      // Si on a déjà l'utilisateur, ne pas refetch
      if (user) return;

      setLoading(true);

      try {
        // Appeler l'endpoint /auth/me
        // Le cookie httpOnly sera automatiquement envoyé
        const response = await apiClient.get<{ user: UserDto }>('/auth/me');

        if (isMounted) {
          const currentUser = UserMapper.toDomain(response.data.user);
          setUser(currentUser);
        }
      } catch (error) {
        // Si 401, l'utilisateur n'est pas connecté (cookie expiré/invalide)
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []); // Exécuté une seule fois au montage

  return { user, isLoading };
}