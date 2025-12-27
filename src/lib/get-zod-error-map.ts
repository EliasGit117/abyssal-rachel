import { Locale } from '@/paraglide/runtime';

export async function getZodErrorMap(locale: Locale) {

  switch (locale) {
    case 'ro':
      return (await import('@/lib/zod-ro')).default();
    case 'ru':
      return (await import('zod/locales')).ru();
    default:
      return (await import('@/lib/zod-ro')).default();
  }
}