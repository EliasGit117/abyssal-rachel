import { useEffect, useMemo, useState } from 'react';
import { useDataTableSearch } from '@/components/data-table/hooks/use-data-table-search';
import {
  useReactTable,
  getCoreRowModel,
  TableOptions,
  VisibilityState, ColumnPinningState, RowSelectionState
} from '@tanstack/react-table';

interface IUseDataTableProps<TData> extends Omit<TableOptions<TData>,
  | 'state'
  | 'getCoreRowModel'
  | 'manualFiltering'
  | 'manualPagination'
  | 'manualSorting'
  | 'rowCount'
  | 'pageCount'
  | 'data'> {

  data?: TData[];
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  history?: 'push' | 'replace';
  pageOnSearchChange?: number | 'none';
}


export function useDataTable<TData>(props: IUseDataTableProps<TData>) {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const {
    data: data = [],
    columns: columns = [],
    initialState,
    page = 1,
    total = 1,
    totalPages = 1,
    limit = 10,
    history = 'replace',
    pageOnSearchChange,
    ...tableProps
  } = props;

  const { columnFiltersState, setColumnFiltersState, sortingState, setSortingState } = useDataTableSearch({
    columns: columns,
    pageOnSearchChange: pageOnSearchChange
  });

  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(initialState?.columnPinning ?? {
    left: [],
    right: []
  });

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialState?.columnVisibility ?? {});

  const [rowSelection, setRowSelection] = useState<RowSelectionState>(initialState?.rowSelection ?? {});

  useEffect(() => {
    setRowSelection({});
  }, [data]);

  const table = useReactTable({
    ...tableProps,
    data: data,
    columns: columns,

    defaultColumn: {
      filterFn: 'equals'
    },
    getCoreRowModel: getCoreRowModel(),

    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,

    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSortingState,
    onColumnFiltersChange: setColumnFiltersState,
    onColumnPinningChange: setColumnPinning,

    rowCount: total,
    pageCount: totalPages,
    state: {
      rowSelection: rowSelection,
      columnPinning: columnPinning,
      columnFilters: columnFiltersState,
      pagination: { pageIndex: page - 1, pageSize: limit },
      columnVisibility: columnVisibility,
      sorting: sortingState
    }
  });

  const selectedItems = useMemo(() => {
    return table.getSelectedRowModel().rows.map(r => r.original);
  }, [rowSelection, table]);

  return {
    table,
    columnFiltersState,
    setColumnFiltersState,
    rowSelection,
    setRowSelection,
    selectedItems
  };
}

