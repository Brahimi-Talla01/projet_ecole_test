"use client";

import { RegisterStepperState } from "@/shared/types/common.types";
import { useRegisterStep4 } from "../../../hooks/register/useRegisterStep4";


interface RegisterStep4Props {
  stepper: RegisterStepperState;
}

export const RegisterStep4 = ({ stepper }: RegisterStep4Props) => {
  const { isSubmitting } = useRegisterStep4(stepper);

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 text-center py-8">
      {isSubmitting ? (
        <>
          <div className="btn-loader w-12 h-12 text-primary-800" />
          <div className="space-y-2 animate-pulse">
            <h2 className="text-xl font-bold text-gris-900">Finalisation de l'inscription</h2>
            <p className="text-gris-500">Un instant, nous créons votre profil sécurisé...</p>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-error-50 text-error-600 rounded-full flex items-center justify-center text-2xl mx-auto">
            !
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gris-900">Une erreur est survenue</h2>
            <p className="text-gris-500">Nous n'avons pas pu valider votre inscription.</p>
          </div>
          <button 
            onClick={() => stepper.goToStep(3)}
            className="text-primary-800 font-bold hover:underline"
          >
            Retourner au mot de passe et réessayer
          </button>
        </div>
      )}
    </div>
  );
};