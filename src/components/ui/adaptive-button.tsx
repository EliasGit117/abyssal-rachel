import { ComponentProps, FC } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Icon } from '@tabler/icons-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { cn } from '@/lib/utils.ts';


interface IAdaptiveButtonProps extends Pick<ComponentProps<typeof Button>, 'variant' | 'size' | 'onClick'> {
  text: string;
  tooltipDelay?: number;
  icon?: Icon;
  className?: string;
}

export const AdaptiveButton: FC<IAdaptiveButtonProps> = (props) => {
  const { icon: Icon, className, text, tooltipDelay = 500, size, variant } = props;
  return (
    <Tooltip delayDuration={tooltipDelay}>
      <TooltipTrigger className={cn('aspect-square sm:aspect-auto w-fit', className)} asChild>
        <Button size={size} variant={variant}>
          {Icon && <Icon/>}
          <span className='sr-only sm:not-sr-only'>{text}</span>
        </Button>
      </TooltipTrigger>

      <TooltipContent className="sm:hidden">
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
};
