import {
  HeadContent,
  Scripts,
  createRootRouteWithContext, useRouter
} from '@tanstack/react-router';
import { QueryClient, useQuery } from '@tanstack/react-query';
import appCss from '../styles.css?url';
import leafletDrawCss from 'leaflet-draw/dist/leaflet.draw.css?url';
import leafletCss from 'leaflet/dist/leaflet.css?url';
import { ReactNode, useEffect, useRef } from 'react';
import { getLocale } from '@/paraglide/runtime';
import { envConfig } from '@/lib/config/env-config.ts';
import { getZodErrorMap } from '@/lib/zod/get-zod-error-map.ts';
import { Providers } from '@/providers.tsx';
import z from 'zod';
import { TSession, TUser } from '@/lib/auth/auth.ts';
import { orpc } from '@/lib/orpc';


interface IRouterContext {
  queryClient: QueryClient;
  session?: TSession | null;
  user?: TUser | null;
}

export const Route = createRootRouteWithContext<IRouterContext>()({
  beforeLoad: async ({ context: { queryClient } }) => {
    const res = await queryClient.ensureQueryData(orpc.sessions.current.queryOptions());
    return { session: res?.session, user: res?.user };
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
  const locale = getLocale();
  const router = useRouter();
  const { data: authRes } = useQuery(orpc.sessions.current.queryOptions());
  const prevSession = useRef<TSession | null>(authRes?.session);

  useEffect(() => {
    if (authRes?.session === prevSession.current)
      return;

    prevSession.current = authRes?.session;
    router.invalidate();
  }, [authRes]);

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
      <body className="flex flex-col">
      {children}
      <Scripts/>
      </body>
      </html>
    </Providers>
  );
}
