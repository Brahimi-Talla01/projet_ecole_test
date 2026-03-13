"use client"

import { RegisterDraft, RegisterStep, RegisterStepperState } from '@/shared/types/common.types';
import { useState, useRef, useCallback } from 'react';

const STORAGE_KEY = 'register-draft';
const MAX_STEP: RegisterStep = 4;
const INITIAL_STEP: RegisterStep = 0;

export function useRegisterStepper(): RegisterStepperState {
      const [draft, setDraft] = useState<Partial<RegisterDraft>>(() => {
            if (typeof window === 'undefined') return {};
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : { currentStep: INITIAL_STEP };
      });

      const [currentStep, setCurrentStep] = useState<RegisterStep>(
            (draft.currentStep as RegisterStep) ?? INITIAL_STEP
      );

      const passwordRef = useRef<string>('');

      const updateDraft = useCallback((data: Partial<RegisterDraft>) => {
            setDraft((prev) => {
                  const newDraft = { ...prev, ...data };
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(newDraft));
                  return newDraft;
            });
      }, []);

      const goToStep = useCallback((step: RegisterStep) => {
            setCurrentStep(step);
            const saved = localStorage.getItem(STORAGE_KEY);
            const parsed = saved ? JSON.parse(saved) : {};
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, currentStep: step }));
      }, []);

      const nextStep = useCallback(() => {
            const next = Math.min(currentStep + 1, MAX_STEP) as RegisterStep;
            goToStep(next);
      }, [currentStep, goToStep]);

      const prevStep = useCallback(() => {
            const prev = Math.max(currentStep - 1, INITIAL_STEP) as RegisterStep;
            goToStep(prev);
      }, [currentStep, goToStep]);

      const clearDraft = useCallback(() => {
            localStorage.removeItem(STORAGE_KEY);
            passwordRef.current = '';
            setDraft({});
            setCurrentStep(INITIAL_STEP);
      }, []);

      return {
            currentStep,
            draft,
            passwordRef,
            goToStep,
            nextStep,
            prevStep,
            updateDraft,
            clearDraft,
      };
}