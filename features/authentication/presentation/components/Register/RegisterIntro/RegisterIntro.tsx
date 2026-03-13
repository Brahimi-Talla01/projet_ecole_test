"use client";

import { useFormContext } from "react-hook-form";
import { RegisterFormData } from "../../../validators/auth.schema";
import Link from "next/link";
import { AUTH_ROUTES, withLocale } from "@/core/config/routes";
import { Locale } from "@/core/i18n/config";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

import background from "@/public/assets/background.svg";
import google_logo from "@/public/assets/google_logo.webp";
import { useRegisterStep1 } from "../../../hooks/register/useRegisterStep1";
import { Input } from "@/core/ui/atoms/Input";
import { Button } from "@/core/ui/atoms/Button";
import { RegisterStepperState } from "@/shared/types/common.types";


type Props = {
  stepper: RegisterStepperState;
};

export const RegisterIntro = ({ stepper }: Props) => {
  const {
    register,
    formState: { errors }
  } = useFormContext<RegisterFormData>();

  const t = useTranslations("authentication.register");
  const locale = useLocale() as Locale;

  const { handleNext } = useRegisterStep1({
    onNext: stepper.nextStep,
    stepper, 
  });

  return (
    <div className="w-full min-h-screen overflow-hidden grid grid-cols-1 md:grid-cols-2">

      <div className="flex items-center justify-center px-6 py-12">
        <div className="flex flex-col gap-6 w-full max-w-md">

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gris-900">
              {t("subtitle")}
            </h1>
            <p className="text-sm text-gris-500 leading-relaxed">
              {t("description")}
            </p>
          </div>

          <button
            type="button"
            className="w-full border border-gris-200 rounded-full py-3 flex items-center justify-center gap-3 text-gris-800 font-medium hover:bg-gris-50 transition-colors duration-150 cursor-pointer"
          >
            <Image
              src={google_logo}
              alt="Google"
              className="w-5 h-5 object-contain"
            />
            {t("cta.googleLogin")}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gris-200" />
            <span className="text-xs text-gris-400 font-medium tracking-widest">
              {t("or")}
            </span>
            <div className="flex-1 h-px bg-gris-200" />
          </div>

          <p className="text-sm text-center text-gris-600">
            {t("emailPrompt")}
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gris-800">
              {t("fields.email")}
            </label>

            <Input
              {...register("email")}
              type="email"
              placeholder={t("placeholders.email")}
              autoComplete="email"
              className={[
                "w-full",
                errors.email
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gris-200",
              ].join(" ")}
            />

            {errors.email && (
              <p role="alert" className="text-xs font-medium text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="button"
            onClick={handleNext}
            variant="primary"
          >
            {t("cta.createAccount")}
          </Button>

          <p className="text-center text-sm text-gris-600">
            {t("alreadyAccount")}{" "}
            <Link
              href={withLocale(AUTH_ROUTES.LOGIN, locale)}
              className="text-secondary-600 font-bold hover:underline"
            >
              {t("cta.login")}
            </Link>
          </p>

        </div>
      </div>

      <div className="hidden md:block relative h-screen">
        <Image
          src={background}
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

    </div>
  );
};