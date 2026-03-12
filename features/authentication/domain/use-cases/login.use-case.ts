import { IAuthRepository } from '../repositories/IAuthRepository';
import { LoginDto, LoginResponseDto } from '../../data/dtos/LoginDto';
import { ApiError } from '@/core/api/types/api-response';

// Types
export interface LoginUseCaseResult {
      success: boolean;
      data?: LoginResponseDto;
      isLocked?: boolean;
      error?: string;
}

// Use Case
export class LoginUseCase {
      constructor(private readonly authRepository: IAuthRepository) {}

      async execute(data: LoginDto): Promise<LoginUseCaseResult> {
            try {
                  const response = await this.authRepository.login(data);
                  return { success: true, data: response };
            } catch (error: unknown) {
                  return this.handleError(error);
            }
      }

      // Gestion d'erreurs
      private handleError(error: unknown): LoginUseCaseResult {
            const apiError = error as Partial<ApiError>;

            switch (apiError.statusCode) {
                  case 401:
                  case 403:
                        return {
                              success: false,
                              error: 'Identifiants incorrects. Veuillez réessayer.',
                        };

                  case 429:
                        return {
                              success: false,
                              isLocked: true,
                              error: 'Trop de tentatives. Votre accès est temporairement bloqué.',
                        };

                  case 503:
                        return {
                              success: false,
                              error:
                                    apiError.message ??
                                    'Impossible de joindre le serveur. Vérifiez votre connexion.',
                        };

                  default:
                        if (apiError.statusCode && apiError.statusCode >= 500) {
                              return {
                                    success: false,
                                    error: 'Une erreur serveur est survenue. Veuillez réessayer.',
                              };
                        }

                        return {
                              success: false,
                              error: apiError.message ?? 'Une erreur inattendue est survenue.',
                        };
            }
      }
}