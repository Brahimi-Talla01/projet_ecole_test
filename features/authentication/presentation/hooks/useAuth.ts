'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { authRepository } from '../../data/repositories/AuthRepository';
import { UserMapper } from '../../data/mappers/user.mapper';
import { useAppStore } from '@/core/store';


// Query key
export const AUTH_QUERY_KEY = ['auth', 'me'] as const;

// Hook
export function useAuth() {
      const { setUser, clearSession, setLoadingSession } = useAppStore();

      const { data, isError, isSuccess, isPending } = useQuery({
            queryKey: AUTH_QUERY_KEY,
            queryFn: () => authRepository.getMe(),

            retry: (failureCount, error: unknown) => {
                  const status = (error as { statusCode?: number })?.statusCode;
                  if (status === 401) return false;
                  return failureCount < 2;
            },

            refetchOnWindowFocus: false,
            refetchOnReconnect: false,

            staleTime: Infinity,
      });

      // Synchronisation store Zustand -> résultat query
      useEffect(() => {
            if (isSuccess && data) {
                  const user = UserMapper.toDomain(data);
                  setUser(user);
                  setLoadingSession(false);
            }
      }, [isSuccess, data, setUser, setLoadingSession]);

      useEffect(() => {
            if (isError) {
                  clearSession();
                  setLoadingSession(false);
            }
      }, [isError, clearSession, setLoadingSession]);

      return {
            isLoadingSession: isPending,
      };
}