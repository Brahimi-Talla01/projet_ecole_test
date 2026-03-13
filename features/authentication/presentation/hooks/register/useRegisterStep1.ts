'use client';

import { useCallback, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { RegisterFormData } from '../../validators/auth.schema';
import { authRepository } from '@/features/authentication/data/repositories/AuthRepository';

interface UseRegisterStep1Props {
  onNext: () => void;
}

interface UseRegisterStep1Return {
  handleNext: () => Promise<void>;
  isChecking: boolean;
}

export function useRegisterStep1({
  onNext,
}: UseRegisterStep1Props): UseRegisterStep1Return {
  const { trigger, getValues, setError } = useFormContext<RegisterFormData>();
  const t = useTranslations('authentication.register');

  const [isChecking, setIsChecking] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNext = useCallback(async () => {
    const valid = await trigger('email');
    if (!valid) return;

    const email = getValues('email');

    if (debounceRef.current) clearTimeout(debounceRef.current);

    setIsChecking(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const available = await authRepository.checkEmailAvailability(email);

        if (!available) {
          setError('email', {
            type: 'manual',
            message: t('errors.emailTaken'),
          });
          return;
        }

        onNext();
      } catch {
        onNext();
      } finally {
        setIsChecking(false);
      }
    }, 400);
  }, [trigger, getValues, setError, onNext, t]);

  return {
    handleNext,
    isChecking,
  };
}