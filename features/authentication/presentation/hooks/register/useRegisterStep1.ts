'use client';

import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { RegisterFormData } from '../../validators/auth.schema';
import { RegisterStepperState } from '@/shared/types/common.types';

interface UseRegisterStep1Props {
  onNext: () => void;
  stepper: RegisterStepperState;
}

interface UseRegisterStep1Return {
  handleNext: () => Promise<void>;
}

export function useRegisterStep1({
  onNext,
  stepper, 
}: UseRegisterStep1Props): UseRegisterStep1Return {
  const { trigger, getValues } = useFormContext<RegisterFormData>();

  const handleNext = useCallback(async () => {
    const valid = await trigger('email');
    if (!valid) return;

    const email = getValues('email');
    stepper.updateDraft({ email });

    onNext();
  }, [trigger, getValues, stepper, onNext]);

  return { handleNext };
}