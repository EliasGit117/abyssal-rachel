import { Tree, TreeItem, TreeItemLabel } from '@/components/ui/tree.tsx';
import { ComponentProps, FC } from 'react';
import { Button } from '@/components/ui/button.tsx';
import {
  IconDots,
  IconFolderMinus,
  IconFolderPlus,
  IconInfoCircle,
  IconPencil,
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
import { toast } from 'sonner';
import { useCategoryTree } from '@/routes/admin/categories/-components/category-tree/provider.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { useIsMobile } from '@/hooks/use-mobile.ts';




interface ICategoryTreeProps {
  className?: string;
}

export const CategoryTree: FC<ICategoryTreeProps> = ({ className }) => {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { open } = useCreateCategorySheet();
  const { tree, disabled, deleteCategory, isPendingCategories, indent } = useCategoryTree();

  if (isPendingCategories)
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div className="flex items-center gap-2" key={i}>
            <Skeleton className="h-8 w-full"/>
            <Skeleton className="size-8"/>
          </div>
        ))}
      </div>
    );

  return (
    <Tree
      tree={tree}
      indent={indent}
      className={cn(disabled && 'opacity-50 pointer-events-none', className)}
      aria-label="Categories"
      role="tree"
    >
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
                  disabled={disabled || isPendingCategories}
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
                  <IconTrash/>
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </Tree>
  );
};

interface ICategoryTreeToolbarProps extends ComponentProps<'div'> {
  disabled?: boolean;
}

export const CategoryTreeToolbar: FC<ICategoryTreeToolbarProps> = ({ disabled, className, children, ...divProps }) => {
  const isMobile = useIsMobile();
  const { tree, disabled: isTreeDisabled } = useCategoryTree();

  const isToolbarDisabled = isTreeDisabled || disabled;

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn('flex items-center gap-2', className)}
      {...divProps}
    >
      <Button
        size="sm"
        variant="ghost"
        onClick={() => tree.collapseAll()}
        disabled={isToolbarDisabled}
      >
        <IconFolderMinus/>
        <span>{isMobile ? 'Collapse' : 'Collapse all'}</span>
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={() => tree.expandAll()}
        disabled={isToolbarDisabled}
      >
        <IconFolderPlus/>
        <span>{isMobile ? 'Expand' : 'Expand all'}</span>
      </Button>

      {children}
    </div>
  );
};