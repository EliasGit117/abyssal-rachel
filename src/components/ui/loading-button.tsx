import * as React from 'react';
import { Button } from './button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages';


interface IProps extends React.ComponentProps<typeof Button> {
  loading?: boolean;
  hideText?: boolean;
  hideTextOnMobile?: boolean;
  loadingText?: string;
}

function LoadingButton(props: IProps) {
  const { loading, hideText, children, disabled, hideTextOnMobile, loadingText, ...restOfProps } = props;

  if (loading)
    return (
      <Button {...restOfProps} asChild={false} disabled={disabled ?? true}>
        <Spinner/>
        {!hideText && (
          <span className={cn(hideTextOnMobile && 'hidden sm:block')}>
            {loadingText ?? m['common.loading']()}
          </span>
        )}
      </Button>
    );

  return (
    <Button{...restOfProps} disabled={disabled}>
      {children}
    </Button>
  );
}

export { LoadingButton };
