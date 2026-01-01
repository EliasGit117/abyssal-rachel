import { ComponentProps, useEffect, useRef } from 'react';
import * as React from 'react';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger, } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { BreadcrumbsNavigation } from '@/components/layout';


interface IAdminHeaderProps extends ComponentProps<'header'> {
}

export const AdminHeader: React.FC<IAdminHeaderProps> = ({ className, ...props }) => {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateTopState = () => {
      if (!headerRef.current) return;
      const isScrolled = window.scrollY > 0;
      headerRef.current.setAttribute('data-scrolled', isScrolled ? 'true' : 'false');
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(updateTopState);
      ticking = true;
    };

    updateTopState();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      data-scrolled="false"
      className={cn(
        'sticky top-0 data-[scrolled=true]:border-b z-20',
        'bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90',
        'dark:supports-backdrop-filter:bg-background/75',
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4 sm:py-0 flex gap-2 items-center h-12">
        <SidebarTrigger className="-ml-1"/>
        <Separator orientation="vertical" className="h-4 my-auto"/>
        <BreadcrumbsNavigation/>
      </div>
    </header>
  );
};


