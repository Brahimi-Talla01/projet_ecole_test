import { useFormContext } from "react-hook-form";
import { Locale, useLocale, useTranslations } from "use-intl";
import { calculatePasswordStrength, RegisterFormData } from "../../validators/auth.schema";
import { useEffect } from "react";
import { useRegister } from "../../hooks/useRegister";
import { Link } from "lucide-react";
import { AUTH_ROUTES, withLocale } from "@/core/config/routes";
import { PasswordStrengthBar } from "./PasswordStrengthBar";

interface FieldErrorProps {
  message?: string;
}

function FieldError({ message }: FieldErrorProps) {
      if (!message) return null;
      return (
            <p role="alert" className="mt-1 text-sm text-red-600">
                  {message}
            </p>
      )
}

function RegisterFormInner() {
  const t = useTranslations('authentication');
  const locale = useLocale() as Locale;
  const { onSubmit, checkEmailAvailability, isSubmitting, isCheckingEmail } = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useFormContext<RegisterFormData>();

  const passwordValue = watch('password');
  const strength = passwordValue ? calculatePasswordStrength(passwordValue) : null;

  // Déclenche la vérification email dès que le champ email change
  const emailValue = watch('email');
  useEffect(() => {
    checkEmailAvailability(emailValue ?? '');
  }, [emailValue, checkEmailAvailability]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="w-full max-w-md space-y-5"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('register.title')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('register.subtitle')}</p>
      </div>

      {/* Erreur globale (réseau, serveur) */}
      {errors.root && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errors.root.message}
        </div>
      )}

      {/* ── Prénom / Nom ── */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            {t('register.firstName')}
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName}
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
            {...register('firstName')}
          />
          <FieldError message={errors.firstName?.message ? t(errors.firstName.message) : undefined} />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            {t('register.lastName')}
          </label>
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            aria-invalid={!!errors.lastName}
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
            {...register('lastName')}
          />
          <FieldError message={errors.lastName?.message ? t(errors.lastName.message) : undefined} />
        </div>
      </div>

      {/* ── Email ── */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t('register.email')}
        </label>
        <div className="relative mt-1">
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={`block w-full rounded-md border px-3 py-2 text-sm shadow-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500
              ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
            {...register('email')}
          />
          {/* Spinner vérification email */}
          {isCheckingEmail && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                className="h-4 w-4 animate-spin text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                aria-label={t('register.emailChecking')}
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          )}
        </div>
        <FieldError message={errors.email?.message ? t(errors.email.message) : undefined} />
      </div>

      {/* ── Mot de passe ── */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {t('register.password')}
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
          {...register('password')}
        />
        <PasswordStrengthBar
          strength={strength}
          label={t('register.passwordStrength.label')}
          weakLabel={t('register.passwordStrength.weak')}
          mediumLabel={t('register.passwordStrength.medium')}
          strongLabel={t('register.passwordStrength.strong')}
        />
        <FieldError message={errors.password?.message ? t(errors.password.message) : undefined} />
      </div>

      {/* ── Confirmation mot de passe ── */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          {t('register.confirmPassword')}
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
          {...register('confirmPassword')}
        />
        <FieldError message={errors.confirmPassword?.message ? t(errors.confirmPassword.message) : undefined} />
      </div>

      {/* ── Conditions d'utilisation ── */}
      <div className="flex items-start gap-2">
        <input
          id="acceptTerms"
          type="checkbox"
          aria-invalid={!!errors.acceptTerms}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          {...register('acceptTerms')}
        />
        <div>
          <label htmlFor="acceptTerms" className="text-sm text-gray-700">
            {t('register.acceptTerms')}
          </label>
          <FieldError message={errors.acceptTerms?.message ? t(errors.acceptTerms.message) : undefined} />
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white
          shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2
          focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? t('register.submitting') : t('register.submit')}
      </button>

      {/* ── Lien connexion ── */}
      <p className="text-center text-sm text-gray-500">
        {t('register.alreadyHaveAccount')}{' '}
        <Link
          href={withLocale(AUTH_ROUTES.LOGIN, locale)}
          className="font-medium text-blue-600 hover:underline"
        >
          {t('register.login')}
        </Link>
      </p>
    </form>
  );
}