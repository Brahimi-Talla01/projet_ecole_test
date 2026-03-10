export const APP_CONFIG = {
  NAME: 'SuperApp',
  VERSION: '1.0.0',
  DESCRIPTION: 'Plateforme de mise en relation service-provider',
} as const;


export const API_CONFIG = {
  TIMEOUT: 10000, 
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, 
} as const;


export const TOKEN_CONFIG = {
  ACCESS_TOKEN_COOKIE_NAME: 'accessToken',
  REFRESH_TOKEN_COOKIE_NAME: 'refreshToken',
  TOKEN_EXPIRY_BUFFER: 300, 
} as const;


export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  FIRST_PAGE: 1,
} as const;


export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 10,
  ACCEPTED_IMAGE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ],
  ACCEPTED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
} as const;


export const VALIDATION_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_MAX_LENGTH: 255,
  OTP_LENGTH: 6,
  OTP_EXPIRY: 300, 
} as const;


export const CACHE_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, 
  CACHE_TIME: 10 * 60 * 1000, 
  RETRY: 2,
} as const;


export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;


export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion réseau',
  UNAUTHORIZED: 'Session expirée, veuillez vous reconnecter',
  FORBIDDEN: 'Accès refusé',
  NOT_FOUND: 'Ressource non trouvée',
  SERVER_ERROR: 'Erreur serveur, veuillez réessayer plus tard',
  VALIDATION_ERROR: 'Données invalides',
  UNKNOWN_ERROR: 'Une erreur inattendue est survenue',
} as const;

export const BRUTE_FORCE_CONFIG = {
      MAX_ATTEMPTS: 5,
      LOCKOUT_DURATION_MS: 15 * 60 * 1000,
} as const;