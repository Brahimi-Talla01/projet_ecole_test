import { Language } from "@/features/authentication/domain/entities/enums";

export type RegisterStep = 1 | 2 | 3 | 4;

export interface RegisterDraft {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  country: string;
  currentStep: RegisterStep;
  preferredLang: Language;
}

export interface RegisterStepperState {
  currentStep: RegisterStep;
  draft: Partial<RegisterDraft>;
  passwordRef: React.MutableRefObject<string>;
  goToStep: (step: RegisterStep) => void;
  updateDraft: (data: Partial<RegisterDraft>) => void;
  clearDraft: () => void;
}