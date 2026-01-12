import { createAuthClient } from 'better-auth/react';
import { envConfig } from '@/lib/env-config.ts';
import { adminClient, inferAdditionalFields, magicLinkClient } from 'better-auth/client/plugins';
import { auth } from '@/features/auth/lib/auth.ts';
import { accessControl, roles } from '@/features/auth/lib/permissions.ts';


export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: envConfig.betterAuthBaseUrl,
  plugins: [
    adminClient({
      ac: accessControl,
      roles: roles
    }),
    magicLinkClient(),
    inferAdditionalFields<typeof auth>()
  ]
});