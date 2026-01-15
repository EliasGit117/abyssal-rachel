import { useState, ReactNode } from 'react';
import { contextFactory } from '@/lib/utils/context-factory.ts';

interface IOptions {
  parentId?: number | null | undefined;
}

interface IProps {
  isOpen: boolean;
  open: (options?: IOptions) => void;
  close: () => void;
  options: IOptions;
}

const [CreateCategorySheetContext, useCreateCategorySheet] = contextFactory<IProps>({ name: 'CreateCategorySheetContext' });

export const CreateCategorySheetProvider = ({ children }: { children: ReactNode }) => {
  const [parentId, setParentId] = useState<IOptions['parentId']>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const close = () => {
    setParentId(undefined);
    setIsOpen(false);
  }

  const open = (options?: IOptions) => {
    setParentId(options?.parentId ?? undefined);
    setIsOpen(true);
  }

  const options: IOptions = { parentId: parentId };

  return (
    <CreateCategorySheetContext.Provider value={{ isOpen: isOpen, open: open, close: close, options: options }}>
      {children}
    </CreateCategorySheetContext.Provider>
  );
};

export {
  CreateCategorySheetContext,
  useCreateCategorySheet
};