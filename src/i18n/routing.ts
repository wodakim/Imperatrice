import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en', 'de', 'es', 'it', 'pl'],
  defaultLocale: 'fr'
});
