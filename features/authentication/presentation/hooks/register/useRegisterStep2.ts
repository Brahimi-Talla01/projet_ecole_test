"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { RegisterStepperState } from '@/shared/types/common.types';

export function useRegisterStep2(stepper: RegisterStepperState) {
      const [formData, setFormData] = useState({
            firstName: stepper.draft.firstName || '',
            lastName: stepper.draft.lastName || '',
            phoneNumber: stepper.draft.phoneNumber || '',
            city: stepper.draft.city || '',
            country: stepper.draft.country || '',
      });

      const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleContinue = (e: FormEvent) => {
            e.preventDefault();
            
            stepper.updateDraft(formData);
            
            stepper.goToStep(3);
      };

      const handleBack = () => {
            stepper.goToStep(1);
      };

      return {
            formData,
            handleChange,
            handleContinue,
            handleBack
      };
}