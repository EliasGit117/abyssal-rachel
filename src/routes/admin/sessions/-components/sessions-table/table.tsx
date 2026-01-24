import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  DataTable, DataTableActionBar,
  DataTablePagination,
  DataTableProvider, DataTableToolbar,
  useDataTable
} from '@/components/data-table';
import { sessionColumns } from './columns.tsx';
import { ComponentProps, FC, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { IconFileExport, IconRefresh, IconTrash } from '@tabler/icons-react';
import { ActionBarButton } from '@/components/data-table/action-bar.tsx';
import { AdaptiveButton } from '@/components/ui/adaptive-button.tsx';
import { exportToCsv } from '@/lib/utils/csv.ts';
import { Permission } from '@/lib/auth/permissions.ts';
import { useHasPermissions } from '@/hooks/use-has-permission.ts';
import { orpc } from '@/lib/orpc';
import { TListSessions } from '@/features/sessions/dtos/list-sessions-dto.ts';
import { useRevokeSessionsMutation } from '@/features/sessions/hooks/use-revoke-sessions.tsx';


interface IProps extends ComponentProps<'div'> {
  search?: TListSessions;
}

export const SessionsTable: FC<IProps> = (props) => {
  // noinspection BadExpressionStatementJS
  'use no memo';


  const { className, search = {}, ...divProps } = props;
  const { canDelete } = useHasPermissions({ canDelete: { user: [Permission.Delete] } });
  const { mutate: revokeSessions, isPending: isRevokingSession } = useRevokeSessionsMutation();
  const { data, isPending: isPendingData, isFetching: isFetchingData, refetch } = useQuery({
    ...orpc.admin.sessions.list.queryOptions({ input: search }),
    placeholderData: keepPreviousData,
  });

  const columns = useMemo(() => sessionColumns({
    disabled: isFetchingData,
    canDelete: canDelete,
    onRevokeClick: (id) => revokeSessions({ ids: [id] })
  }), [isFetchingData, canDelete, revokeSessions]);

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


  const revokeSelectedSession = () => {
    if (selectedItems?.length <= 0)
      return;

    revokeSessions({ ids: selectedItems.map(item => item.id) });
  };

  return (
    <div className={cn('space-y-2', className)} {...divProps}>
      <DataTableProvider table={table} loading={isPendingData}>
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

        <DataTableActionBar disabled={isFetchingData || isRevokingSession}>
          <ActionBarButton text="CSV" icon={IconFileExport} onClick={onExportToCsvClick}/>
          {canDelete && (
            <ActionBarButton text="Revoke" icon={IconTrash} variant="destructive" onClick={revokeSelectedSession}/>
          )}
        </DataTableActionBar>
      </DataTableProvider>
    </div>
  );
};