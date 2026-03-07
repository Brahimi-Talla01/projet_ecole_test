import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from './config';

const features = [
    'authentication',
    'profile',
    'services',
    'connections',
    'messaging',
] as const;

export async function loadMessages(locale: Locale) {
  const globalMessages = (await import(`./locales/${locale}.json`)).default;

  const featureMessages = await Promise.all(
    features.map(async (feature) => {
      try {

        const messages = (
          await import(`@/features/${feature}/locales/${locale}.json`)
        ).default;

        return { [feature]: messages };

      } catch (error) {
        
        console.warn(`Missing translations for feature: ${feature}`);
        return {};
      }
    })
  );

  return featureMessages.reduce(
    (acc, messages) => ({ ...acc, ...messages }),
    globalMessages
  );
}

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await loadMessages(locale as Locale);

  return {
    locale, 
    messages,
    timeZone: 'UTC'
  };
});