'use client';

import { useState, useEffect } from 'react';
import { RegisterStepperState } from '@/shared/types/common.types';
import { authRepository } from '@/features/authentication/data/repositories/AuthRepository';
import { Language } from '@/features/authentication/domain/entities/enums';

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseRegisterStep4Return {
  status: SubmitStatus;
  errorMessage: string | null;
  handleSendVerification: () => Promise<void>;
  handleBack: () => void;
}

export function useRegisterStep4(
  stepper: RegisterStepperState,
): UseRegisterStep4Return {
  const [status, setStatus]           = useState<SubmitStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    register();
  }, []);

  const register = async () => {
    const { draft } = stepper;
    const password = stepper.passwordRef.current;

    console.log('draft:', stepper.draft);
    console.log('password:', stepper.passwordRef.current);

    if (
      !draft.email ||
      !draft.firstName ||
      !draft.lastName ||
      !draft.phoneNumber ||
      !draft.city ||
      !draft.country ||
      !password
    ) {
      setStatus('error');
      setErrorMessage('Données manquantes. Veuillez recommencer.');
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    try {
      await authRepository.register({
        email:         draft.email,
        firstName:     draft.firstName,
        lastName:      draft.lastName,
        phoneNumber:   draft.phoneNumber,
        city:          draft.city,
        country:       draft.country,
        preferredLang: Language.FR,
        password,
        acceptTerms:   true,
      });

      stepper.passwordRef.current = '';
      stepper.clearDraft();

      setStatus('success');
    } catch (error: unknown) {
      const apiError = error as { statusCode?: number; message?: string };

      if (apiError.statusCode === 409) {
        stepper.goToStep(0);
        return;
      }

      setStatus('error');
      setErrorMessage(
        apiError.message ?? 'Une erreur est survenue. Veuillez réessayer.',
      );
    }
  };

  const handleSendVerification = async () => {
    if (status === 'success') {
      try {
        await authRepository.verifyEmail(stepper.draft.email ?? '');
      } catch {
      }
      return;
    }

    await register();
  };

  const handleBack = () => {
    stepper.prevStep();
  };

  return {
    status,
    errorMessage,
    handleSendVerification,
    handleBack,
  };
}