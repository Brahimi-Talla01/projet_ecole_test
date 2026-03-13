"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/core/ui/atoms/Button";
import { Input } from "@/core/ui/atoms/Input";
import { CITY_OPTIONS, COUNTRY_OPTIONS, RegisterStepperState } from "@/shared/types/common.types";
import { useRegisterStep2 } from "../../../hooks/register/useRegisterStep2";
import { useTranslations } from "next-intl";
import { SelectField } from "@/core/ui/molecules/SelectField";

interface RegisterStep2Props {
  stepper: RegisterStepperState;
}

export const RegisterStep2 = ({ stepper }: RegisterStep2Props) => {
  const t = useTranslations("authentication.register");
  const tValid = useTranslations("authentication.validation");
  const {
    formData,
    errors,
    handleChange,
    handleSelectChange,
    handleContinue,
    handleBack,
  } = useRegisterStep2(stepper);

  return (
    <div className="flex flex-col gap-6">

      <button
        type="button"
        onClick={handleBack}
        className="flex items-center gap-2 text-gris-500 hover:text-gris-800 transition-colors w-fit cursor-pointer"
        aria-label="Retour"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">{t("cta.back")}</span>
      </button>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gris-900">
          Basic information
        </h2>
      </div>

      <form onSubmit={handleContinue} className="flex flex-col gap-5">

        <Input
          label={t("fields.firstName")}
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          placeholder={t("placeholders.firstName")}
          error={errors.firstName}
        />

        <Input
          label={t("fields.lastName")}
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
          placeholder={t("placeholders.lastName")}
          error={errors.lastName}
        />

        <Input
          label={t("fields.phoneNumber")}
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder={t("placeholders.phoneNumber")}
          error={errors.phoneNumber}
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectField
            label={t("fields.city")}
            options={CITY_OPTIONS}
            value={formData.city}
            onChange={(val) => handleSelectChange("city", val)}
            placeholder="Select"
            error={errors.city}
          />
          <SelectField
            label={t("fields.country")}
            options={COUNTRY_OPTIONS}
            value={formData.country}
            onChange={(val) => handleSelectChange("country", val)}
            placeholder="Select"
            error={errors.country}
          />
        </div>

        <Button type="submit" fullWidth className="mt-2">
          {t("cta.continue")}
        </Button>

      </form>
    </div>
  );
};