"use client";

import { useState, FormEvent } from 'react';
import { RegisterStepperState } from '@/shared/types/common.types';
import { authRepository } from '@/features/authentication/data/repositories/AuthRepository';

export function useRegisterStep1(stepper: RegisterStepperState) {
      const [email, setEmail] = useState(stepper.draft.email || '');
      const [error, setError] = useState<string | null>(null);
      const [isLoading, setIsLoading] = useState(false);

      const handleContinue = async (e: FormEvent) => {
            e.preventDefault();
            setError(null);

            if (!email || !email.includes('@')) {
                  setError("Veuillez entrer une adresse email valide.");
                  return;
            }

            setIsLoading(true);

            try {
                  // const isAvailable = await authRepository.checkEmailAvailability(email);
                  const isAvailable = true;

                  if (isAvailable) {
                        stepper.updateDraft({ email });
                        stepper.goToStep(2);
                  } else {
                        setError("Cet email est déjà associé à un compte.");
                  }
            } catch (err) {
                  setError("Impossible de vérifier l'email pour le moment. Réessayez.");
            } finally {
                  setIsLoading(false);
            }
      };

      return {
            email,
            setEmail,
            error,
            isLoading,
            handleContinue
      };
}