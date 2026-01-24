import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AppHeader, AppSidebar, AppSidebarProvider, AppFooter } from '@/routes/_public/-components';
import { BreadcrumbsNavigation } from '@/components/layout';

export const Route = createFileRoute('/_public')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <AppSidebarProvider>
      <div className='flex flex-col min-h-screen'>
        <AppHeader/>
        <AppSidebar/>
        <BreadcrumbsNavigation className="container mx-auto px-2.5 sm:px-2"/>

        <Outlet/>
        <AppFooter className="mt-auto"/>
      </div>
    </AppSidebarProvider>
  );
}
