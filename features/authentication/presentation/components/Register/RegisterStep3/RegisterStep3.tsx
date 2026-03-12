"use client";

import { Button } from '@/core/ui/atoms/Button';
import { RegisterStepperState } from '@/shared/types/common.types';
import { useRegisterStep3 } from '../../../hooks/register/useRegisterStep3';

interface RegisterStep3Props {
  stepper: RegisterStepperState;
}

export const RegisterStep3 = ({ stepper }: RegisterStep3Props) => {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    handleContinue,
    handleBack
  } = useRegisterStep3(stepper);

  return (
    <form onSubmit={handleContinue} className="flex flex-col flex-1 gap-6">
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gris-700">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full p-3 rounded-lg border border-gris-200 focus:border-primary-500 focus:outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gris-700">Confirmer le mot de passe</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className={`w-full p-3 rounded-lg border ${
              error ? 'border-error-500' : 'border-gris-200'
            } focus:outline-none focus:border-primary-500`}
            required
          />
        </div>

        {error && (
          <p className="text-error-600 text-sm font-medium bg-error-50 p-3 rounded-md">
            {error}
          </p>
        )}
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
          Retour
        </button>
      </div>
    </form>
  );
};