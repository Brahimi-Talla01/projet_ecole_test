"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { RegisterStepperState } from "@/shared/types/common.types";

interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  country: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
}

const PHONE_REGEX = /^\+?[0-9\s\-().]{7,20}$/;

function validate(data: FormData): FormErrors {
      const errors: FormErrors = {};

      if (!data.firstName.trim())
            errors.firstName = "validation.firstName.required";

      if (!data.lastName.trim())
            errors.lastName = "validation.lastName.required";

      if (!data.phoneNumber.trim()) {
            errors.phoneNumber = "validation.phoneNumber.required";
      } else if (!PHONE_REGEX.test(data.phoneNumber)) {
            errors.phoneNumber = "validation.phoneNumber.invalid";
      }

      if (!data.city)
            errors.city = "validation.city.required";

      if (!data.country)
            errors.country = "validation.country.required";

      return errors;
}

export function useRegisterStep2(stepper: RegisterStepperState) {
      const [formData, setFormData] = useState<FormData>({
            firstName:   stepper.draft.firstName   || "",
            lastName:    stepper.draft.lastName    || "",
            phoneNumber: stepper.draft.phoneNumber || "",
            city:        stepper.draft.city        || "",
            country:     stepper.draft.country     || "",
      });

      const [errors, setErrors] = useState<FormErrors>({});

      const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
            if (errors[name as keyof FormErrors]) {
                  setErrors((prev) => ({ ...prev, [name]: undefined }));
            }
      };

      const handleSelectChange = (field: keyof FormData, value: string) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            if (errors[field]) {
                  setErrors((prev) => ({ ...prev, [field]: undefined }));
            }
      };

      const handleContinue = (e: FormEvent) => {
            e.preventDefault();

            const validationErrors = validate(formData);

            if (Object.keys(validationErrors).length > 0) {
                  setErrors(validationErrors);
                  return;
            }

            stepper.updateDraft(formData);
            stepper.goToStep(2);
      };

      const handleBack = () => {
            stepper.updateDraft(formData);
            stepper.prevStep();
      };

      return {
            formData,
            errors,
            handleChange,
            handleSelectChange,
            handleContinue,
            handleBack,
      };
}