import { ComponentProps, FC, useMemo } from 'react';
import {
  DataTable, DataTableActionBar,
  DataTablePagination,
  DataTableProvider,
  DataTableToolbar,
  useDataTable
} from '@/components/data-table';
import { userColumns } from './columns.tsx';
import { IconFileExport, IconRefresh, IconTrash } from '@tabler/icons-react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getUsersPaginatedAdminQueryOptions,
  TGetUsersPaginatedAdmin
} from '@/features/auth/server-functions/admin/users-paginated.ts';
import { cn } from '@/lib/utils.ts';
import { useDeleteUserMutation } from '@/features/auth/server-functions/admin/delete-user.ts';
import { ActionBarButton } from '@/components/data-table/action-bar.tsx';
import { AdaptiveButton } from '@/components/ui/adaptive-button.tsx';
import { exportToCsv } from '@/lib/csv.ts';
import { Permission } from '@/features/auth/lib/permissions.ts';
import { useHasPermission } from '@/hooks/use-has-permission.ts';


interface IProps extends ComponentProps<'div'> {
  search?: TGetUsersPaginatedAdmin;
}

export const UsersTable: FC<IProps> = (props) => {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { className, search = {}, ...divProps } = props;
  const { canDelete } = useHasPermission({ canDelete: { user: [Permission.Delete] } });
  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteUserMutation();
  const { data, isLoading, refetch } = useQuery({
    ...getUsersPaginatedAdminQueryOptions(search),
    placeholderData: keepPreviousData
  });

  const columns = useMemo(() => userColumns({
    disabled: isLoading || isDeletingUser,
    canDelete: canDelete
  }), [isLoading, isDeletingUser]);

  const { table, selectedItems, setRowSelection } = useDataTable({
    data: data?.items,
    page: data?.page,
    limit: search.limit,
    total: data?.totalCount,
    totalPages: data?.pageCount,
    columns: columns,
    initialState: {
      columnVisibility: {
        id: false,
        updatedAt: false
      },
      columnPinning: {
        left: ['select'],
        right: ['actions']
      }
    }
  });


  const deleteSelectedUser = () => {
    if (selectedItems[0] == null)
      return;

    deleteUser({ data: { id: selectedItems[0].id } });
  };

  const onExportToCsvClick = () => {
    if (!selectedItems.length)
      return;

    setRowSelection({});
    exportToCsv('users.csv', selectedItems.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt
    })));
  };

  return (
    <div className={cn('space-y-2', className)} {...divProps}>
      <DataTableProvider table={table} isPending={isLoading}>
        <DataTableToolbar>
          <AdaptiveButton
            text="Refresh"
            size="sm"
            variant="ghost"
            icon={IconRefresh} className="ml-auto"
            onClick={() => refetch()}
          />
        </DataTableToolbar>

        <DataTable/>
        <DataTablePagination/>

        <DataTableActionBar disabled={isDeletingUser}>
          <ActionBarButton text="CSV" icon={IconFileExport} onClick={onExportToCsvClick}/>
          {canDelete && (
            <ActionBarButton text="Delete" icon={IconTrash} variant="destructive" onClick={deleteSelectedUser}/>
          )}
        </DataTableActionBar>
      </DataTableProvider>
    </div>
  );
};
