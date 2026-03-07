import { User } from '../../domain/entities/User';
import { UserDto } from '../dtos/LoginDto';
import { AccountStatus, Language, ProfileType } from '../../domain/entities/enums';


// Mapper pour transformer les données API en entités Domain
export class UserMapper {

      // Convertion du DTO API (snake_case) en entité User (camelCase)
      static toDomain(dto: UserDto): User {
            return new User(
                  dto.id,
                  dto.keycloak_id,
                  dto.email,
                  dto.email_verified,
                  dto.account_status as AccountStatus,
                  dto.preferred_lang as Language,
                  dto.profile_type as ProfileType,
                  new Date(dto.created_at),
                  new Date(dto.updated_at),
                  dto.deleted_at ? new Date(dto.deleted_at) : null
            );
      }


      // Convertion de l'entité User en DTO pour l'API
      static toDto(user: User): UserDto {
            return {
                  id: user.id,
                  keycloak_id: user.keycloakId,
                  email: user.email,
                  email_verified: user.emailVerified,
                  account_status: user.accountStatus,
                  preferred_lang: user.preferredLang,
                  profile_type: user.profileType,
                  created_at: user.createdAt.toISOString(),
                  updated_at: user.updatedAt.toISOString(),
                  deleted_at: user.deletedAt ? user.deletedAt.toISOString() : null,
            };
      }
}