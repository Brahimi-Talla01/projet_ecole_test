import { AccountStatus, Language, ProfileType } from '../../domain/entities/enums';

export interface LoginDto {
      email: string;
      password: string;
}

export interface LoginResponseDto {
      user: UserDto;
      message: string;
}

// DTO User reçu de l'API
export interface UserDto {
      id: string;
      // keycloak_id: string;
      email: string;
      email_verified: boolean;
      account_status: AccountStatus;
      preferred_lang: Language;
      profile_type: ProfileType;
      created_at: string;
      updated_at: string;
      deleted_at?: string | null;
}