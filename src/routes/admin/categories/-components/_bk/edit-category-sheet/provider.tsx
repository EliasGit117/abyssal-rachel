import { useState, ReactNode } from 'react';
import { contextFactory } from '@/lib/context-factory.ts';



interface IProps {
  isOpen: boolean;
  open: (id: number) => void;
  categoryId?: number;
  close: () => void;
}

const [EditCategorySheetContext, useEditCategorySheet] = contextFactory<IProps>({ name: 'EditCategorySheetContext' });

export const EditCategorySheetProvider = ({ children }: { children: ReactNode }) => {
  const [categoryId, setCategoryId] = useState<number>();

  const close = () => setCategoryId(undefined);
  const open = (id: number) => setCategoryId(id);

  return (
    <EditCategorySheetContext.Provider
      value={{ isOpen: !!categoryId, open: open, close: close, categoryId: categoryId }}
    >
      {children}
    </EditCategorySheetContext.Provider>
  );
};

export {
  EditCategorySheetContext,
  useEditCategorySheet
};