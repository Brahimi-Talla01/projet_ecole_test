import { apiClient } from '@/core/api/client';
import { API_ROUTES } from '@/core/config/routes';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { LoginDto, LoginResponseDto, UserDto } from '../dtos/LoginDto';
import { RegisterDto, RegisterResponseDto } from '../dtos/RegisterDto';


// Types internes
interface CheckEmailResponse {
      available: boolean;
}

// Repository
export class AuthRepository implements IAuthRepository {

      // Inscription 
      async register(data: RegisterDto): Promise<RegisterResponseDto> {
            const response = await apiClient.post<RegisterResponseDto>(
                  API_ROUTES.AUTH_REGISTER,
                  data,
            );
            return response.data;
      }

      // Vérification unicité email
      async checkEmailAvailability(email: string): Promise<boolean> {
            const response = await apiClient.get<CheckEmailResponse>(
                  API_ROUTES.AUTH_CHECK_EMAIL,
                  { params: { email } },
            );
            return response.data.available;
      }

      // Connexion 
      async login(data: LoginDto): Promise<LoginResponseDto> {
            const response = await apiClient.post<LoginResponseDto>(
                  API_ROUTES.AUTH_LOGIN,
                  data,
            );
            return response.data;
      }

      //  Déconnexion
      async logout(): Promise<void> {
            await apiClient.post(API_ROUTES.AUTH_LOGOUT);
      }

      // Refresh token
      async refreshToken(): Promise<void> {
            await apiClient.post(API_ROUTES.AUTH_REFRESH);
      }

      // Récupère le profil de l'utilisateur connecté
      async getMe(): Promise<UserDto> {
            const response = await apiClient.get<UserDto>(API_ROUTES.AUTH_ME);
            return response.data;
      }
}

// Instance 
export const authRepository = new AuthRepository();