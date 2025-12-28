import { ComponentProps, FC } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button.tsx';
import { ThemeDropdown } from '@/components/theme';
import { LocaleDropdown } from '@/components/locale';
import { m } from '@/paraglide/messages';
import { envConfig } from '@/lib/env-config.ts';

interface IHeaderProps extends ComponentProps<'header'> {
}

export const Header: FC<IHeaderProps> = ({ ...props }) => {

  return (
    <header className='h-14 bg-background flex items-center relative' {...props}>
      <div className="flex items-center container mx-auto px-4">
        <Button variant="link-primary" className="-ml-3 text-2xl" asChild>
          <Link to="/">
            {envConfig.appName}
          </Link>
        </Button>

        <nav className='hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2 transform'>
          <Button variant="link" asChild>
            <Link to="/notifications">
              {m['pages.notifications.title']()}
            </Link>
          </Button>

          <Button variant="link" asChild>
            <Link to="/">
              News
            </Link>
          </Button>

          <Button variant="link" asChild>
            <Link to="/">
              Admin
            </Link>
          </Button>
        </nav>

        <div className="flex gap-1 items-center ml-auto -mr-2">
          <LocaleDropdown align="end" variant="ghost"/>
          <ThemeDropdown align="end" variant="ghost" size="icon-sm"/>
        </div>
      </div>
    </header>
  );
};
