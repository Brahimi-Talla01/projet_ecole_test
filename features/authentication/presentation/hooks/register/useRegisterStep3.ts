"use client";

import { useState, FormEvent } from "react";
import { RegisterStepperState } from "@/shared/types/common.types";


interface Errors {
  password?: string;
  confirmPassword?: string;
}

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function validate(password: string, confirmPassword: string): Errors {
  const errors: Errors = {};

  if (!password) {
    errors.password = "Le mot de passe est obligatoire.";
  } else if (!PASSWORD_REGEX.test(password)) {
    errors.password =
      "8 caractères minimum, 1 majuscule, 1 chiffre et 1 caractère spécial.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Veuillez confirmer votre mot de passe.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas.";
  }

  return errors;
}

export function useRegisterStep3(stepper: RegisterStepperState) {
  const [password, setPasswordState]               = useState("");
  const [confirmPassword, setConfirmPasswordState] = useState("");
  const [errors, setErrors]                        = useState<Errors>({});

  const setPassword = (value: string) => {
    setPasswordState(value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
  };

  const setConfirmPassword = (value: string) => {
    setConfirmPasswordState(value);
    if (errors.confirmPassword)
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
  };

  const handleContinue = (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(password, confirmPassword);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Stockage en mémoire uniquement — jamais en localStorage
    stepper.passwordRef.current = password;
    stepper.nextStep();
  };

  const handleBack = () => {
    // Efface le mot de passe de la mémoire en cas de retour
    stepper.passwordRef.current = "";
    stepper.prevStep();
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    handleContinue,
    handleBack,
  };
}