import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './core/i18n/routing';

// Configuration
const SUPPORTED_LOCALES = ['fr', 'en'] as const;

const PROTECTED_PATHS = [
  '/dashboard',
  '/profile',
  '/services/new',
  '/connections',
  '/messages',
];

const GUEST_ONLY_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/',
];

// Middleware i18n (next-intl)
const intlMiddleware = createMiddleware(routing);

// Helpers
function getPathWithoutLocale(pathname: string): string {
      const segment = pathname.split('/')[1];
      if ((SUPPORTED_LOCALES as readonly string[]).includes(segment as typeof SUPPORTED_LOCALES[number])) {
            return pathname.slice(segment.length + 1) || '/';
      }
      return pathname;
}

function getLocaleFromPath(pathname: string): string {
      const segment = pathname.split('/')[1];
      return (SUPPORTED_LOCALES as readonly string[]).includes(segment as typeof SUPPORTED_LOCALES[number])
      ? segment
      : 'fr';
}

function isProtectedPath(path: string): boolean {
      return PROTECTED_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

function isGuestOnlyPath(path: string): boolean {
      return GUEST_ONLY_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

function isAuthenticated(request: NextRequest): boolean {
      return request.cookies.has('accessToken');
}

// Middleware principal
export default function middleware(request: NextRequest) {
      const { pathname } = request.nextUrl;
      const pathWithoutLocale = getPathWithoutLocale(pathname);
      const locale = getLocaleFromPath(pathname);
      const authenticated = isAuthenticated(request);

      // Route protégée + non authentifié
      if (isProtectedPath(pathWithoutLocale) && !authenticated) {
            const loginUrl = new URL(`/${locale}/login`, request.url);
            loginUrl.searchParams.set('returnUrl', pathname);
            return NextResponse.redirect(loginUrl);
      }

      //  Route guest-only + déjà connecté
      if (isGuestOnlyPath(pathWithoutLocale) && authenticated) {
            const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
            return NextResponse.redirect(dashboardUrl);
      }

      //  Toutes les autres routes → middleware i18n
      return intlMiddleware(request);
}

export const config = {
      matcher: [
            '/',
            '/(fr|en)/:path*',
            '/((?!api|_next|_vercel|.*\\..*).*)',
      ],
};