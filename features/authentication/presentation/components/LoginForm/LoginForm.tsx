'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';

import { loginSchema, LoginFormData } from '../../validators/auth.schema';
import { useLogin } from '../../hooks/useLogin';
import { AUTH_ROUTES, withLocale } from '@/core/config/routes';
import { BRUTE_FORCE_CONFIG } from '@/core/config/constants';
import { Locale } from '@/core/i18n/config';

// Sub-components
interface FieldErrorProps {
  message?: string;
}

function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-sm text-red-600">
      {message}
    </p>
  );
}

// Countdown — affiche MM:SS à partir de ms restantes
interface CountdownProps {
  remainingMs: number;
  label: string;
}

function Countdown({ remainingMs, label }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(remainingMs);

  // Sync si remainingMs change (ex: nouveau lock déclenché)
  useEffect(() => {
    setTimeLeft(remainingMs);
  }, [remainingMs]);

  // Tick chaque seconde
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  if (timeLeft <= 0) return null;

  const totalSeconds = Math.ceil(timeLeft / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className="flex items-center justify-center gap-2 rounded-md border border-orange-200
        bg-orange-50 px-4 py-3 text-sm font-medium text-orange-700"
    >
      {/* Icône horloge */}
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      </svg>
      <span>
        {label} <span className="font-mono tabular-nums">{minutes}:{seconds}</span>
      </span>
    </div>
  );
}

// AttemptsWarning — avertissement avant le blocage

interface AttemptsWarningProps {
  attempts: number;
  max: number;
  message: string;
}

function AttemptsWarning({ attempts, max, message }: AttemptsWarningProps) {
  if (attempts === 0 || attempts >= max) return null;

  const remaining = max - attempts;

  return (
    <p role="status" className="text-center text-xs text-orange-600">
      {message.replace('{remaining}', String(remaining))}
    </p>
  );
}

// LoginFormInner — consomme useLogin via FormProvider

function LoginFormInner() {
  const t = useTranslations('authentication');
  const locale = useLocale() as Locale;
  const [showPassword, setShowPassword] = useState(false);

  const { onSubmit, isSubmitting, isLocked, remainingLockMs, failedAttempts } =
    useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext<LoginFormData>();

  const isDisabled = isSubmitting || isLocked;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-full max-w-md space-y-5"
    >
      {/* ── Header ── */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('login.title')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('login.subtitle')}</p>
      </div>

      {/* ── Countdown blocage ── */}
      {isLocked && (
        <Countdown
          remainingMs={remainingLockMs}
          label={t('login.lockedCountdown')}
        />
      )}

      {/* ── Erreur globale ── */}
      {errors.root && !isLocked && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errors.root.message}
        </div>
      )}

      {/* ── Avertissement tentatives restantes ── */}
      <AttemptsWarning
        attempts={failedAttempts}
        max={BRUTE_FORCE_CONFIG.MAX_ATTEMPTS}
        message={t('login.attemptsWarning')}
      />

      {/* ── Email ── */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t('login.email')}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          disabled={isDisabled}
          aria-invalid={!!errors.email}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
            disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60
            ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
          {...register('email')}
        />
        <FieldError message={errors.email?.message ? t(errors.email.message) : undefined} />
      </div>

      {/* ── Mot de passe + Toggle ── */}
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            {t('login.password')}
          </label>
          <Link
            href={withLocale(AUTH_ROUTES.FORGOT_PASSWORD, locale)}
            className="text-xs font-medium text-blue-600 hover:underline"
            tabIndex={isDisabled ? -1 : 0}
          >
            {t('login.forgotPassword')}
          </Link>
        </div>

        <div className="relative mt-1">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            disabled={isDisabled}
            aria-invalid={!!errors.password}
            className={`block w-full rounded-md border px-3 py-2 pr-10 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500
              disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60
              ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
            {...register('password')}
          />

          {/* Toggle visibilité mot de passe */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isDisabled}
            aria-label={t(showPassword ? 'login.hidePassword' : 'login.showPassword')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
              transition-colors hover:text-gray-600 disabled:cursor-not-allowed
              disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:ring-offset-1 rounded"
          >
            {showPassword ? (
              // Icône œil barré
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7
                    a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878
                    9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3
                    3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543
                    7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              // Icône œil
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943
                    9.542 7-1.274 4.057-5.064 7-9.542 7-4.477
                    0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        <FieldError message={errors.password?.message ? t(errors.password.message) : undefined} />
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold
          text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none
          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? t('login.submitting') : t('login.submit')}
      </button>

      {/* ── Lien inscription ── */}
      <p className="text-center text-sm text-gray-500">
        {t('login.noAccount')}{' '}
        <Link
          href={withLocale(AUTH_ROUTES.REGISTER, locale)}
          className="font-medium text-blue-600 hover:underline"
        >
          {t('login.register')}
        </Link>
      </p>
    </form>
  );
}

// LoginForm — point d'entrée public
// Fournit le FormProvider à LoginFormInner

export function LoginForm() {
  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',         // validation email au blur (UX moins agressive qu'onChange)
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <FormProvider {...methods}>
      <LoginFormInner />
    </FormProvider>
  );
}