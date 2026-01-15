import { ReactNode, useState } from 'react';
import { contextFactory } from '@/lib/utils/context-factory.ts';

export type CategorySheetMode = 'create' | 'edit';

export interface CategorySheetOptions {
  mode: CategorySheetMode;
  categoryId?: number;
  parentId?: number;
}

interface CategorySheetContextValue {
  isOpen: boolean;
  options?: CategorySheetOptions;
  open: (options: CategorySheetOptions) => void;
  close: () => void;
}

const [CategorySheetContext, useCategorySheet] = contextFactory<CategorySheetContextValue>({ name: 'CategorySheetContext', });

export const CategorySheetProvider = ({ children, }: { children: ReactNode; }) => {
  const [options, setOptions] = useState<CategorySheetOptions>();

  const open = (opts: CategorySheetOptions) => setOptions(opts);
  const close = () => setOptions(undefined);

  return (
    <CategorySheetContext.Provider
      value={{
        isOpen: !!options,
        options,
        open,
        close,
      }}
    >
      {children}
    </CategorySheetContext.Provider>
  );
};

export { CategorySheetContext, useCategorySheet };