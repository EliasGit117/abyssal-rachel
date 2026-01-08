import { createFileRoute } from '@tanstack/react-router';
import { TBreadcrumbData } from '@/components/layout';
import { m } from '@/paraglide/messages';
import { EditNameCard, ResetPasswordCard, SessionsCard } from '@/components/auth';


export const Route = createFileRoute('/_public/profile/')({
  component: RouteComponent,
  loader: () => {
    const breadcrumb: TBreadcrumbData = { title: m['pages.profile.title']() };
    return { breadcrumbs: breadcrumb };
  }
});

function RouteComponent() {
  return (
    <main className="container mx-auto p-4 space-y-4 min-h-safe-screen">
      <div className="grid grid-cols-12 gap-4">
        <EditNameCard className='max-w-none h-fit col-span-full md:col-span-6 xl:col-span-3'/>
        <ResetPasswordCard className="max-w-none h-fit col-span-full md:col-span-6 xl:col-span-3" />
        <SessionsCard className='col-span-full lg:col-span-8 xl:col-span-6'/>
      </div>
    </main>
  );
}
