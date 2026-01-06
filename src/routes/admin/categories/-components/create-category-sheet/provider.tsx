import { useState, ReactNode } from 'react';
import { contextFactory } from '@/lib/context-factory';

interface IProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  open: () => void;
}

const [CreateCategorySheetContext, useCreateCategorySheet] = contextFactory<IProps>({ name: 'CreateCategorySheetContext' });

export const CreateCategorySheetProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const open = () => setIsOpen(true);

  return (
    <CreateCategorySheetContext.Provider value={{ isOpen: isOpen, setIsOpen: setIsOpen, open: open }}>
      {children}
    </CreateCategorySheetContext.Provider>
  );
};

export {
  CreateCategorySheetContext,
  useCreateCategorySheet
};