import { AccountStatus, Language, ProfileType } from './enums';

export class User {
      constructor(
            public readonly id: string, 
            public readonly keycloakId: string, 
            public email: string,
            public emailVerified: boolean,
            public accountStatus: AccountStatus,
            public preferredLang: Language,
            public profileType: ProfileType,
            public readonly createdAt: Date,
            public updatedAt: Date,
            public deletedAt?: Date | null
      ) {}

      isActive(): boolean {
            return this.accountStatus === AccountStatus.ACTIVE;
      }

      isPendingEmailVerification(): boolean {
            return this.accountStatus === AccountStatus.PENDING_EMAIL;
      }

      isSuspended(): boolean {
            return this.accountStatus === AccountStatus.SUSPENDED;
      }

      isBanned(): boolean {
            return this.accountStatus === AccountStatus.BANNED;
      }

      hasVerifiedEmail(): boolean {
            return this.emailVerified;
      }

      isCustomer(): boolean {
            return this.profileType === ProfileType.CUSTOMER;
      }


      isProvider(): boolean {
            return (
                  this.profileType === ProfileType.INDIVIDUAL ||
                  this.profileType === ProfileType.COMPANY
            );
      }


      isIndividualProvider(): boolean {
            return this.profileType === ProfileType.INDIVIDUAL;
      }


      isCompany(): boolean {
            return this.profileType === ProfileType.COMPANY;
      }


      isDeleted(): boolean {
            return this.deletedAt !== null && this.deletedAt !== undefined;
      }


      getPreferredLocale(): 'fr' | 'en' {
            return this.preferredLang.toLowerCase() as 'fr' | 'en';
      }
}