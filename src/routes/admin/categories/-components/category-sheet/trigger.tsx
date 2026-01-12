import { Button } from '@/components/ui/button';
import { ComponentProps, FC } from 'react';
import { useCategorySheet } from './provider';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { CategorySheetOptions } from './provider';
import { Icon, IconFilePlus } from '@tabler/icons-react';

interface Props
  extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  options: CategorySheetOptions;
  text?: string;
  icon?: Icon;
}

export const CategorySheetTrigger: FC<Props> = (props) => {
  const {
    children,
    asChild,
    options,
    text = 'Create',
    icon: Icon = IconFilePlus,
    ...btnProps
  } = props;

  const { open } = useCategorySheet();
  const isMobile = useIsMobile();

  const button = (
    <Button
      {...btnProps}
      asChild={asChild}
      onClick={() => open(options)}
    >
      {(asChild && children) ?? (
        <>
          <Icon/>
          <span className="sr-only sm:not-sr-only">{text}</span>
        </>
      )}
    </Button>
  );

  if (!isMobile) return button;

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  );
};