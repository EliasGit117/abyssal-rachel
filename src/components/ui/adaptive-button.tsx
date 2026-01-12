import { ComponentProps, FC } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { useIsMobile } from '@/hooks/use-mobile.ts';
import { Icon } from '@tabler/icons-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { cn } from '@/lib/utils.ts';


interface IAdaptiveButtonProps extends ComponentProps<typeof Button> {
  text: string;
  tooltipDelay?: number;
  icon?: Icon;
}

export const AdaptiveButton: FC<IAdaptiveButtonProps> = (props) => {
  const { icon: Icon, className, text, tooltipDelay = 500, ...btnProps } = props;
  const isMobile = useIsMobile();

  return (
    <Tooltip delayDuration={tooltipDelay}>
      <TooltipTrigger asChild>
        <Button className={cn(isMobile && 'aspect-square w-fit', className)} {...btnProps}>
          {Icon && <Icon/>}
          {!isMobile && <span>{text}</span>}
        </Button>
      </TooltipTrigger>

      {isMobile && (
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
};
