import { ChangeEvent, ComponentProps, useEffect, useRef } from 'react';
import { Column } from '@tanstack/react-table';
import { ColumnFilterType } from '@/components/data-table/types/tanstack-table-meta';
import { Input } from '@/components/ui/input';
import { useDebouncedCallback } from 'use-debounce';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { IconX } from '@tabler/icons-react';

interface IDataTableTextFilterProps<TData, TValue>
  extends ComponentProps<typeof Input> {
  column: Column<TData, TValue>;
}

export function DataTableTextFilter<TData, TValue>(props: IDataTableTextFilterProps<TData, TValue>) {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { column, className, type = ColumnFilterType.Text, ...restOfProps } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const meta = column.columnDef.meta;
  const title = meta?.label ?? column.id;

  const filterValue = column.getFilterValue() as string | undefined;
  const debouncedSetFilter = useDebouncedCallback(() => {}, 300);

  useEffect(() => {
    if (debouncedSetFilter.isPending() || !inputRef.current?.value || inputRef.current.value === (filterValue ?? ''))
      return;

    inputRef.current.value = filterValue ?? '';
  }, [filterValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (inputRef.current)
      inputRef.current.value = value;

    debouncedSetFilter()
    column.setFilterValue(value || undefined);
  };

  const reset = () => {
    if (inputRef.current)
      inputRef.current.value = '';

    column.setFilterValue(undefined);
  };

  if (meta?.filter?.type !== ColumnFilterType.Text)
    throw new Error('Filter must be a type Text');

  return (
    <InputGroup className="h-8 w-40 lg:w-56">
      <InputGroupInput
        ref={inputRef}
        {...restOfProps}
        id={`${title}-filter`}
        type={type}
        placeholder={meta?.filter?.placeholder ?? title}
        defaultValue={filterValue ?? ''}
        onChange={handleChange}
      />

      {filterValue && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={reset} size="icon-xs">
            <IconX/>
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}

