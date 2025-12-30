import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router';
import Logo from '@/assets/icons/logo.svg?react';
import { Button } from '@/components/ui/button';
import { ThemeDropdown } from '@/components/theme';
import { LocaleDropdown } from '@/components/locale';
import { Bar, Progress } from '@bprogress/react';


export const Route = createFileRoute('/auth')({
  component: RouteComponent,
  beforeLoad: ({ context: { session } }) => {
    if (!!session)
      throw redirect({ to: '/' });
  }
});

function RouteComponent() {
  return (
    <>
      <div className="grid min-h-svh lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 md:p-10 relative">
          <Progress className="absolute left-0 right-0 top-0 z-40">
            <Bar className="h-0.5 bg-primary"/>
          </Progress>

          <div className="flex justify-center gap-2 md:justify-start h-6 items-center relative">
            <Button
              variant="link"
              size="dense"
              className="absolute lg:block left-1/2 lg:left-auto transform lg:transform-none -translate-x-1/2 lg:translate-x-0"
              asChild
            >
              <Link to="/">
                <Logo className="h-4 md:h-5! w-fit! text-foreground"/>
              </Link>
            </Button>

            <div className="flex gap-1 items-center ml-auto">
              <LocaleDropdown variant="ghost" align="end" mode="icon"/>
              <ThemeDropdown variant="ghost" size="icon-sm" align="end"/>
            </div>
          </div>

          <div className="flex flex-1">
            <Outlet/>
          </div>
        </div>

        <div className="bg-muted relative hidden lg:block">
          <img
            src="https://static-website.imou.com/2aa243f3-817c-477a-91de-35348c2c086c.jpg"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </>
  );
}
