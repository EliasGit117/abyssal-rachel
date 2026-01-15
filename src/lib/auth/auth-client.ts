import { createAuthClient } from 'better-auth/react';
import { envConfig } from '@/lib/config/env-config.ts';
import { adminClient, inferAdditionalFields, magicLinkClient } from 'better-auth/client/plugins';
import { auth } from '@/lib/auth/auth.ts';
import { accessControl, roles } from '@/lib/auth/permissions.ts';


export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: envConfig.betterAuthBaseUrl,
  fetchOptions: {
    onError: (error) => {
      console.error('Auth client error:', error);
    }
  },
  plugins: [
    adminClient({
      ac: accessControl,
      roles: roles
    }),
    magicLinkClient(),
    inferAdditionalFields<typeof auth>()
  ]
});