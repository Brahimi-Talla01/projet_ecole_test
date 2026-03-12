'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormContext } from 'react-hook-form';

import { LoginUseCase } from '../../domain/use-cases/login.use-case';
import { authRepository } from '../../data/repositories/AuthRepository';
import { UserMapper } from '../../data/mappers/user.mapper';
import { LoginFormData } from '../validators/auth.schema';
import { useAppStore } from '@/core/store';
import { MAIN_ROUTES, withLocale } from '@/core/config/routes';
import { AUTH_QUERY_KEY } from './useAuth';

// Constants
const loginUseCase = new LoginUseCase(authRepository);

// Types
interface UseLoginReturn {
      onSubmit: (data: LoginFormData) => Promise<void>;
      isSubmitting: boolean;
      isLocked: boolean;
      remainingLockMs: number;
      failedAttempts: number;
}

// Hook
export function useLogin(): UseLoginReturn {
      const router = useRouter();
      const searchParams = useSearchParams();
      const locale = useLocale() as 'fr' | 'en';
      const queryClient = useQueryClient();
      const { setError } = useFormContext<LoginFormData>();

      const {
            recordFailedAttempt,
            lockAccount,
            resetAttempts,
            setUser,
            isLocked: getIsLocked,
            getRemainingLockMs,
            failedAttempts,
      } = useAppStore();

      const isLocked = getIsLocked();
      const remainingLockMs = getRemainingLockMs();

      //  TanStack Mutation
      const { mutateAsync, isPending } = useMutation({
            mutationFn: (data: LoginFormData) =>
                  loginUseCase.execute({
                        email: data.email,
                        password: data.password,
                  }),

            onSuccess: (result) => {
                  if (!result.success || !result.data) return;

                  const user = UserMapper.toDomain(result.data.user);
                  setUser(user);
                  resetAttempts();

                  queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });

                  //  Gestion returnUrl 
                  const rawReturnUrl = searchParams.get('returnUrl');

                  const returnUrl =
                  rawReturnUrl && rawReturnUrl.startsWith('/')
                  ? rawReturnUrl
                  : withLocale(MAIN_ROUTES.DASHBOARD, locale);

                  router.push(returnUrl);
            },
      });

      //  Soumission 
      const onSubmit = useCallback(
            async (data: LoginFormData) => {
                  if (getIsLocked()) return;

                  const result = await mutateAsync(data);

                  if (result.success) return;

                  if (result.isLocked) {
                        lockAccount();
                        setError('root', {
                              type: 'manual',
                              message: result.error ?? 'Accès temporairement bloqué.',
                        });
                        return;
                  }

                  recordFailedAttempt();
                  setError('root', {
                        type: 'manual',
                        message: result.error ?? 'Identifiants incorrects. Veuillez réessayer.',
                  });
            },
            [mutateAsync, setError, getIsLocked, lockAccount, recordFailedAttempt],
      );

      return {
            onSubmit,
            isSubmitting: isPending,
            isLocked,
            remainingLockMs,
            failedAttempts,
      };
}