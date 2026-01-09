import { useDataTableContext } from '@/components/data-table/context';
import { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  IconArrowsUpDown,
  IconChevronDown,
  IconChevronUp, IconCircleX,
  IconPointFilled,
} from '@tabler/icons-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command.tsx';
import { Separator } from '@/components/ui/separator.tsx';


interface IDataTableSortPopoverProps<_>
  extends ComponentProps<typeof PopoverTrigger> {
}

export function DataTableSortPopover<TData>({ ...props }: IDataTableSortPopoverProps<TData>) {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { table } = useDataTableContext();
  const sorting = table.getState().sorting;
  const sortableColumns = table.getAllColumns().filter(col => col.getCanSort());
  const currentSort = sorting[0] || null;

  return (
    <Popover>
      <PopoverTrigger {...props} asChild>
        <Button role="combobox" variant="outline" size="sm" className='w-8 sm:w-fit'>
          <IconArrowsUpDown/>
          <span className="sr-only sm:not-sr-only">Sort</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-44 p-0 gap-1 dark">
        <Command className="space-y-1">
          <CommandInput placeholder="Search columns..." wrapperClassName="p-0" groupClassName="rounded-sm!"/>
          <CommandList>
            <CommandEmpty>No columns found.</CommandEmpty>
            <CommandGroup className="p-0" heading="Sort by">
              {sortableColumns.map((column) => {
                const Icon = column.columnDef.meta?.icon;

                return (
                  <CommandItem
                    key={column.id}
                    onSelect={() => table.setSorting([{ id: column.id, desc: !!currentSort?.desc }])}
                    hideCheckIcon
                  >
                    {Icon && <Icon className="size-4 text-muted-foreground"/>}
                    <span className="truncate">
                      {column.columnDef.meta?.label ?? column.id}
                    </span>
                    {currentSort?.id === column.id && (<IconPointFilled className="ml-auto"/>)}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>

        {!!currentSort && (
          <>
            <Separator/>

            <Command className="space-y-1 p-0">
              <CommandList>
                <CommandGroup className="p-0" heading="Direction">
                  <CommandItem
                    onSelect={() => table.setSorting([{ id: currentSort.id, desc: false }])}
                    hideCheckIcon
                  >
                    <IconChevronUp className="size-4 text-muted-foreground"/>
                    <span className="truncate">ASC</span>
                    {!currentSort.desc && <IconPointFilled className="ml-auto"/>}
                  </CommandItem>

                  <CommandItem
                    onSelect={() => table.setSorting([{ id: currentSort.id, desc: true }])}
                    hideCheckIcon
                  >
                    <IconChevronDown className="size-4 text-muted-foreground"/>
                    <span className="truncate">DESC</span>
                    {currentSort.desc && <IconPointFilled className="ml-auto"/>}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>

            <Separator/>

            <Button size="sm" variant="ghost" className="m-1 mt-0" onClick={() => table.setSorting([])}>
              <IconCircleX/>
              <span>Clear</span>
            </Button>
          </>
        )}

      </PopoverContent>
    </Popover>
  );
}