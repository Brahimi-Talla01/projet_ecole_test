"use client";

import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/core/ui/atoms/Button";
import { Input } from "@/core/ui/atoms/Input";
import { RegisterStepperState } from "@/shared/types/common.types";
import { useRegisterStep4 } from "../../../hooks/register/useRegisterStep4";
import { useTranslations } from "next-intl";

interface RegisterStep4Props {
  stepper: RegisterStepperState;
}


export const RegisterStep4 = ({ stepper }: RegisterStep4Props) => {
  const t = useTranslations("authentication.register");
  const { status, errorMessage, handleSendVerification, handleBack } =
    useRegisterStep4(stepper);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12">
        <div className="btn-loader w-10 h-10 text-primary-800" />
        <p className="text-gris-500 text-sm animate-pulse">
          Création de votre compte en cours…
        </p>
      </div>
    );
  }

  // ── Erreur ───────────────────────────────────
  if (status === 'error') {
    return (
      <div className="flex flex-col gap-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-gris-500 hover:text-gris-800 transition-colors w-fit cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">{t("cta.back")}</span>
        </button>

        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-xl font-bold">
            !
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-gris-900">
              Une erreur est survenue
            </h2>
            <p className="text-sm text-gris-500">
              {errorMessage ?? "Nous n'avons pas pu valider votre inscription."}
            </p>
          </div>
          <Button onClick={handleSendVerification} fullWidth>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  // ── Succès — fidèle au design ─────────────────
  return (
    <div className="flex flex-col gap-6">

      {/* ── Titre ── */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gris-900">
          Verify Your Identity
        </h2>
        <p className="text-sm text-gris-500 leading-relaxed">
          We have sent a verification link to your email address.
          Please check your inbox and click to complete the verification process.
        </p>
      </div>

      {/* ── Email affiché en lecture seule ── */}
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-semibold text-gris-800">
          Verification link sent to:
        </p>
        <Input
          value={stepper.draft.email ?? ''}
          readOnly
          leftIcon={<Mail size={16} className="text-gris-400" />}
          className="bg-gris-50 text-gris-600 cursor-default"
        />
      </div>

      {/* ── Bouton renvoyer ── */}
      <Button
        onClick={handleSendVerification}
        fullWidth
      >
        Send Verification Link
      </Button>

      {/* ── Lien renvoyer ── */}
      <p className="text-center text-sm text-gris-500">
        {t("step4.noEmail")}{" "}
        <button
          type="button"
          onClick={handleSendVerification}
          className="text-secondary-600 font-semibold hover:underline cursor-pointer"
        >
          {t("cta.resendEmail")}
        </button>
      </p>

    </div>
  );
};