import { ComponentProps, FC, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  DataTableProvider,
  DataTableToolbar,
  DataTable, useDataTable
} from '@/components/data-table';
import { bannerColumns } from '@/routes/admin/banners/-components/banners-table/columns';

import { Button } from '@/components/ui/button';
import { IconTrash } from '@tabler/icons-react';


interface IProps extends ComponentProps<'div'> {
}

export const BannerTable: FC<IProps> = (props) => {
  // noinspection BadExpressionStatementJS
  'use no memo';
  const { className, ...restOfProps } = props;
  const data: any[] = [];
  const [isPending] = useState(false);


  const isLoading = isPending;
  const columns = useMemo(() => bannerColumns({ disabled: isLoading }), [isLoading]);

  const { table, selectedItems } = useDataTable({
    data: data,
    page: 1,
    limit: 10,
    total: data?.length,
    totalPages: 1,
    columns: columns,
    pageOnSearchChange: 'none',
    initialState: {
      columnVisibility: {
        id: false,
        updatedAt: false,
        createdAt: false
      },
      columnPinning: {
        left: ['select'],
        right: ['actions']
      }
    }
  });


  return (
        <div className={cn('flex flex-col gap-2', className)} {...restOfProps}>
          <DataTableProvider table={table} isPending={isPending}>
            <DataTableToolbar>
              <div className="flex-1"/>
              {selectedItems.length > 0 && (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={isLoading}
                >
                  <IconTrash/>
                  <span className="sr-only lg:not-sr-only">Delete</span>
                </Button>
              )}

            </DataTableToolbar>

            <DataTable/>

          </DataTableProvider>
        </div>
  );
};

export default BannerTable;