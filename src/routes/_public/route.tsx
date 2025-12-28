import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Bar, Progress } from '@bprogress/react';
import { BreadcrumbsNavigation } from '@/components/layout';
import { AppHeader, AppSidebar, AppSidebarProvider, AppFooter } from '@/routes/_public/-components';

export const Route = createFileRoute('/_public')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <AppSidebarProvider>
      <Progress>
        <Bar className="h-0.5 bg-primary fixed top-0 z-50"/>
      </Progress>

      <AppHeader/>
      <AppSidebar/>
      <BreadcrumbsNavigation className='container mx-auto px-2'/>

      <Outlet/>
      <AppFooter className='mt-auto'/>
    </AppSidebarProvider>
  );
}
