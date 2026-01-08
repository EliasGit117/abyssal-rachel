import { useMemo, PropsWithChildren, useEffect } from 'react';
import { contextFactory } from '@/lib/context-factory';
import { useQuery } from '@tanstack/react-query';
import { getCategoryTreeForAdminQueryOptions } from '@/features/categories/admin/server-functions/get-tree.ts';
import { useDeleteCategoryMutation } from '@/features/categories/admin/server-functions/delete.ts';
import { IAdminCategoryDto } from '@/features/categories/admin/dtos/admin-category-dto.ts';
import { useTree } from '@headless-tree/react';
import {
  expandAllFeature,
  hotkeysCoreFeature,
  syncDataLoaderFeature,
  TreeInstance
} from '@headless-tree/core';
import { CategoryStatus } from '~/prisma/generated/prisma/enums.ts';



interface IProps {
  isEmpty: boolean;
  deleteCategory: (values: { categoryId: number }) => Promise<void>;
  isPendingCategories?: boolean;
  disabled?: boolean;
  tree: TreeInstance<IAdminCategoryDto>;
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

  const { data: categories, isPending, refetch } = useQuery({ ...getCategoryTreeForAdminQueryOptions() });
  const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategoryMutation();



  const categoriesMap = useMemo(() => {
    const map = new Map<number, IAdminCategoryDto>();
    const traverse = (cats: IAdminCategoryDto[]) => {
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
      descriptionRo: '',
      descriptionRu: '',
      status: CategoryStatus.ACTIVE,
      slugPath: '/',
      idPath: '/',
      children: categories
    });

    return map;
  }, [categories]);


  const isDisabled = isPending || isDeleting || disabled;

  const tree = useTree<IAdminCategoryDto>({
    indent,
    rootItemId,
    features: [
      ...(disabled ? [] : [hotkeysCoreFeature]),
      syncDataLoaderFeature,
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
            descriptionRo: '',
            descriptionRu: '',
            status: CategoryStatus.ACTIVE,
            idPath: '/',
            slugPath: '/',
            children: []
          } satisfies IAdminCategoryDto);

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
    indent: indent,
    disabled: isDisabled,
    isEmpty: !categories || !(categories.length > 0),
    isPendingCategories: isPending,
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