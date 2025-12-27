import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Header } from '@/routes/_public/-components';

export const Route = createFileRoute('/_public')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <>
      <Header/>
      <Outlet/>
    </>
  );
}
