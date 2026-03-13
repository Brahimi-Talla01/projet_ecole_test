"use client";

import { FormProvider, useForm } from "react-hook-form";
import { useRegisterStepper } from "../../../hooks/register/useRegisterStepper";

import { RegisterIntro } from "../RegisterIntro";
import { RegisterStep1 } from "../RegisterStep1";
import { RegisterStep2 } from "../RegisterStep2";
import { RegisterStep3 } from "../RegisterStep3";
import { RegisterStep4 } from "../RegisterStep4";

import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "../../../validators/auth.schema";

export const RegisterForm = () => {
  const stepper = useRegisterStepper();

  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange"
  });

  const renderStep = () => {
    switch (stepper.currentStep) {
      case 0:
        return <RegisterIntro stepper={stepper} />;
      case 1:
        return <RegisterStep1 stepper={stepper} />;
      case 2:
        return <RegisterStep2 stepper={stepper} />;
      case 3:
        return <RegisterStep3 stepper={stepper} />;
      case 4:
        return <RegisterStep4 stepper={stepper} />;
      default:
        return <RegisterIntro stepper={stepper} />;
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="layout-grid min-h-screen items-center">
        <div className="col-span-4 tab:col-start-2 tab:col-span-6 web:col-start-6 web:col-span-6 flex flex-col gap-8">

          {/* Stepper visible seulement à partir du step 1 */}
          {stepper.currentStep >= 1 && (
            <Stepper currentStep={stepper.currentStep} />
          )}

          <div className="overflow-hidden flex flex-col">
            {renderStep()}
          </div>

        </div>
      </div>
    </FormProvider>
  );
};

type Props = {
  currentStep: number;
};

const steps = [0, 1, 2, 3, 4];

export const Stepper = ({ currentStep }: Props) => {
  return (
    <div className="flex items-center justify-between relative px-2">

      {steps.map((step) => (
        <div key={step} className="flex flex-col items-center z-10">
          <div
            className={`
              w-10 h-10 rounded-full flex items-center justify-center font-bold
              transition-colors duration-300
              ${currentStep >= step
                ? "bg-primary-800 text-white"
                : "bg-gris-100 text-gris-400"}
            `}
          >
            {step}
          </div>
        </div>
      ))}

      <div className="absolute top-5 left-0 w-full h-1 bg-gris-100 z-0" />

      <div
        className="absolute top-5 left-0 h-1 bg-primary-800 transition-all duration-500 z-0"
        style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
      />
    </div>
  );
};

