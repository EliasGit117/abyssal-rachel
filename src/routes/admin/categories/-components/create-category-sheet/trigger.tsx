import { Button } from '@/components/ui/button';
import { ComponentProps, FC } from 'react';
import { IconSquareRoundedPlus } from '@tabler/icons-react';
import { useCreateCategorySheet } from './provider.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';

interface IProps extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  text?: string;
}

export const CreateCategorySheetTrigger: FC<IProps> = (props) => {
  const { children, asChild, text, ...btnProps } = props;
  const { open } = useCreateCategorySheet();

  let _text = text ?? 'Create';

  return  (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <Button onClick={open} asChild={asChild} {...btnProps}>
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