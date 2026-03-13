import { Language } from "../../domain/entities/enums";

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  country: string;
  preferredLang: Language;
  acceptTerms: true;
}

export interface RegisterResponseDto {
  success: boolean;
  message: string;
  data?: {
    userId?: string;
  };
}