import {
  HeadContent,
  Scripts,
  createRootRouteWithContext
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import appCss from '../styles.css?url';
import leafletDrawCss from 'leaflet-draw/dist/leaflet.draw.css?url';
import leafletCss from 'leaflet/dist/leaflet.css?url';
import { ReactNode, useEffect } from 'react';
import { getLocale } from '@/paraglide/runtime';
import { envConfig } from '@/lib/env-config.ts';
import { getZodErrorMap } from '@/lib/get-zod-error-map.ts';
import Providers from '@/providers.tsx';
import z from 'zod';


interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
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
