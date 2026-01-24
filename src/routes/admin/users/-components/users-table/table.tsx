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
import { cn } from '@/lib/utils';
import { ActionBarButton } from '@/components/data-table/action-bar.tsx';
import { AdaptiveButton } from '@/components/ui/adaptive-button.tsx';
import { exportToCsv } from '@/lib/utils/csv.ts';
import { Permission } from '@/lib/auth/permissions.ts';
import { useHasPermissions } from '@/hooks/use-has-permission.ts';
import { orpc } from '@/lib/orpc';
import { TListUsers } from '@/features/users/dtos/list-users-dto.ts';
import { useDeleteUserMutation } from '@/features/users/hooks/use-delete-user.ts';
import { useSession } from '@/hooks/use-session.ts';


interface IProps extends ComponentProps<'div'> {
  search?: TListUsers;
}

export const UsersTable: FC<IProps> = (props) => {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { className, search = {}, ...divProps } = props;
  const { user } = useSession();
  const { canDelete } = useHasPermissions({ canDelete: { user: [Permission.Delete] } });
  const { mutate: deleteUser, isPending: isDeletingUser } = useDeleteUserMutation();
  const { data, isPending: isPendingData, isFetching: isFetchingData, refetch } = useQuery({
    ...orpc.admin.users.list.queryOptions({ input: search }),
    placeholderData: keepPreviousData,
    structuralSharing: false
  });

  const columns = useMemo(() => userColumns({
    currentUserId: user?.id,
    disabled: isFetchingData || isDeletingUser,
    canDelete: canDelete,
    onDeleteClick: (id) => deleteUser({ id: id })
  }), [isFetchingData, isDeletingUser, deleteUser, user]);

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

    deleteUser({ id: selectedItems[0].id });
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
      <DataTableProvider table={table} loading={isPendingData}>
        <DataTableToolbar>
          <AdaptiveButton
            text="Refresh"
            size="sm"
            variant="ghost"
            icon={IconRefresh}
            className="ml-auto"
            onClick={() => refetch({ throwOnError: true })}
          />
        </DataTableToolbar>

        <DataTable/>
        <DataTablePagination/>

        <DataTableActionBar disabled={isFetchingData || isDeletingUser}>
          <ActionBarButton text="CSV" icon={IconFileExport} onClick={onExportToCsvClick}/>
          {canDelete && (
            <ActionBarButton text="Delete" icon={IconTrash} variant="destructive" onClick={deleteSelectedUser}/>
          )}
        </DataTableActionBar>
      </DataTableProvider>
    </div>
  );
};
