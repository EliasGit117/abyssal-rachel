import { createAuthClient } from 'better-auth/react';
import { envConfig } from '@/lib/env-config.ts';


export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: envConfig.betterAuthBaseUrl,
});