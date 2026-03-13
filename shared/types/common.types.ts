import { MutableRefObject } from 'react';

export type RegisterStep = 0 | 1 | 2 | 3 | 4;

export interface RegisterDraft {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  country: string;
  currentStep: RegisterStep;
}

export interface RegisterStepperState {
  currentStep: RegisterStep;
  draft: Partial<RegisterDraft>;
  passwordRef: MutableRefObject<string>;

  goToStep: (step: RegisterStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  updateDraft: (data: Partial<RegisterDraft>) => void;
  clearDraft: () => void;
}

export const CITY_OPTIONS = [
  { value: "douala", label: "Douala" },
  { value: "yaounde", label: "Yaoundé" },
  { value: "bafoussam", label: "Bafoussam" },
  { value: "garoua", label: "Garoua" },
  { value: "bamenda", label: "Bamenda" },
];

export const COUNTRY_OPTIONS = [
  { value: "cameroon", label: "Cameroon" },
  { value: "nigeria", label: "Nigeria" },
  { value: "france", label: "France" },
  { value: "senegal", label: "Sénégal" },
  { value: "cote_ivoire", label: "Côte d'Ivoire" },
];