import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  DataTable, DataTableActionBar,
  DataTablePagination,
  DataTableProvider, DataTableToolbar,
  useDataTable
} from '@/components/data-table';
import { sessionColumns } from './columns.tsx';
import {
  getSessionsPaginatedAdminQueryOptions,
  TGetSessionsPaginatedAdmin
} from '@/features/auth/server-functions/admin/sessions-paginated.ts';
import { ComponentProps, FC, useMemo } from 'react';
import { cn } from '@/lib/utils.ts';
import { IconFileExport, IconRefresh, IconTrash } from '@tabler/icons-react';
import { ActionBarButton } from '@/components/data-table/action-bar.tsx';
import { AdaptiveButton } from '@/components/ui/adaptive-button.tsx';
import { useRevokeSessionsMutation } from '@/features/auth/server-functions/admin/revoke-sessions.ts';
import { exportToCsv } from '@/lib/csv.ts';
import { Permission } from '@/features/auth/lib/permissions.ts';
import { useHasPermission } from '@/hooks/use-has-permission.ts';


interface IProps extends ComponentProps<'div'> {
  search?: TGetSessionsPaginatedAdmin;
}

export const SessionsTable: FC<IProps> = (props) => {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { className, search = {}, ...divProps } = props;
  const { canDelete } = useHasPermission({ canDelete: { user: [Permission.Delete] } });
  const { data, isLoading, refetch } = useQuery({
    ...getSessionsPaginatedAdminQueryOptions(search),
    placeholderData: keepPreviousData
  });

  const columns = useMemo(() => sessionColumns({
    disabled: isLoading,
    canDelete: canDelete
  }), [isLoading]);

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
        right: ['type', 'actions']
      }
    }
  });


  const onExportToCsvClick = () => {
    if (!selectedItems.length)
      return;

    setRowSelection({});
    exportToCsv('sessions.csv', selectedItems.map((session) => ({
      id: session.id,
      userId: session.userId,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt
    })));
  };


  const { mutate: revokeSessions, isPending: isRevokingSession } = useRevokeSessionsMutation();
  const revokeSelectedSession = () => {
    if (selectedItems?.length <= 0)
      return;

    revokeSessions({ ids: selectedItems.map(item => item.id) });
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

        <DataTableActionBar disabled={isRevokingSession}>
          <ActionBarButton text="CSV" icon={IconFileExport} onClick={onExportToCsvClick}/>
          {canDelete && (
            <ActionBarButton text="Revoke" icon={IconTrash} variant="destructive" onClick={revokeSelectedSession}/>
          )}
        </DataTableActionBar>
      </DataTableProvider>
    </div>
  );
};