import { Button } from '@/components/ui/button';
import { ComponentProps, FC } from 'react';
import { IconFilePlus } from '@tabler/icons-react';
import { useCreateCategorySheet } from './provider.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx';
import { useIsMobile } from '@/hooks/use-mobile.ts';


interface IProps extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  text?: string;
}

export const CreateCategorySheetTrigger: FC<IProps> = (props) => {
  const { children, asChild, text, ...btnProps } = props;
  const { open } = useCreateCategorySheet();
  const isMobile = useIsMobile();

  const _text = text ?? 'Create';

  const button = (
    <Button
      id="create-category-sheet-trigger"
      onClick={() => open()}
      asChild={asChild}
      {...btnProps}
    >
      {(asChild && children) ?? (
        <>
          <IconFilePlus />
          <span className="sr-only sm:not-sr-only">{_text}</span>
        </>
      )}
    </Button>
  );

  if (!isMobile) {
    return button;
  }

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>
        <p>{_text}</p>
      </TooltipContent>
    </Tooltip>
  );
};