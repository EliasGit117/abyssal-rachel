import {
  HeadContent,
  Scripts,
  createRootRouteWithContext, useRouter
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import appCss from '../styles.css?url';
import leafletDrawCss from 'leaflet-draw/dist/leaflet.draw.css?url';
import leafletCss from 'leaflet/dist/leaflet.css?url';
import { ReactNode, useEffect, useRef } from 'react';
import { getLocale } from '@/paraglide/runtime';
import { envConfig } from '@/lib/env-config.ts';
import { getZodErrorMap } from '@/lib/get-zod-error-map.ts';
import Providers from '@/providers.tsx';
import z from 'zod';
import { getSessionQueryOptions } from '@/features/auth/server-functions/get-session.ts';
import { useSession } from '@/hooks/use-session.ts';
import { Session } from '@better-auth/core/db';


interface IRouterContext {
  queryClient: QueryClient;
  session?: Session;
}

export const Route = createRootRouteWithContext<IRouterContext>()({
  beforeLoad: async ({ context: { queryClient } }) => {
    const session = await queryClient.ensureQueryData(getSessionQueryOptions());
    return { session };
  },
  shellComponent: RootDocument,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: envConfig.appName }
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'stylesheet', href: leafletDrawCss },
      { rel: 'stylesheet', href: leafletCss }
    ]
  })
});

function RootDocument({ children }: { children: ReactNode }) {
  const router = useRouter();
  const locale = getLocale();
  const session = useSession();
  const prevSession = useRef(session);

  useEffect(() => {
    if (prevSession.current === session)
      return;

    router.invalidate();
    prevSession.current = session;
  }, [session]);

  useEffect(() => {
    getZodErrorMap(locale)
      .then((res) => z.config(res));
  }, []);

  return (
    <Providers>
      <html lang={locale} suppressHydrationWarning>
        <head>
          <title/>
          <HeadContent/>
        </head>
        <body className="min-h-svh flex flex-col">
          {children}
          <Scripts/>
        </body>
      </html>
    </Providers>
  );
}
