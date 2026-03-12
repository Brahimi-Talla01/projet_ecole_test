"use client";

import { RegisterStepperState } from '@/shared/types/common.types';
import { useEffect, useRef } from 'react';
import { useRegister } from '../useRegister';
import { RegisterFormData } from '../../validators/auth.schema';
import { Language } from '@/features/authentication/domain/entities/enums';

export function useRegisterStep4(stepper: RegisterStepperState) {
  const { onSubmit, isSubmitting } = useRegister();
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (hasSubmitted.current) return;

    const submitRegistration = async () => {
      const finalData: RegisterFormData = {
        email: stepper.draft.email || "",
        firstName: stepper.draft.firstName || "",
        lastName: stepper.draft.lastName || "",
        phoneNumber: Number(stepper.draft.phoneNumber) || 0,
        city: stepper.draft.city || "",
        country: stepper.draft.country || "",
        password: stepper.passwordRef.current,
        confirmPassword: stepper.passwordRef.current,
        acceptTerms: true,
        preferredLang: (stepper.draft.preferredLang) as Language,
      };

      try {
        hasSubmitted.current = true;
        await onSubmit(finalData);
        stepper.clearDraft(); 
      } catch (error) {
        hasSubmitted.current = false;
      }
    };

    submitRegistration();
  }, [onSubmit, stepper]);

  return { isSubmitting };
}