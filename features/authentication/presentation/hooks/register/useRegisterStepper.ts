"use client"

import { RegisterDraft, RegisterStep, RegisterStepperState } from '@/shared/types/common.types';
import { useState, useRef, useCallback } from 'react';

const STORAGE_KEY = 'register-draft';

export function useRegisterStepper(): RegisterStepperState {
      const [draft, setDraft] = useState<Partial<RegisterDraft>>(() => {
            if (typeof window === 'undefined') return {};
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : { currentStep: 0 };
      });

      const [currentStep, setCurrentStep] = useState<RegisterStep>(
            (draft.currentStep as RegisterStep) || 0
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

      const clearDraft = useCallback(() => {
            localStorage.removeItem(STORAGE_KEY);
            passwordRef.current = '';
            setDraft({});
            setCurrentStep(1);
      }, []);

      const setPassword = useCallback((pass: string) => {
            passwordRef.current = pass;
      }, []);

      return {
            currentStep,
            draft,
            passwordRef,
            goToStep,
            updateDraft,
            clearDraft,
      };
}