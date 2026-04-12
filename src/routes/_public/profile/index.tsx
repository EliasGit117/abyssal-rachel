import { createFileRoute } from '@tanstack/react-router';
import { IBreadcrumb } from '@/components/layout';
import { m } from '@/paraglide/messages';
import { SessionsCard } from '@/components/auth/sessions-card';


export const Route = createFileRoute('/_public/profile/')({
  component: RouteComponent,
  loader: () => {
    const breadcrumb = { title: m['pages.profile.title']() } satisfies IBreadcrumb;
    return { crumbs: breadcrumb };
  }
});

function RouteComponent() {
  return (
    <main className="container mx-auto p-4 space-y-4 min-h-safe-screen">
      <SessionsCard className="col-span-full lg:col-span-8 xl:col-span-6"/>
    </main>
  );
}
