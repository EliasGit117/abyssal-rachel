import { ComponentProps, FC } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button.tsx';

interface IHeaderProps extends ComponentProps<'header'> {
}

export const Header: FC<IHeaderProps> = ({ ...props }) => {

  return (
    <header {...props}>
      <div className="h-10 bg-background flex items-center container mx-auto px-4">
        <Button>
          <Link to="/">
            Home
          </Link>
        </Button>
      </div>
    </header>
  );
};
