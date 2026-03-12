"use client";

import { useState } from 'react';
import { RegisterStepperState } from '@/shared/types/common.types';

export function useRegisterStep3(stepper: RegisterStepperState) {
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [error, setError] = useState<string | null>(null);

      const handleContinue = (e: React.FormEvent) => {
            e.preventDefault();
            setError(null);

            if (password.length < 8) {
                  setError("Le mot de passe doit contenir au moins 8 caractères.");
                  return;
            }

            if (password !== confirmPassword) {
                  setError("Les mots de passe ne correspondent pas.");
                  return;
            }

            stepper.passwordRef.current = password;
            stepper.goToStep(4);
      };

      const handleBack = () => {
            stepper.passwordRef.current = ''; 
            stepper.goToStep(2);
      };

      return {
            password,
            setPassword,
            confirmPassword,
            setConfirmPassword,
            error,
            handleContinue,
            handleBack
      };
}