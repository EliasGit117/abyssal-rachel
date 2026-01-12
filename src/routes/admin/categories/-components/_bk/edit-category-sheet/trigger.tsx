import { Button } from '@/components/ui/button.tsx';
import { ComponentProps, FC } from 'react';
import { IconSquareRoundedPlus } from '@tabler/icons-react';
import { useEditCategorySheet } from './provider.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx';
import { useIsMobile } from '@/hooks/use-mobile.ts';


interface IProps extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  categoryId: number;
  text?: string;
}

export const EditCategorySheetTrigger: FC<IProps> = (props) => {
  const { children, asChild, text, categoryId, ...btnProps } = props;
  const { open } = useEditCategorySheet();
  const isMobile = useIsMobile();

  const _text = text ?? 'Edit';

  const button = (
    <Button
      asChild={asChild}
      {...btnProps}
      onClick={() => open(categoryId)}
    >
      {(asChild && children) ?? (
        <>
          <IconSquareRoundedPlus />
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