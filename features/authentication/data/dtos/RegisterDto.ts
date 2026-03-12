import { Language, ProfileType } from "../../domain/entities/enums";

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileType: ProfileType; 
  preferredLang?: Language;
}

export interface RegisterResponseDto {
      message: string;
      userId: string;
      // keycloakId: string;
}