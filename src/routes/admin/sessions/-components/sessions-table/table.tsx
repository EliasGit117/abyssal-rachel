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
import { IconTrash } from '@tabler/icons-react';
import { ActionBarButton } from '@/components/data-table/action-bar.tsx';
import { AdaptiveButton } from '@/components/ui/adaptive-button.tsx';


interface IProps extends ComponentProps<'div'> {
  search?: TGetSessionsPaginatedAdmin;
}

export const SessionsTable: FC<IProps> = (props) => {
  // noinspection BadExpressionStatementJS
  "use no memo";

  const { className, search = {}, ...divProps } = props;
  const { data, isLoading, refetch } = useQuery({
    ...getSessionsPaginatedAdminQueryOptions(search),
    placeholderData: keepPreviousData
  });

  const columns = useMemo(() => sessionColumns({ disabled: isLoading }), [isLoading]);
  const { table } = useDataTable({
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

  return (
    <div className={cn('space-y-2', className)} {...divProps}>
      <DataTableProvider table={table} isPending={isLoading}>
        <DataTableToolbar>
          <AdaptiveButton text="Refresh" size="sm" variant="ghost" onClick={() => refetch()}/>
        </DataTableToolbar>

        <DataTable />
        <DataTablePagination/>

        <DataTableActionBar>
          <ActionBarButton text="Delete" icon={IconTrash} variant="destructive"/>
        </DataTableActionBar>
      </DataTableProvider>
    </div>
  );
};