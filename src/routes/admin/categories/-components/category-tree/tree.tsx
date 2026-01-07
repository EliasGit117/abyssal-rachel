import {
  expandAllFeature,
  hotkeysCoreFeature,
  selectionFeature,
  syncDataLoaderFeature
} from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { Tree, TreeItem, TreeItemLabel } from '@/components/ui/tree.tsx';
import { FC, useEffect, useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ICategoryDto } from '@/features/categories/dtos/category-dto.ts';
import { getCategoryTreeQueryOptions } from '@/features/categories/server-functions/get-tree.ts';
import { Button } from '@/components/ui/button.tsx';
import {
  IconDots,
  IconFolderPlus,
  IconInfoCircle,
  IconPencil,
  IconSquareRoundedChevronDown,
  IconSquareRoundedChevronRight,
  IconTrash
} from '@tabler/icons-react';
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub,
  DropdownMenuSubContent, DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { useCreateCategorySheet } from '@/routes/admin/categories/-components/create-category-sheet';
import { cn } from '@/lib/utils.ts';
import { useDeleteCategoryMutation } from '@/features/categories/server-functions/delete.ts';
import { toast } from 'sonner';


const rootItemId = '-1';
const indent = 20;

export const CategoryTree: FC = () => {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { open } = useCreateCategorySheet();
  const { data: categories, isPending } = useSuspenseQuery({ ...getCategoryTreeQueryOptions() });
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

    traverse(categories);
    map.set(-1, { id: -1, slug: '', nameRo: 'Categorii', nameRu: 'Категории', children: categories });

    return map;
  }, [categories]);

  const disabled = isPending || isDeleting;

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
          return {
            id: Number(itemId),
            slug: '',
            nameRo: '…',
            nameRu: '…',
            children: []
          } satisfies ICategoryDto;

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


  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex-1"/>

        <Button onClick={() => tree.expandAll()} size="sm" variant="ghost" disabled={disabled}>
          <IconSquareRoundedChevronDown aria-hidden="true" className="-ms-1 opacity-60" size={16}/>
          <span>Expand all</span>
        </Button>
        <Button onClick={tree.collapseAll} size="sm" variant="ghost" disabled={disabled}>
          <IconSquareRoundedChevronRight
            aria-hidden="true"
            className="-ms-1 opacity-60"
            size={16}
          />
          Collapse all
        </Button>
      </div>

      <Tree tree={tree} indent={indent} className={cn(disabled && 'opacity-50 pointer-events-none')}>
        {tree.getItems().map((item) => (
          <div className="flex items-center gap-2 not-last:pb-0.5" key={item.getId()}>
            <TreeItem className="flex-1 not-last:pb-0" item={item}>
              <TreeItemLabel
                className="before:-inset-y-0.5 before:-z-10 relative before:absolute before:inset-x-0 before:bg-background"
              >
                <span className="flex items-center gap-2">
                  {item.getItemName()}
                  {item.isFolder() && (
                    <span className="-ms-1 text-muted-foreground">
                      {`(${item.getChildren().length})`}
                    </span>
                  )}
                </span>
              </TreeItemLabel>
            </TreeItem>


            <DropdownMenu>
              <DropdownMenuTrigger disabled={disabled} asChild>
                <Button size="icon-sm" variant="ghost">
                  <IconDots/>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="min-w-44" align="end">
                <DropdownMenuLabel>
                  Category actions
                </DropdownMenuLabel>

                <DropdownMenuSeparator/>

                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => open({ parentId: Number(item.getId()) })}>
                    <IconFolderPlus className="text-muted-foreground"/>
                    <span>Add child</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <IconPencil className="text-muted-foreground"/>
                    <span>Edit</span>
                  </DropdownMenuItem>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <IconInfoCircle className="text-muted-foreground"/>
                      <span>Short info</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="p-2 min-w-48">
                        <div className="text-xs whitespace-pre-wrap rounded-md bg-muted p-3 overflow-auto max-h-80">
                          {JSON.stringify({
                            ...item.getItemData(),
                            childrenCount: item.getChildren().length,
                            children: undefined
                          }, null, 2)}
                        </div>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuItem
                    variant="destructive"
                    disabled={disabled || isPending}
                    onClick={() => {
                      toast.promise(
                        deleteCategory({ categoryId: Number(item.getId()) }),
                        {
                          loading: 'Deleting category...',
                          success: () => 'Category deleted successfully',
                          error: (err) => {
                            return err?.message ?? 'Failed to delete category';
                          }
                        }
                      );
                    }}
                  >
                    <IconTrash />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </Tree>
    </>
  );
};