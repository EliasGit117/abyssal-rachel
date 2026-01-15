import { ComponentProps, FC } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Icon } from '@tabler/icons-react';
import { cn } from '@/lib/utils.ts';
import { VariantProps } from 'class-variance-authority';


interface IAdaptiveButtonProps extends Pick<ComponentProps<typeof Button>, 'variant' | 'size' | 'onClick'> {
  text: string;
  tooltipDelay?: number;
  icon?: Icon;
  className?: string;
  disabled?: boolean;
}

export const AdaptiveButton: FC<IAdaptiveButtonProps> = (props) => {
  const { icon: Icon, className, text, size, variant, disabled, onClick } = props;
  const widthClass = widthBySize[size ?? 'default'] ?? 'default';

  return (
    <Button
      size={size}
      title={text}
      aria-label={text}
      variant={variant}
      disabled={disabled}
      onClick={(e) => onClick?.(e)}
      className={cn(widthClass, 'sm:w-fit', className)}
    >
      {Icon && <Icon/>}
      <span className="sr-only sm:not-sr-only">{text}</span>
    </Button>
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