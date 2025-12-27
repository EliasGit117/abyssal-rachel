import { ComponentProps, FC } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button.tsx';
import { ThemeDropdown } from '@/components/theme';

interface IHeaderProps extends ComponentProps<'header'> {
}

export const Header: FC<IHeaderProps> = ({ ...props }) => {

  return (
    <header {...props}>
      <div className="h-14 bg-background flex items-center container mx-auto px-4">
        <Button variant='link' className='-ml-3' asChild>
          <Link to="/">
            Home
          </Link>
        </Button>

        <ThemeDropdown className='ml-auto -mr-3' align='end' variant='ghost' size='icon-sm'/>
      </div>
    </header>
  );
};
