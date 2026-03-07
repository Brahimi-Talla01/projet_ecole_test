export const PUBLIC_ROUTES = {
      HOME: '/',
      ABOUT: '/about',
      CONTACT: '/contact',
} as const;


export const AUTH_ROUTES = {
      LOGIN: '/login',
      REGISTER: '/register',
      VERIFY_EMAIL: '/verify-email',
      VERIFY_OTP: '/verify-otp',
      RESET_PASSWORD: '/reset-password',
      FORGOT_PASSWORD: '/forgot-password',
      OAUTH_CALLBACK: '/oauth-callback',
} as const;


export const MAIN_ROUTES = {
      DASHBOARD: '/dashboard',
      PROFILE: '/profile',
      PROFILE_PROVIDER: '/profile/provider',
      SETTINGS: '/settings',
} as const;


export const SERVICE_ROUTES = {
      LIST: '/services',
      DETAILS: (id: string) => `/services/${id}`,
      CREATE: '/services/new',
      EDIT: (id: string) => `/services/${id}/edit`,
      MY_SERVICES: '/services/my-services',
} as const;


export const CONNECTION_ROUTES = {
      LIST: '/connections',
      HISTORY: '/connections/history',
      DETAILS: (id: string) => `/connections/${id}`,
} as const;


export const MESSAGE_ROUTES = {
      LIST: '/messages',
      CONVERSATION: (id: string) => `/messages/${id}`,
} as const;


export const API_ROUTES = {
      // Auth
      AUTH_REGISTER: '/auth/register',
      AUTH_LOGIN: '/auth/login',
      AUTH_LOGOUT: '/auth/logout',
      AUTH_REFRESH: '/auth/refresh',
      AUTH_ME: '/auth/me',
      AUTH_CHECK_EMAIL: '/auth/check-email',
      AUTH_VERIFY_EMAIL: '/auth/verify-email',
      AUTH_VERIFY_OTP: '/auth/verify-otp',
      AUTH_RESET_PASSWORD: '/auth/reset-password',

      // Users
      USERS_PROFILE: '/users/profile',
      USERS_UPDATE: '/users/update',
      USERS_DELETE: '/users/delete',

      // Services
      SERVICES_LIST: '/services',
      SERVICES_DETAILS: (id: string) => `/services/${id}`,
      SERVICES_CREATE: '/services',
      SERVICES_UPDATE: (id: string) => `/services/${id}`,
      SERVICES_DELETE: (id: string) => `/services/${id}`,
      SERVICES_SEARCH: '/services/search',

      // Connections
      CONNECTIONS_LIST: '/connections',
      CONNECTIONS_CREATE: '/connections',
      CONNECTIONS_ACCEPT: (id: string) => `/connections/${id}/accept`,
      CONNECTIONS_REJECT: (id: string) => `/connections/${id}/reject`,

      // Messages
      MESSAGES_LIST: '/messages',
      MESSAGES_SEND: '/messages',
      MESSAGES_CONVERSATION: (id: string) => `/messages/conversations/${id}`,
} as const;


// Construire une URL avec locale
export function withLocale(path: string, locale: 'fr' | 'en' = 'fr'): string {
      return `/${locale}${path}`;
}


export function isPublicRoute(path: string): boolean {
      const publicPaths = [
            ...Object.values(PUBLIC_ROUTES),
            ...Object.values(AUTH_ROUTES),
      ];

      const pathWithoutLocale = path.replace(/^\/(fr|en)/, '');

      return publicPaths.some((route) => pathWithoutLocale.startsWith(route));
}


export function isProtectedRoute(path: string): boolean {
      return !isPublicRoute(path);
}