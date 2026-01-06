import { hotkeysCoreFeature, syncDataLoaderFeature } from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { Tree, TreeItem, TreeItemLabel } from '@/components/ui/tree.tsx';
import { ComponentProps, FC, PropsWithChildren, useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ICategoryDto } from '@/features/categories/dtos/category-dto.ts';
import { getCategoryTreeQueryOptions } from '@/features/categories/server-functions/get-tree.ts';
import { cn } from '@/lib/utils.ts';
import { Skeleton } from '@/components/ui/skeleton';

const rootItemId = '-1';
const indent = 20;

interface IProps {
  toolbarChildren?: FC;
}

export const CategoryTree: FC<IProps> = ({ toolbarChildren: ToolbarChildren }) => {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { data: categories, isPending } = useSuspenseQuery({ ...getCategoryTreeQueryOptions() });

  const categoriesMap = useMemo(() => {
    const map = buildCategoriesMap(categories);
    const root: ICategoryDto = { id: -1, slug: '', nameRo: 'Categorii', nameRu: 'Категории', children: categories };
    map.set(-1, root);
    return map;
  }, [categories]);


  const tree = useTree<ICategoryDto>({
    indent: indent,
    rootItemId: rootItemId,
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
    dataLoader: {
      getItem: (itemId: string) => {
        const category = categoriesMap.get(Number(itemId));
        if (!category)
          throw new Error(`Category with id ${itemId} not found`);

        return category;
      },
      getChildren: (itemId: string) => {
        if (itemId === rootItemId)
          return categories.map(c => c.id.toString());

        const category = categoriesMap.get(Number(itemId));
        return category?.children?.map(c => c.id.toString()) ?? [];
      }
    },
    getItemName: (item) => item.getItemData().nameRo,
    isItemFolder: (item) => {
      const data = item.getItemData();
      return (data.children?.length ?? 0) > 0;
    }
  });

  if (isPending)
    return (
      <Container className="space-y-2">
        <Toolbar>
          {ToolbarChildren && <ToolbarChildren/>}
        </Toolbar>
        {Array(10).fill(null).map((_, i) => (
          <Skeleton className="h-6 w-full" key={i}/>
        ))}
      </Container>
    );

  return (
    <Container>
      <Toolbar>
        {ToolbarChildren && <ToolbarChildren/>}
      </Toolbar>
      <Tree
        className="before:-ms-1 relative before:absolute before:inset-0 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
        indent={indent}
        tree={tree}
      >
        {tree.getItems().map((item) => (
          <TreeItem item={item} key={item.getId()}>
            <TreeItemLabel
              className="before:-inset-y-0.5 before:-z-10 relative before:absolute before:inset-x-0 before:bg-background"/>
          </TreeItem>
        ))}
      </Tree>
    </Container>
  );
};

interface IToolbarProps extends ComponentProps<'div'> {
}

const Toolbar: FC<PropsWithChildren<IToolbarProps>> = ({ children, className, ...props }) => {

  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <h3>Category Tree</h3>
      {children}
    </div>
  );
};

interface IContainerProps extends ComponentProps<'section'> {
}

const Container: FC<PropsWithChildren<IContainerProps>> = ({ children, className, ...props }) => {

  return (
    <section className={cn('space-y-4', className)} {...props}>
      {children}
    </section>
  );
};


function buildCategoriesMap(categories: ICategoryDto[]): Map<number, ICategoryDto> {
  const map = new Map<number, ICategoryDto>();

  function traverse(cats: ICategoryDto[]) {
    for (const cat of cats) {
      map.set(cat.id, cat);

      if (cat.children)
        traverse(cat.children);
    }
  }

  traverse(categories);
  return map;
}