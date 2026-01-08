import { Tree, TreeItem, TreeItemLabel } from '@/components/ui/tree.tsx';
import { ComponentProps, FC } from 'react';
import { Button } from '@/components/ui/button.tsx';
import {
  IconDots,
  IconFolderMinus,
  IconFolderPlus,
  IconInfoCircle,
  IconPencil, IconPlus, IconProgressAlert, IconRefresh,
  IconTrash
} from '@tabler/icons-react';
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub,
  DropdownMenuSubContent, DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import { cn } from '@/lib/utils.ts';
import { toast } from 'sonner';
import { useCategoryTree } from '@/routes/admin/categories/-components/category-tree/provider.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { useIsMobile } from '@/hooks/use-mobile.ts';
import { useCreateCategorySheet } from '@/routes/admin/categories/-components/create-category-sheet';
import { useEditCategorySheet } from '@/routes/admin/categories/-components/edit-category-sheet';
import { useConfirm } from '@/components/ui/confirm-dialog.tsx';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty.tsx';
import { LoadingButton } from '@/components/ui/loading-button.tsx';
import { hasRolePermission } from '@/features/auth/lib/has-role-permission.ts';
import { useSession } from '@/hooks/use-session.ts';
import { Permission } from '@/features/auth/lib/permissions.ts';


interface ICategoryTreeProps {
  className?: string;
}

export const CategoryTree: FC<ICategoryTreeProps> = ({ className }) => {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { user } = useSession();
  const { open: openCreateSheet } = useCreateCategorySheet();
  const { open: openEditSheet } = useEditCategorySheet();
  const { tree, disabled, deleteCategory, isPendingCategories, indent, isEmpty, refetch } = useCategoryTree();
  const confirm = useConfirm();

  const canCreate = hasRolePermission({ role: user?.role, permissions: { categories: [Permission.Create] } });
  const canEdit = hasRolePermission({ role: user?.role, permissions: { categories: [Permission.Create] } });
  const canDelete = hasRolePermission({ role: user?.role, permissions: { categories: [Permission.Delete] } });

  const deleteWithConfirm = async (id: number) => {
    const isConfirmed = await confirm({
      title: 'Delete category',
      description: 'Are you sure you want to delete category?',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });

    if (!isConfirmed)
      return;

    toast.promise(
      deleteCategory({ categoryId: id }),
      {
        loading: 'Deleting category...',
        success: () => 'Category deleted successfully',
        error: (err) => {
          return err?.message ?? 'Failed to delete category';
        }
      }
    );
  };

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

  if (isEmpty)
    return (
      <Empty className="mt-12 sm:mt-24">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconProgressAlert/>
          </EmptyMedia>
          <EmptyTitle>
            Empty
          </EmptyTitle>
          <EmptyDescription>
            The category tree is empty
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            {canCreate && (
              <Button
                onClick={() => {
                  const el = document.getElementById('create-category-sheet-trigger');
                  el?.click();
                }}
              >
                <IconPlus/>
                <span>Create</span>
              </Button>
            )}

            <LoadingButton variant="outline" loading={isPendingCategories} onClick={() => refetch()}>
              <IconRefresh/>
              <span>Refresh</span>
            </LoadingButton>
          </div>
        </EmptyContent>
      </Empty>
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
                {canCreate && (
                  <DropdownMenuItem onClick={() => openCreateSheet({ parentId: Number(item.getId()) })}>
                    <IconFolderPlus className="text-muted-foreground"/>
                    <span>Add child</span>
                  </DropdownMenuItem>
                )}

                {canEdit && (
                  <DropdownMenuItem onClick={() => openEditSheet(Number(item.getId()))}>
                    <IconPencil className="text-muted-foreground"/>
                    <span>Edit</span>
                  </DropdownMenuItem>
                )}

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

                {canDelete && (
                  <DropdownMenuItem
                    variant="destructive"
                    disabled={disabled || isPendingCategories}
                    onClick={() => deleteWithConfirm(Number(item.getId()))}
                  >
                    <IconTrash/>
                    <span>Delete</span>
                  </DropdownMenuItem>
                )}
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

  const { user } = useSession();
  const canCreate = hasRolePermission({ role: user?.role, permissions: { categories: [Permission.Create] } });
  const canEdit = hasRolePermission({ role: user?.role, permissions: { categories: [Permission.Create] } });

  const isToolbarDisabled = isTreeDisabled || disabled;

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn('flex items-center gap-2', className)}
      {...divProps}
    >
      {canCreate && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => tree.collapseAll()}
          disabled={isToolbarDisabled}
        >
          <IconFolderMinus/>
          <span>{isMobile ? 'Collapse' : 'Collapse all'}</span>
        </Button>
      )}

      {canEdit && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => tree.expandAll()}
          disabled={isToolbarDisabled}
        >
          <IconFolderPlus/>
          <span>{isMobile ? 'Expand' : 'Expand all'}</span>
        </Button>
      )}

      {children}
    </div>
  );
};