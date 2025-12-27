import { ComponentProps, FC } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button.tsx';
import { ThemeDropdown } from '@/components/theme';
import { LocaleDropdown } from '@/components/locale';
import { envConfig } from '@/lib/env-config.ts';

interface IHeaderProps extends ComponentProps<'header'> {}

export const Header: FC<IHeaderProps> = ({ ...props }) => {

  return (
    <header {...props}>
      <div className="h-14 bg-background flex items-center container mx-auto px-4">
        <Button variant="link" className="-ml-3" asChild>
          <Link to="/">
            {envConfig.appName}
          </Link>
        </Button>

        <Button variant="link" asChild>
          <Link to="/notifications">
            Notifications
          </Link>
        </Button>

        <div className='flex gap-1 items-center ml-auto -mr-3'>
          <LocaleDropdown align="end" variant="ghost"/>
          <ThemeDropdown align="end" variant="ghost" size="icon-sm"/>
        </div>
      </div>
    </header>
  );
};
