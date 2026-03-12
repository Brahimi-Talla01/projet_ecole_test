"use client";

import { Button } from '@/core/ui/atoms/Button';
import { RegisterStepperState } from '@/shared/types/common.types';
import { useRegisterStep2 } from '../../../hooks/register/useRegisterStep2';

interface RegisterStep2Props {
  stepper: RegisterStepperState;
}

export const RegisterStep2 = ({ stepper }: RegisterStep2Props) => {
  const { formData, handleChange, handleContinue, handleBack } = useRegisterStep2(stepper);

  return (
    <form onSubmit={handleContinue} className="flex flex-col flex-1 gap-6">
      <div className="flex-1 space-y-4">
        
        {/* Prénom & Nom */}
        <div className="grid grid-cols-1 tab:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gris-700">Prénom</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Ex: Toto"
              className="w-full p-3 rounded-lg border border-gris-200 focus:border-primary-500 focus:outline-none transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gris-700">Nom</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Ex: Tata"
              className="w-full p-3 rounded-lg border border-gris-200 focus:border-primary-500 focus:outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Téléphone */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gris-700">Numéro de téléphone</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+237 6xx xxx xxx"
            className="w-full p-3 rounded-lg border border-gris-200 focus:border-primary-500 focus:outline-none transition-all"
            required
          />
        </div>

        {/* Ville & Pays */}
        <div className="grid grid-cols-1 tab:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gris-700">Ville</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ex: Douala"
              className="w-full p-3 rounded-lg border border-gris-200 focus:border-primary-500 focus:outline-none transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gris-700">Pays</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Ex: Cameroun"
              className="w-full p-3 rounded-lg border border-gris-200 focus:border-primary-500 focus:outline-none transition-all"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Button type="submit" fullWidth>
          Continuer
        </Button>
        <button
          type="button"
          onClick={handleBack}
          className="text-gris-500 text-sm font-medium hover:text-gris-800 transition-colors py-2 cursor-pointer"
        >
          Retour à l'étape précédente
        </button>
      </div>
    </form>
  );
};