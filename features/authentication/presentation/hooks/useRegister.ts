"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";

import { RegisterUseCase } from "../../domain/use-cases/register.use-case";
import { authRepository } from "../../data/repositories/AuthRepository";
import { RegisterFormData } from "../validators/auth.schema";
import { ProfileType } from "../../domain/entities/enums";
import { AUTH_ROUTES, withLocale } from "@/core/config/routes";

// Constants
const EMAIL_DEBOUNCE_MS = 500;
const registerUseCase = new RegisterUseCase(authRepository);

// Types
interface UseRegisterReturn {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  checkEmailAvailability: (email: string) => void;
  isSubmitting: boolean;
  isCheckingEmail: boolean;
}

// Hook
export function useRegister(): UseRegisterReturn {
  const router = useRouter();
  const locale = useLocale() as "fr" | "en";
  const { setError, clearErrors } = useFormContext<RegisterFormData>();

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // TanStack Mutation
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: RegisterFormData) =>
      registerUseCase.execute({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        profileType: ProfileType.CUSTOMER,
        preferredLang: data.preferredLang,
      }),

    onSuccess: (result, variables) => {
      if (!result.success) return;

      const destination = withLocale(AUTH_ROUTES.VERIFY_EMAIL, locale);
      router.push(
        `${destination}?email=${encodeURIComponent(variables.email)}`,
      );
    },
  });

  // Vérification email (debounced)
  const checkEmailAvailability = useCallback(
    (email: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (!email || !email.includes("@")) {
        clearErrors("email");
        setIsCheckingEmail(false);
        return;
      }

      setIsCheckingEmail(true);

      debounceTimerRef.current = setTimeout(async () => {
        try {
          const isAvailable = await authRepository.checkEmailAvailability(email);

          if (!isAvailable) {
            setError("email", {
              type: "manual",
              message: "Cette adresse email est déjà associée à un compte.",
            });
          } else {
            clearErrors("email");
          }
        } catch {
          // Échec silencieux : le 409 à la soumission reste le filet de sécurité
          clearErrors("email");
        } finally {
          setIsCheckingEmail(false);
        }
      }, EMAIL_DEBOUNCE_MS);
    },
    [setError, clearErrors],
  );

  // Soumission
  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      const result = await mutateAsync(data);

      if (result.success) return;

      if (result.emailConflict) {
        setError("email", {
          type: "manual",
          message: result.error ?? "Email déjà utilisé.",
        });
        return;
      }

      setError("root", {
        type: "manual",
        message: result.error ?? "Une erreur est survenue.",
      });
    },
    [mutateAsync, setError],
  );

  return {
    onSubmit,
    checkEmailAvailability,
    isSubmitting: isPending,
    isCheckingEmail,
  };
}
