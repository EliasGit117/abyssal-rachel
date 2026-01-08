import { useMemo, PropsWithChildren, useEffect } from 'react';
import { contextFactory } from '@/lib/context-factory';
import { useQuery } from '@tanstack/react-query';
import { getCategoryTreeQueryOptions } from '@/features/categories/server-functions/get-tree.ts';
import { useDeleteCategoryMutation } from '@/features/categories/server-functions/delete.ts';
import { ICategoryDto } from '@/features/categories/dtos/category-dto.ts';
import { useTree } from '@headless-tree/react';
import {
  expandAllFeature,
  hotkeysCoreFeature,
  selectionFeature,
  syncDataLoaderFeature,
  TreeInstance
} from '@headless-tree/core';


interface IProps {
  deleteCategory: (values: { categoryId: number }) => Promise<void>;
  isPendingCategories?: boolean;
  disabled?: boolean;
  tree: TreeInstance<ICategoryDto>;
  indent: number;
  refetch: () => void;
}

interface IProviderProps extends PropsWithChildren {
  disabled?: boolean;
}

const [CategoryTreeContext, useCategoryTree] = contextFactory<IProps>({ name: 'CategoryTreeContext' });

const indent = 20;
const rootItemId = '-1';

export const CategoryTreeProvider = ({ children, disabled }: IProviderProps) => {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { data: categories, isPending, refetch } = useQuery({ ...getCategoryTreeQueryOptions() });
  const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategoryMutation();

  const categoriesMap = useMemo(() => {
    const map = new Map<number, ICategoryDto>();
    const traverse = (cats: ICategoryDto[]) => {
      for (const cat of cats) {
        map.set(cat.id, cat);
        if (cat.children)
          traverse(cat.children);
      }
    };

    traverse(categories ?? []);
    map.set(-1, {
      id: -1,
      slug: '',
      nameRo: 'Categorii',
      nameRu: 'Категории',
      slugPath: '/',
      idPath: '/',
      children: categories
    });

    return map;
  }, [categories]);


  const isDisabled = isPending || isDeleting || disabled;

  const tree = useTree<ICategoryDto>({
    indent,
    rootItemId,
    features: [
      ...(disabled ? [] : [hotkeysCoreFeature]),
      syncDataLoaderFeature,
      selectionFeature,
      expandAllFeature
    ],
    dataLoader: {
      getItem: (itemId: string) => {
        const category = categoriesMap.get(Number(itemId));
        if (!category)
          return ({
            id: Number(itemId),
            slug: '',
            nameRo: '…',
            nameRu: '…',
            idPath: '/',
            slugPath: '/',
            children: []
          } satisfies ICategoryDto);

        return category;
      },
      getChildren: (itemId: string) => {
        const category = categoriesMap.get(Number(itemId));
        return category?.children?.map((c) => c.id.toString()) ?? [];
      }
    },
    getItemName: (item) => {
      const { nameRo } = item.getItemData();
      return nameRo;
    },
    isItemFolder: (item) => (item.getItemData().children?.length ?? 0) > 0
  });

  useEffect(() => {
    tree.rebuildTree();
  }, [categories]);

  const value = {
    tree: tree,
    disabled: isDisabled,
    isPendingCategories: isPending,
    indent: indent,
    deleteCategory: deleteCategory,
    refetch: refetch
  };

  return (
    <CategoryTreeContext.Provider value={value}>
      {children}
    </CategoryTreeContext.Provider>
  );
};

export {
  CategoryTreeContext,
  useCategoryTree
};