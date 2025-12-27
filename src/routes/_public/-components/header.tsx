import { ComponentProps, FC } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button.tsx';
import { ThemeDropdown } from '@/components/theme';
import { LocaleDropdown } from '@/components/locale';
import { m } from '@/paraglide/messages';
import { envConfig } from '@/lib/env-config.ts';

interface IHeaderProps extends ComponentProps<'header'> {}

export const Header: FC<IHeaderProps> = ({ ...props }) => {

  return (
    <header {...props}>
      <div className="h-14 bg-background flex items-center container mx-auto px-4">
        <Button variant="link" className="-ml-2" asChild>
          <Link to="/">
            {envConfig.appName}
          </Link>
        </Button>

        <Button variant="link" asChild>
          <Link to="/notifications">
            {m['pages.notifications.title']()}
          </Link>
        </Button>

        <div className='flex gap-1 items-center ml-auto -mr-2'>
          <LocaleDropdown align="end" variant="ghost"/>
          <ThemeDropdown align="end" variant="ghost" size="icon-sm"/>
        </div>
      </div>
    </header>
  );
};
