"use client";

import { useFormContext } from "react-hook-form";
import { RegisterFormData } from "../../../validators/auth.schema";
import Link from "next/link";
import { AUTH_ROUTES, withLocale } from "@/core/config/routes";
import { Locale } from '@/core/i18n/config';
import { useLocale } from "next-intl";
import Image from "next/image";

import bg from '@/public/assets/bg.jpeg';
import google_logo from '@/public/assets/google_logo.webp';

type Props = {
  stepper: any;
};

export const RegisterIntro = ({ stepper }: Props) => {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext<RegisterFormData>();
  const locale = useLocale() as Locale;

  const handleNext = async () => {
    const valid = await trigger("email");

    if (valid) {
      stepper.nextStep();
    }
  };

  return (
    <div className="w-full min-h-screen overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0">

      <div className="flex flex-col gap-6 px-4 md:px-16 xl:px-32 py-16">

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gris-900">
            Rejoignez-nous!
          </h1>

          <p className="text-gris-500">
            Les habitants et les professionnels de votre quartier
            répondent à tous vos besoins.
          </p>
        </div>

        <button
          type="button"
          className="border rounded-full py-3 flex items-center justify-center gap-2 hover:bg-gris-50 cursor-pointer"
        >
          <Image
            src={google_logo}
            alt="Google logo"
            className=" object-cover w-6 h-6"
          />
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gris-200" />
          <span className="text-sm text-gris-400">OR</span>
          <div className="flex-1 h-px bg-gris-200" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gris-600">
            Adresse mail
          </label>

          <input
            {...register("email")}
            type="email"
            required
            placeholder="Enter email address"
            className="border rounded-lg px-4 py-3"
          />

          {errors.email && (
            <p className="text-red-500 text-sm">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          onClick={handleNext}
          className="bg-primary-800 text-white rounded-full py-3 font-semibold cursor-pointer"
        >
          Create an account
        </button>

        <p className="text-center text-gris-600">
          Already have an account?{" "}
          <Link 
            href={withLocale(AUTH_ROUTES.LOGIN, locale)}
            className="text-secondary-600 font-bold"
          >
            Log in
          </Link>
        </p>

      </div>

      {/* Right section */}
      <div className="h-full w-full mx-auto">
          <Image
            src={bg}
            alt="bankground"
            className="object-contain w-full h-full"
          />
      </div>

    </div>
  );
};