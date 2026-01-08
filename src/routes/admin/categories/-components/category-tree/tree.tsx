import { Tree, TreeItem, TreeItemLabel } from '@/components/ui/tree.tsx';
import { ComponentProps, FC } from 'react';
import { Button } from '@/components/ui/button.tsx';
import {
  IconDots,
  IconFilter,
  IconFolderMinus,
  IconFolderPlus,
  IconInfoCircle,
  IconPencil,
  IconPlus,
  IconProgressAlert,
  IconTrash, IconX
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
import { useCreateCategorySheet } from '@/routes/admin/categories/-components/create-category-sheet';
import { useEditCategorySheet } from '@/routes/admin/categories/-components/edit-category-sheet';
import { useConfirm } from '@/components/ui/confirm-dialog.tsx';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty.tsx';
import { hasRolePermission } from '@/features/auth/lib/has-role-permission.ts';
import { useSession } from '@/hooks/use-session.ts';
import { Permission } from '@/features/auth/lib/permissions.ts';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText
} from '@/components/ui/input-group';
import { IAdminCategoryDto } from '@/features/categories/admin/dtos/admin-category-dto.ts';
import { ItemInstance } from '@headless-tree/core';
import { CategoryStatus } from '~/prisma/generated/prisma/enums.ts';


interface ICategoryTreeProps {
  className?: string;
}

export const CategoryTree: FC<ICategoryTreeProps> = ({ className }) => {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { user } = useSession();
  const { open: openCreateSheet } = useCreateCategorySheet();
  const { open: openEditSheet } = useEditCategorySheet();
  const { tree, disabled, deleteCategory, isPendingCategories, indent, isEmpty, searchValue } = useCategoryTree();
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
            <Skeleton className="size-8"/>
            <Skeleton className="h-8 w-full"/>
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
      {tree.getItems().map((item) => {
        const data = item.getItemData();
        const isItemVisible = (item: ItemInstance<IAdminCategoryDto>, searchValue: string): boolean => {
          if (!searchValue.trim())
            return true;

          if (item.isMatchingSearch())
            return true;

          const hasMatchingDescendant = (node: ItemInstance<IAdminCategoryDto>): boolean => {
            if (!node.isFolder())
              return false;

            return node.getChildren()
              .some((child) => child.isMatchingSearch() || hasMatchingDescendant(child));
          };

          return hasMatchingDescendant(item);
        };

        return (
          <div
            key={item.getId()}
            className="flex items-center gap-2 not-last:pb-0.5 data-[visible=false]:hidden"
            data-visible={isItemVisible(item, searchValue)}
          >
            <DropdownMenu>
              <DropdownMenuTrigger disabled={disabled} asChild>
                <Button size="icon-sm" variant="ghost">
                  <IconDots className='size-4 text-muted-foreground'/>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="min-w-44" align="start">
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

            <TreeItem className="flex-1 not-last:pb-0" item={item}>
              <TreeItemLabel
                className={cn(
                  "before:-inset-y-0.5 before:-z-10 relative before:absolute before:inset-x-0 before:bg-background",
                  data.status === CategoryStatus.INACTIVE && 'text-muted-foreground'
                )}
              >

                <span className="flex items-center gap-2">
                  {data.nameRo}
                  {item.isFolder() && (
                    <span className="-ms-1 text-muted-foreground">
                      {`(${item.getChildren().length})`}
                    </span>
                  )}
                </span>
              </TreeItemLabel>
            </TreeItem>
          </div>
        );
      })}
    </Tree>
  );
};

interface ICategoryTreeToolbarProps extends ComponentProps<'div'> {
  disabled?: boolean;
}

export const CategoryTreeToolbar: FC<ICategoryTreeToolbarProps> = ({ disabled, className, children, ...divProps }) => {
  const { user } = useSession();
  const canCreate = hasRolePermission({ role: user?.role, permissions: { categories: [Permission.Create] } });
  const canEdit = hasRolePermission({ role: user?.role, permissions: { categories: [Permission.Create] } });
  const { tree, disabled: isTreeDisabled, searchValue, setSearchValue } = useCategoryTree();

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
          className="w-8 lg:w-fit"
          onClick={() => tree.collapseAll()}
          disabled={isToolbarDisabled}
        >
          <IconFolderMinus/>
          <span className="sr-only lg:not-sr-only">Collapse all</span>
        </Button>
      )}

      {canEdit && (
        <Button
          size="sm"
          variant="outline"
          className="w-8 lg:w-fit"
          onClick={() => tree.expandAll()}
          disabled={isToolbarDisabled}
        >
          <IconFolderPlus/>
          <span className="sr-only lg:not-sr-only">Expand all</span>
        </Button>
      )}

      <InputGroup className="max-w-64 h-8">
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <IconFilter/>
          </InputGroupText>
        </InputGroupAddon>

        <InputGroupInput
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);

            const props = tree.getSearchInputElementProps();
            props.onChange?.(e);

            if (e.target.value.trim()) tree.expandAll();
          }}
          disabled={isToolbarDisabled}
        />

        {searchValue && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              variant="ghost"
              aria-label="Clear"
              size="icon-xs"
              disabled={isToolbarDisabled}
              onClick={() => {
                setSearchValue('');
                const props = tree.getSearchInputElementProps();
                props.onChange?.({ target: { value: '' } });
              }}
            >
              <IconX/>
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>


      {children}
    </div>
  );
};
