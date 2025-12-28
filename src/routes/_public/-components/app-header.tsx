import { ComponentProps, FC, useState, useEffect } from 'react';
import { Link, useMatches } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeDropdown } from '@/components/theme';
import { useBodyScrollPosition } from '@n8tb1t/use-scroll-position';
import { LocaleDropdown } from '@/components/locale';
import HeaderNavMenu from '@/routes/_public/-components/app-nav-menu.tsx';
import { AppSidebarTrigger } from '@/routes/_public/-components/app-sidebar.tsx';
import Logo from '@/assets/icons/logo.svg?react';


interface IAppHeader extends ComponentProps<'header'> {
}

export const AppHeader: FC<IAppHeader> = ({ className, ...props }) => {
  const matches = useMatches();
  const headerOptions = matches.find((match) => match.staticData.headerOptions)?.staticData.headerOptions;
  const { type } = headerOptions ?? { type: 'sticky' };

  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useBodyScrollPosition(({ top }) => {
    if (!mounted) return;
    setIsAtTop(top);
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setIsAtTop(window?.scrollY === 0);

    const timer = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(timer);
  }, [mounted]);

  return (
    <header
      className={cn(
        !mounted && 'sr-only',
        'sticky top-0 flex h-16 shrink-0 items-center gap-2 z-50',
        'bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90',
        'dark:supports-backdrop-filter:bg-background/75 border-b',
        'transition-opacity duration-100 ease-out',
        type === 'fixed' && 'fixed left-0 right-0',
        entered ? 'opacity-150 translate-y-0' : 'opacity-0 -translate-y-4',
        isAtTop && 'bg-transparent! border-b-transparent backdrop-blur-none',
        isAtTop && type === 'fixed' && 'text-white',
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4 flex gap-2 items-center">
        <Button variant="link" size="dense" className="-ml-1" asChild>
          <Link to="/">
            <Logo
              className={cn(
                'h-4 md:h-5! w-fit!',
                isAtTop && type === 'fixed' ? 'text-white' : 'text-foreground'
              )}/>
          </Link>
        </Button>

        <HeaderNavMenu
          transparent={isAtTop}
          className="hidden xl:flex gap-2 xl:gap-8 items-center absolute left-1/2 -translate-x-1/2"
        />

        <div className="flex gap-1 items-center ml-auto -mr-1.5">
          <LocaleDropdown variant="ghost" align="end"/>
          <ThemeDropdown variant="ghost" className="ml-auto" size="icon-sm" align="end"/>
          <AppSidebarTrigger/>
        </div>
      </div>
    </header>
  );
};

