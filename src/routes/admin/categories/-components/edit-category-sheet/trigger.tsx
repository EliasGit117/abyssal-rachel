import { Button } from '@/components/ui/button';
import { ComponentProps, FC } from 'react';
import { IconSquareRoundedPlus } from '@tabler/icons-react';
import { useEditCategorySheet } from './provider.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';

interface IProps extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  categoryId: number;
  text?: string;
}

export const EditCategorySheetTrigger: FC<IProps> = (props) => {
  const { children, asChild, text, categoryId, ...btnProps } = props;
  const { open } = useEditCategorySheet();

  let _text = text ?? 'Edit';

  return  (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <Button asChild={asChild} {...btnProps} onClick={() => open(categoryId)}>
          {(asChild && children) ?? (
            <>
              <IconSquareRoundedPlus/>
              <span className="sr-only sm:not-sr-only">{_text}</span>
            </>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent className='sm:hidden'>
        <p>{_text}</p>
      </TooltipContent>
    </Tooltip>
  )
};