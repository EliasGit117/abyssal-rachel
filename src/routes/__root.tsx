import {
  HeadContent,
  Scripts,
  createRootRouteWithContext
} from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme';
import appCss from '../styles.css?url';
import { ReactNode } from 'react';
import { getLocale } from '@/paraglide/runtime';
import { envConfig } from '@/lib/env-config.ts';
import { Toaster } from '@/components/ui/sonner.tsx';


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
      { rel: 'stylesheet', href: appCss }
    ]
  }),
});

function RootDocument({ children }: { children: ReactNode }) {
  const locale = getLocale();

  return (
    <html lang={locale}>
      <head title={envConfig.appName}>
        <HeadContent/>
      </head>
      <body className="min-h-svh flex flex-col">
        <ThemeProvider defaultTheme="system">
          {children}
          <Toaster richColors/>
        </ThemeProvider>
        <Scripts/>
      </body>
    </html>
  );
}
