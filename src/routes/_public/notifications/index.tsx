import { createFileRoute } from '@tanstack/react-router';
import { awaitIfServer } from '@/lib/server/await-if-server.ts';
import { TBreadcrumbData } from '@/components/layout';
import { m } from '@/paraglide/messages';
import { CreateNotificationCard, NotificationListSection } from '@/routes/_public/notifications/-components';
import { Permission } from '@/lib/auth/permissions.ts';
import { useHasPermissions } from '@/hooks/use-has-permission.ts';
import { cn } from '@/lib/utils';
import { orpc } from '@/lib/orpc/client.ts';



export const Route = createFileRoute('/_public/notifications/')({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    await awaitIfServer(queryClient.prefetchQuery(orpc.notifications.list.queryOptions(),));

    const breadcrumbs: TBreadcrumbData = { title: m['pages.notifications.title']() };
    return { breadcrumbs: breadcrumbs };
  }
});

function RouteComponent() {
  const { canCreate } = useHasPermissions({ canCreate: { notification: [Permission.Create] } });

  return (
    <main className="container mx-auto p-4 space-y-4 min-h-safe-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <NotificationListSection className={cn(!canCreate && 'col-span-full')}/>
        {canCreate && <CreateNotificationCard/>}
      </div>
    </main>
  );
}
