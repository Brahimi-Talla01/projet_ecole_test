"use client";

import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, CheckCircle2, Circle, CircleCheckBig } from "lucide-react";
import { Button } from "@/core/ui/atoms/Button";
import { Input } from "@/core/ui/atoms/Input";
import { RegisterStepperState } from "@/shared/types/common.types";
import { useRegisterStep3 } from "../../../hooks/register/useRegisterStep3";
import { useTranslations } from "next-intl";

interface PasswordRule {
  label: string;
  test: (pwd: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: "At least 8 characters and up to 24.",         test: (p) => p.length >= 8 && p.length <= 24 },
  { label: "At least one number (0-9).",                  test: (p) => /\d/.test(p) },
  { label: "At least one special character (e.g., !, @, #, $, %).", test: (p) => /[^A-Za-z0-9]/.test(p) },
  { label: "At least one uppercase and lowercase letter.", test: (p) => /[A-Z]/.test(p) && /[a-z]/.test(p) },
];

interface RegisterStep3Props {
  stepper: RegisterStepperState;
}

export const RegisterStep3 = ({ stepper }: RegisterStep3Props) => {
  const t = useTranslations("authentication.register");

  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    handleContinue,
    handleBack,
  } = useRegisterStep3(stepper);

  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const showRules = password.length > 0;

  return (
    <div className="flex flex-col gap-6">

      {/* ── Bouton retour ── */}
      <div>
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-gris-500 hover:text-gris-800 transition-colors w-fit cursor-pointer"
          aria-label={t("cta.back")}
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">{t("cta.back")}</span>
        </button>

      </div>

      {/* ── Titre ── */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-gris-900">Create Password</h2>
        <p className="text-sm text-gris-500 leading-relaxed">
          To enhance your account's security, please create a new password below.
        </p>
      </div>

      {/* ── Formulaire ── */}
      <form onSubmit={handleContinue} className="flex flex-col gap-5">

        {/* Nouveau mot de passe */}
        <div className="flex flex-col gap-2">
          <Input
            label={t("fields.password")}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("placeholders.password")}
            error={errors.password}
            autoComplete="new-password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="text-gris-400 hover:text-gris-600 transition-colors cursor-pointer"
                aria-label={showPassword ? "Masquer" : "Afficher"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          {/* Règles — visibles uniquement après le premier caractère */}
          {showRules && (
            <ul className="flex flex-col gap-1.5 mt-1">
              {PASSWORD_RULES.map((rule) => {
                const passed = rule.test(password);
                return (
                  <li key={rule.label} className="flex items-center gap-2">
                    {passed
                      ? <CircleCheckBig size={15} className="text-success-600 shrink-0" />
                      : <CircleCheckBig size={15} className="text-gris-300 shrink-0" />
                    }
                    <span className={[
                      "text-xs leading-tight",
                      passed ? "text-success-600" : "text-gris-400",
                    ].join(" ")}>
                      {rule.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Confirmation mot de passe */}
        <Input
          label={t("fields.confirmPassword")}
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t("placeholders.confirmPassword")}
          error={errors.confirmPassword}
          autoComplete="new-password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="text-gris-400 hover:text-gris-600 transition-colors cursor-pointer"
              aria-label={showConfirmPassword ? "Masquer" : "Afficher"}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        {/* Bouton soumettre — grisé si champs vides */}
        <Button
          type="submit"
          fullWidth
          className="mt-2"
          disabled={!password || !confirmPassword}
        >
          Continue
        </Button>

      </form>
    </div>
  );
};