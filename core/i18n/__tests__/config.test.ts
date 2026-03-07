import { describe, it, expect } from 'vitest';
import { locales, defaultLocale } from '../config';

describe('i18n Configuration', () => {
      it('must support exactly the French and English languages', () => {
            expect(locales).toContain('fr');
            expect(locales).toContain('en');
            expect(locales.length).toBe(2);
      });

      it('must have French as the default language', () => {
            expect(defaultLocale).toBe('fr');
      });
});