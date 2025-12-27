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


interface MyRouterContext {
  queryClient: QueryClient;
}

const appTitle = process.env.VITE_APP_NAME ?? 'Abyssal Rachel';

export const Route = createRootRouteWithContext<MyRouterContext>()({
  shellComponent: RootDocument,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: appTitle }
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
      <head title={appTitle}>
        <HeadContent/>
      </head>
      <body className="min-h-svh flex flex-col">
        <ThemeProvider defaultTheme="system">
          {children}
        </ThemeProvider>
        <Scripts/>
      </body>
    </html>
  );
}
