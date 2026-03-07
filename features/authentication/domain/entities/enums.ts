export enum Language {
      FR = 'FR',
      EN = 'EN',
}

export enum AccountStatus {
      PENDING_EMAIL = 'pending_email', 
      ACTIVE = 'active', 
      SUSPENDED = 'suspended', 
      BANNED = 'banned',
}

export enum ProfileType {
      CUSTOMER = 'customer', 
      INDIVIDUAL = 'individual', 
      COMPANY = 'company', 
}

export enum ProviderStatus {
      NONE = 'none', 
      PENDING = 'pending', 
      COMPANY_VERIFIED = 'company_verified', 
      PROVIDER_CERTIFIED = 'provider_certified', 
}