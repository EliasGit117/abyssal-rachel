import { ComponentProps, FC } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Icon } from '@tabler/icons-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { cn } from '@/lib/utils.ts';
import { VariantProps } from 'class-variance-authority';


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
      <TooltipTrigger
        className={cn(
          'aspect-square sm:aspect-auto w-fit',
          widthBySize[size ?? 'default'],
          className
        )}
        asChild
      >
        <Button size={size} variant={variant}>
          {Icon && <Icon/>}
          <span className="sr-only sm:not-sr-only">{text}</span>
        </Button>
      </TooltipTrigger>

      <TooltipContent className="sm:hidden">
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const widthBySize: Record<NonNullable<VariantProps<typeof Button>['size']>, string> = {
  default: 'w-9',
  xs: 'w-6',
  sm: 'w-8',
  lg: 'w-10',
  icon: 'w-9',
  'icon-xs': 'w-6',
  'icon-sm': 'w-8',
  'icon-lg': 'w-10',
  dense: 'w-fit'
};