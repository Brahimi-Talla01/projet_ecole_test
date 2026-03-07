import { IAuthRepository } from '../repositories/IAuthRepository';
import { RegisterDto, RegisterResponseDto } from '../../data/dtos/RegisterDto';
import { ApiError } from '@/core/api/types/api-response';

// Types
export interface RegisterUseCaseResult {
      success: boolean;
      data?: RegisterResponseDto;
      emailConflict?: boolean;
      error?: string;
}

// Use Case
export class RegisterUseCase {
      constructor(private readonly authRepository: IAuthRepository) {}

      async execute(data: RegisterDto): Promise<RegisterUseCaseResult> {
            try {
                  const response = await this.authRepository.register(data);
                  return { success: true, data: response };
            } catch (error: unknown) {
                  return this.handleError(error);
            }
      }

      // Gestion d'erreurs
      private handleError(error: unknown): RegisterUseCaseResult {
            const apiError = error as Partial<ApiError>;

            switch (apiError.statusCode) {
                  case 409:
                        return {
                              success: false,
                              emailConflict: true,
                              error: 'Cette adresse email est déjà associée à un compte.',
                        };

                  case 422:
                        return {
                              success: false,
                              error: 'Les données soumises sont invalides.',
                        };

                  case 503:
                        // Erreur réseau normalisée par error.interceptor
                        return {
                              success: false,
                              error:
                                    apiError.message ??
                                    'Impossible de joindre le serveur. Vérifiez votre connexion.',
                        };

                  default:
                        // Erreurs 5xx et cas non anticipés
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