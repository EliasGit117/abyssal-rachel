import { paraglideMiddleware } from './paraglide/server.js';
import handler from '@tanstack/react-start/server-entry';
import { getLocale } from '@/paraglide/runtime';
import z from 'zod';
import { getZodErrorMap } from '@/lib/get-zod-error-map.ts';

export default {
  async fetch(req: Request): Promise<Response> {
    return paraglideMiddleware(req, async () => {
      const locale = getLocale();
      const errorMap = await getZodErrorMap(locale);
      z.config(errorMap);

      return handler.fetch(req);
    });
  },
};