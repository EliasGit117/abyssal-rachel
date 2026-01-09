import { createFileRoute } from '@tanstack/react-router'
import { BannerTable } from '@/routes/admin/banners/-components/banners-table';

export const Route = createFileRoute('/admin/banners/')({
  component: RouteComponent,
})

function RouteComponent() {
  'use no memo';

  return (
    <main className="container mx-auto p-4 space-y-4 flex flex-col flex-1">
      <BannerTable/>
    </main>
  );
}
