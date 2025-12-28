import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Header } from '@/routes/_public/-components';
import { Bar, Progress } from '@bprogress/react';

export const Route = createFileRoute('/_public')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <>
      <Progress>
        <Bar className="h-0.5 bg-primary fixed top-0 z-20"/>
      </Progress>

      <Header/>
      <Outlet/>
    </>
  );
}
