"use client";

import { FormProvider, useForm } from "react-hook-form";
import { useRegisterStepper } from "../../../hooks/register/useRegisterStepper";
import { RegisterStep1 } from '../RegisterStep1';
import { RegisterStep2 } from '../RegisterStep2';
import { RegisterStep3 } from '../RegisterStep3';
import { RegisterStep4 } from '../RegisterStep4';
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "../../../validators/auth.schema";


export const RegisterForm = () => {
  const stepper = useRegisterStepper();

  const renderStep = () => {
    switch (stepper.currentStep) {
      case 1:
        return <RegisterStep1 stepper={stepper} />;
      case 2:
        return <RegisterStep2 stepper={stepper} />;
      case 3:
        return <RegisterStep3 stepper={stepper} />;
      case 4:
        return <RegisterStep4 stepper={stepper} />;
      default:
        return <RegisterStep1 stepper={stepper} />;
    }
  };

  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange"
  });

  const steps = [
    1, 2, 3, 4
  ]

  return (
    <FormProvider {...methods} >
      <div className="layout-grid min-h-screen items-center py-18">
        <div className="col-span-4 tab:col-start-2 tab:col-span-6 web:col-start-6 web:col-span-6 flex flex-col gap-8">
          
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gris-900">Créer un compte</h1>
            <p className="text-gris-500">Rejoignez la SuperApp en quelques étapes</p>
          </div>

          <div className="flex items-center justify-between relative px-2">
            {steps.map((step) => (
              <div key={step} className="flex flex-col items-center z-10">
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300
                    ${stepper.currentStep >= step 
                      ? 'bg-primary-800 text-white' 
                      : 'bg-gris-100 text-gris-400'}
                  `}
                >
                  {step}
                </div>
              </div>
            ))}

            <div className="absolute top-5 left-0 w-full h-1 bg-gris-100 z-0" />
            <div 
              className="absolute top-5 left-0 h-1 bg-primary-800 transition-all duration-500 z-0" 
              style={{ width: `${((stepper.currentStep - 1) / 3) * 100}%` }}
            />
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gris-100 min-h-100 flex flex-col">
            {renderStep()}
          </div>

          {stepper.currentStep < 4 && (
            <p className="text-center text-gris-600">
              Déjà inscrit ?{' '}
              <a href="/login" className="text-secondary-600 font-bold hover:underline">
                Se connecter
              </a>
            </p>
          )}
        </div>
      </div>
    </FormProvider>
  );
};