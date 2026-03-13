"use client";

import { FormProvider, useForm } from "react-hook-form";
import { useRegisterStepper } from "../../../hooks/register/useRegisterStepper";
import { RegisterIntro } from "../RegisterIntro";
import { RegisterStep2 } from "../RegisterStep2";
import { RegisterStep3 } from "../RegisterStep3";
import { RegisterStep4 } from "../RegisterStep4";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "../../../validators/auth.schema";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/core/i18n/config";
import { AUTH_ROUTES, withLocale } from "@/core/config/routes";
import { LanguageSwitcher } from "@/core/ui/molecules/Dropdown";
import { Phone } from "lucide-react";
import { Stepper } from "./Stepper";

export const RegisterForm = () => {
  const stepper = useRegisterStepper();
  const locale = useLocale() as Locale;
  const t = useTranslations("authentication.register");

  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const renderStep = () => {
    switch (stepper.currentStep) {
      case 0:  return <RegisterIntro stepper={stepper} />;
      case 1:  return <RegisterStep2 stepper={stepper} />;
      case 2:  return <RegisterStep3 stepper={stepper} />;
      case 3:  return <RegisterStep4 stepper={stepper} />;
      default: return <RegisterIntro stepper={stepper} />;
    }
  };

  return (
    <FormProvider {...methods}>

      <header className="fixed top-0 right-0 z-50 flex items-center gap-4 px-6 py-4">
        <Link
          href={withLocale(AUTH_ROUTES.LOGIN, locale)}
          className="text-sm font-medium text-gris-700 hover:text-gris-900 transition-colors"
        >
          {t("cta.login")}
        </Link>
        <div className="w-px h-4 bg-gris-300" />
        <LanguageSwitcher />
      </header>

      {stepper.currentStep === 0 ? (
        <RegisterIntro stepper={stepper} />
      ) : (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-16">
          <div className="w-full max-w-lg px-6 flex flex-col gap-8">
            <Stepper currentStep={stepper.currentStep} />
            <div className="flex flex-col">
              {renderStep()}
            </div>
          </div>
        </div>
      )}

      <footer className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <Link
            href="/contact"
            className="text-xs text-gris-600 hover:text-gris-800 transition-colors flex items-center gap-1"
          >
            <Phone className="w-4 h-4" />
            <span>Contact</span>
          </Link>
          <Link
            href="/faq"
            className="text-xs text-gris-600 hover:text-gris-800 transition-colors"
          >
            FAQ
          </Link>
        </div>
        <p className="text-xs text-gris-900 font-semibold">
          © {new Date().getFullYear()} SuperApp
        </p>
      </footer>

    </FormProvider>
  );
};