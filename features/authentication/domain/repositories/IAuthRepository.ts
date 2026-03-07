import { RegisterDto, RegisterResponseDto } from '../../data/dtos/RegisterDto';
import { LoginDto, LoginResponseDto } from '../../data/dtos/LoginDto';

export interface IAuthRepository {

      register(data: RegisterDto): Promise<RegisterResponseDto>;

      login(data: LoginDto): Promise<LoginResponseDto>;

      checkEmailAvailability(email: string): Promise<boolean>;

      logout(): Promise<void>;

      refreshToken(): Promise<void>;

}