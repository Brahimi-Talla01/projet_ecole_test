import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/core/i18n/config';
import { Inter } from 'next/font/google';
import '../globals.css';
import { Metadata } from 'next';
import { QueryProvider } from '@/core/providers/Queryprovider';
import { APP_CONFIG } from '@/core/config/constants';
// import { SessionProvider } from '@/core/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: APP_CONFIG.NAME,
  description: APP_CONFIG.DESCRIPTION,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Chargement des traductions
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
              {children}
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}