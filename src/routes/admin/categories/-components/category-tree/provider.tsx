import { useMemo, PropsWithChildren, useEffect, useState } from 'react';
import { contextFactory } from '@/lib/context-factory';
import { useQuery } from '@tanstack/react-query';
import { getCategoryTreeForAdminQueryOptions } from '@/features/categories/admin/server-functions/get-tree.ts';
import { useDeleteCategoryMutation } from '@/features/categories/admin/server-functions/delete.ts';
import { IAdminCategoryDto } from '@/features/categories/admin/dtos/admin-category-dto.ts';
import { useTree } from '@headless-tree/react';
import {
  expandAllFeature,
  hotkeysCoreFeature,
  searchFeature,
  syncDataLoaderFeature,
  TreeInstance,
  TreeState
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
  searchValue: string;
  setSearchValue: (v: string) => void;
  filteredIds: Set<string> | null;
}

interface IProviderProps extends PropsWithChildren {
  disabled?: boolean;
}

const [CategoryTreeContext, useCategoryTree] = contextFactory<IProps>({ name: 'CategoryTreeContext' });

const indent = 20;
const rootItemId = '-1';


export const CategoryTreeProvider = ({ children, disabled }: IProviderProps) => {
  const { data: categories, isPending, refetch } = useQuery({
    ...getCategoryTreeForAdminQueryOptions()
  });
  const { mutateAsync: deleteCategory, isPending: isDeleting } =
    useDeleteCategoryMutation();

  const [state, setState] = useState<Partial<TreeState<IAdminCategoryDto>>>({});
  const [searchValue, setSearchValue] = useState('');

  const categoriesMap = useMemo(() => {
    const map = new Map<number, IAdminCategoryDto>();
    const traverse = (cats: IAdminCategoryDto[]) => {
      for (const cat of cats) {
        map.set(cat.id, cat);
        if (cat.children) traverse(cat.children);
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
      children: categories ?? []
    });

    return map;
  }, [categories]);

  const isDisabled = isPending || isDeleting || disabled;

  const tree = useTree<IAdminCategoryDto>({
    indent,
    rootItemId,
    state,
    setState,
    features: [
      ...(disabled ? [] : [hotkeysCoreFeature]),
      syncDataLoaderFeature,
      searchFeature,
      expandAllFeature
    ],
    dataLoader: {
      getItem: (itemId: string) => {
        const category = categoriesMap.get(Number(itemId));
        return (
          category ??
          ({
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
          } satisfies IAdminCategoryDto)
        );
      },
      getChildren: (itemId: string) => {
        const category = categoriesMap.get(Number(itemId));
        return category?.children?.map((c) => c.id.toString()) ?? [];
      }
    },
    getItemName: (item) => item.getItemData().nameRo,
    isItemFolder: (item) => (item.getItemData().children?.length ?? 0) > 0
  });

  useEffect(() => {
    tree.rebuildTree();
  }, [categoriesMap]);


  const filteredIds = useMemo(() => {
    if (!searchValue.trim()) return null;

    const allItems = tree.getItems();
    if (allItems.length === 0) return null; // ✅ CRITICAL

    const q = searchValue.toLowerCase();

    const directMatches = allItems
      .filter((it) => it.getItemName().toLowerCase().includes(q))
      .map((it) => it.getId());

    const visible = new Set<string>(directMatches);

    for (const matchId of directMatches) {
      let item = allItems.find((i) => i.getId() === matchId);
      while (item?.getParent?.()) {
        const parent = item.getParent?.();
        if (!parent)
          break;

        visible.add(parent.getId());
        item = parent;
      }
    }

    for (const matchId of directMatches) {
      const root = allItems.find((i) => i.getId() === matchId);
      if (!root?.isFolder()) continue;

      const stack = [...root.getChildren()];
      while (stack.length) {
        const child = stack.pop()!;
        visible.add(child.getId());
        if (child.isFolder()) stack.push(...child.getChildren());
      }
    }

    return visible;
  }, [searchValue, tree.getItems().length]);

  // expand all while searching (optional but matches docs)
  useEffect(() => {
    if (searchValue.trim()) tree.expandAll();
  }, [searchValue, tree]);

  const value = {
    tree,
    indent,
    disabled: isDisabled,
    isEmpty: !categories || categories.length === 0,
    isPendingCategories: isPending,
    deleteCategory,
    refetch,

    // expose filtering controls
    searchValue,
    setSearchValue,
    filteredIds
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