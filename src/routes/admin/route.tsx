import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx';
import { AdminHeader } from '@/routes/admin/-components/header';
import { AdminSidebar } from '@/routes/admin/-components/sidebar';
import { Bar, Progress } from '@bprogress/react';
import { hasRoleAccessToAdmin } from '@/lib/auth/permissions.ts';


export const Route = createFileRoute('/admin')({
  component: RouteComponent,
  beforeLoad: ({ context: { user } }) => {
    if (!hasRoleAccessToAdmin(user?.role))
      throw redirect({ to: '/' });
  },
  staticData: {
    crumbs: { title: 'Admin' }
  }
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <Progress>
        <Bar className="h-0.5 bg-primary fixed top-0 z-50"/>
      </Progress>

      <AdminSidebar/>
      <SidebarInset className="min-w-0">
        <AdminHeader/>
        <Outlet/>
      </SidebarInset>
    </SidebarProvider>
  );
}
