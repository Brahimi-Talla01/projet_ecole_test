import { IAuthRepository } from '../repositories/IAuthRepository';
import { LoginDto, LoginResponseDto } from '../../data/dtos/LoginDto';
import { User } from '../entities/User';
import { UserMapper } from '../../data/mappers/user.mapper';

export interface LoginResult {
      user: User;
      message: string;
}

export class LoginUseCase {
      constructor(private authRepository: IAuthRepository) {}

      async execute(email: string, password: string): Promise<LoginResult> {

            // Validation métier
            this.validateCredentials(email, password);

            // Préparer les données
            const data: LoginDto = {
                  email: email.toLowerCase().trim(),
                  password,
            };

            // Appeler le repository
            const response = await this.authRepository.login(data);

            // Mapper l'utilisateur
            const user = UserMapper.toDomain(response.user);

            return {
                  user,
                  message: response.message,
            };
      }


      // Valide les credentials
      private validateCredentials(email: string, password: string): void {
            if (!email || !password) {
                  throw new Error('Email et mot de passe requis');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                  throw new Error('Format d\'email invalide');
            }
      }
}