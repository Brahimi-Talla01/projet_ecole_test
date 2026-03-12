
import { z } from "zod";
import { VALIDATION_CONFIG } from "@/core/config/constants";
import { Language } from "../../domain/entities/enums";

export const emailSchema = z
  .string()
  .min(1, { message: "validation.email.required" })
  .trim()
  .toLowerCase()
  .max(VALIDATION_CONFIG.EMAIL_MAX_LENGTH, {
    message: "validation.email.too_long",
  })
  .email({ message: "validation.email.invalid" });

export const passwordSchema = z
  .string()
  .min(VALIDATION_CONFIG.PASSWORD_MIN_LENGTH, {
    message: "validation.password.min_length",
  })
  .max(VALIDATION_CONFIG.PASSWORD_MAX_LENGTH, {
    message: "validation.password.max_length",
  })
  .regex(/[A-Z]/, { message: "validation.password.uppercase" })
  .regex(/[a-z]/, { message: "validation.password.lowercase" })
  .regex(/[0-9]/, { message: "validation.password.number" })
  .regex(/[^A-Za-z0-9]/, { message: "validation.password.special" });

// ─────────────────────────────────────────────
// Login
// ─────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, { message: "validation.password.required" })
    .max(VALIDATION_CONFIG.PASSWORD_MAX_LENGTH),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "validation.firstName.required" })
      .max(50, { message: "validation.firstName.too_long" })
      .trim(),
    lastName: z
      .string()
      .min(1, { message: "validation.lastName.required" })
      .max(50, { message: "validation.lastName.too_long" })
      .trim(),
    email: emailSchema,
    phoneNumber: z.number,
    city: z.string,
    country: z.string,
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: "validation.confirmPassword.required" }),
    preferredLang: z.nativeEnum(Language).optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "validation.acceptTerms.required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "validation.confirmPassword.mismatch",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// ─────────────────────────────────────────────
// Verify Email
// ─────────────────────────────────────────────

export const verifyEmailSchema = z.object({
  token: z.string().min(1, { message: "validation.token.required" }),
});

export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

// ─────────────────────────────────────────────
// Verify OTP
// ─────────────────────────────────────────────

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(VALIDATION_CONFIG.OTP_LENGTH, { message: "validation.otp.length" })
    .regex(/^[0-9]+$/, { message: "validation.otp.digits_only" }),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;

// ─────────────────────────────────────────────
// Reset Password
// ─────────────────────────────────────────────

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, { message: "validation.token.required" }),
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, { message: "validation.confirmPassword.required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "validation.confirmPassword.mismatch",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// ─────────────────────────────────────────────
// Forgot Password
// ─────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// ─────────────────────────────────────────────
// Helper : force du mot de passe
// ─────────────────────────────────────────────

export type PasswordStrength = "weak" | "medium" | "strong";

export function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
}
