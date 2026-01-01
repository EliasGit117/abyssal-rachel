import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx';
import { AdminSidebar } from '@/routes/admin/-components/admin-sidebar.tsx';
import { AdminHeader } from '@/routes/admin/-components/admin-header.tsx';

export const Route = createFileRoute('/admin')({
  component: RouteComponent,
  beforeLoad: ({ context: { session } }) => {
    if (!session)
      throw redirect({ to: '/' })
  },
  staticData: {
    breadcrumbs: { title: 'Admin' },
  },
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AdminSidebar/>
      <SidebarInset className="min-w-0">
        <AdminHeader/>
        <Outlet/>
      </SidebarInset>
    </SidebarProvider>
  )
}
