import * as TanstackQuery from './integrations/tanstack-query/root-provider';
import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { routeTree } from './routeTree.gen';
import { deLocalizeUrl, localizeUrl } from '@/paraglide/runtime';
import { TBreadcrumbData } from '@/components/layout';


// Create a new router instance
export const getRouter = () => {
  const rqContext = TanstackQuery.getContext();

  const router = createRouter({
    routeTree,
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => localizeUrl(url)
    },
    context: {
      ...rqContext
    },

    defaultPreload: 'intent'
  });

  setupRouterSsrQueryIntegration({ router, queryClient: rqContext.queryClient });

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
