import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { routeTree } from './routeTree.gen';
import { deLocalizeUrl, localizeUrl } from '@/paraglide/runtime';
import { TBreadcrumbData } from '@/components/layout';
import { QueryClient } from '@tanstack/react-query';


// Create a new router instance
export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 10_000
      }
    }
  });

  const router = createRouter({
    routeTree,
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => localizeUrl(url)
    },
    context: {
      queryClient: queryClient
    },
    defaultPreload: 'intent',
  });

  setupRouterSsrQueryIntegration({ router, queryClient: queryClient });

  return router;
};



declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }

  interface StaticDataRouteOption {
    hideBreadcrumbs?: boolean;
    breadcrumbs?: TBreadcrumbData | TBreadcrumbData[];
    headerOptions?: {
      type?: 'fixed' | 'sticky';
    };

  }
}
