import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx';
import { AdminHeader } from '@/routes/admin/-components/header';
import { AdminSidebar } from '@/routes/admin/-components/sidebar';
import { Bar, Progress } from '@bprogress/react';
import { hasRoleAccessToAdmin } from '@/features/auth/lib/permissions.ts';


export const Route = createFileRoute('/admin')({
  component: RouteComponent,
  beforeLoad: ({ context: { user } }) => {
    if (!hasRoleAccessToAdmin(user?.role))
      throw redirect({ to: '/' });
  },
  staticData: {
    breadcrumbs: { title: 'Admin' }
  }
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <AdminSidebar/>
      <SidebarInset className="min-w-0">
        <Progress>
          <Bar className="h-0.5 bg-primary fixed top-0 z-50"/>
        </Progress>

        <AdminHeader/>
        <Outlet/>
      </SidebarInset>
    </SidebarProvider>
  );
}
