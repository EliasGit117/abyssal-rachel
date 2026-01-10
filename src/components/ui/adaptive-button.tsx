import { ComponentProps, FC } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { useIsMobile } from '@/hooks/use-mobile.ts';
import { Icon, IconRefresh } from '@tabler/icons-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { cn } from '@/lib/utils.ts';



interface IAdaptiveButtonProps extends ComponentProps<typeof Button> {
  text: string;
  tooltipDelay?: number;
  icon?: Icon;
}

export const AdaptiveButton: FC<IAdaptiveButtonProps> = ({ className, text, tooltipDelay = 500, ...btnProps }) => {
  const isMobile = useIsMobile();

  const refreshButton = (
    <Button className={cn(isMobile && 'aspect-square w-fit', className)} {...btnProps}>
      <IconRefresh />
      {!isMobile && <span>{text}</span>}
    </Button>
  );

  return (
    <>
      <div className="flex-1" />

      {isMobile ? (
        <Tooltip delayDuration={tooltipDelay}>
          <TooltipTrigger asChild>{refreshButton}</TooltipTrigger>
          <TooltipContent>
            <p>Refresh</p>
          </TooltipContent>
        </Tooltip>
      ) : (refreshButton)}
    </>
  );
};
