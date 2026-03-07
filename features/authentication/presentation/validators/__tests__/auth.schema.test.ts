import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  passwordSchema,
  loginSchema,
  registerSchema,
  verifyOtpSchema,
  calculatePasswordStrength,
} from '../auth.schema';
import { ProfileType, Language } from '../../../domain/entities/enums';

describe('Auth Schemas - Validation Zod', () => {
  describe('emailSchema', () => {
    it('devrait accepter un email valide', () => {
      const result = emailSchema.safeParse('test@example.com');
      expect(result.success).toBe(true);
    });

    it('devrait rejeter un email invalide', () => {
      const result = emailSchema.safeParse('invalid-email');
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un email vide', () => {
      const result = emailSchema.safeParse('');
      expect(result.success).toBe(false);
    });

    it('devrait convertir en minuscules', () => {
      const result = emailSchema.safeParse('TEST@EXAMPLE.COM');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('test@example.com');
      }
    });

    it('devrait trimmer les espaces', () => {
      const result = emailSchema.safeParse('  test@example.com  ');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('test@example.com');
      }
    });
  });

  describe('passwordSchema', () => {
    it('devrait accepter un mot de passe valide', () => {
      const result = passwordSchema.safeParse('Password123!');
      expect(result.success).toBe(true);
    });

    it('devrait rejeter un mot de passe trop court', () => {
      const result = passwordSchema.safeParse('Pass1!');
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un mot de passe sans majuscule', () => {
      const result = passwordSchema.safeParse('password123!');
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un mot de passe sans minuscule', () => {
      const result = passwordSchema.safeParse('PASSWORD123!');
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un mot de passe sans chiffre', () => {
      const result = passwordSchema.safeParse('Password!');
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un mot de passe sans caractère spécial', () => {
      const result = passwordSchema.safeParse('Password123');
      expect(result.success).toBe(false);
    });
  });

  describe('loginSchema', () => {
    it('devrait accepter des données de login valides', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'Password123!',
      });
      expect(result.success).toBe(true);
    });

    it('devrait rejeter un email invalide', () => {
      const result = loginSchema.safeParse({
        email: 'invalid',
        password: 'Password123!',
      });
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un mot de passe vide', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    const validData = {
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      profileType: ProfileType.CUSTOMER,
      acceptTerms: true,
    };

    it('devrait accepter des données d\'inscription valides', () => {
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('devrait rejeter si les mots de passe ne correspondent pas', () => {
      const result = registerSchema.safeParse({
        ...validData,
        confirmPassword: 'DifferentPassword123!',
      });
      expect(result.success).toBe(false);
    });

    it('devrait rejeter si les conditions ne sont pas acceptées', () => {
      const result = registerSchema.safeParse({
        ...validData,
        acceptTerms: false,
      });
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un profileType invalide', () => {
      const result = registerSchema.safeParse({
        ...validData,
        profileType: 'invalid',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('verifyOtpSchema', () => {
    it('devrait accepter un OTP valide à 6 chiffres', () => {
      const result = verifyOtpSchema.safeParse({ otp: '123456' });
      expect(result.success).toBe(true);
    });

    it('devrait rejeter un OTP trop court', () => {
      const result = verifyOtpSchema.safeParse({ otp: '12345' });
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un OTP trop long', () => {
      const result = verifyOtpSchema.safeParse({ otp: '1234567' });
      expect(result.success).toBe(false);
    });

    it('devrait rejeter un OTP avec des lettres', () => {
      const result = verifyOtpSchema.safeParse({ otp: '12345a' });
      expect(result.success).toBe(false);
    });
  });

  describe('calculatePasswordStrength', () => {
    it('devrait retourner "weak" pour un mot de passe faible', () => {
      expect(calculatePasswordStrength('pass')).toBe('weak');
      expect(calculatePasswordStrength('password')).toBe('weak');
    });

    it('devrait retourner "medium" pour un mot de passe moyen', () => {
      expect(calculatePasswordStrength('Password1')).toBe('medium');
      expect(calculatePasswordStrength('password123')).toBe('medium');
    });

    it('devrait retourner "strong" pour un mot de passe fort', () => {
      expect(calculatePasswordStrength('Password123!')).toBe('strong');
      expect(calculatePasswordStrength('MyP@ssw0rd2024')).toBe('strong');
    });
  });
});