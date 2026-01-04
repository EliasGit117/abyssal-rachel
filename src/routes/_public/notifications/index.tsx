import { createFileRoute } from '@tanstack/react-router'
import { awaitIfServer } from '@/lib/await-if-server.ts';
import { getAllNotificationsQueryOptions } from '@/features/notifications/server-functions/get-all.ts';
import { TBreadcrumbData } from '@/components/layout';
import { m } from '@/paraglide/messages';
import { CreateNotificationCard, NotificationListSection } from '@/routes/_public/notifications/-components';


export const Route = createFileRoute('/_public/notifications/')({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    await awaitIfServer(queryClient.prefetchQuery({ ...getAllNotificationsQueryOptions() }));

    const breadcrumbs: TBreadcrumbData = { title: m['pages.notifications.title']() };
    return { breadcrumbs: breadcrumbs };
  }
})

function RouteComponent() {

  return (
    <main className="container mx-auto p-4 space-y-4 min-h-safe-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <NotificationListSection/>
        <CreateNotificationCard/>
      </div>
    </main>
  )
}
