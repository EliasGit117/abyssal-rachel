import { useDataTableContext } from '@/components/data-table/context';
import { ComponentProps, useMemo } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { IconAdjustmentsHorizontal, IconCheck } from '@tabler/icons-react';
import { Button } from '@/components/ui/button.tsx';



interface IDataTableViewOptionsProps<_> extends ComponentProps<typeof PopoverTrigger> {}

export function DataTableViewOptions<TData>({ ...props }: IDataTableViewOptionsProps<TData>) {
  // noinspection BadExpressionStatementJS
  "use no memo";

  const { table } = useDataTableContext();
  const columns = useMemo(() =>
    table
      .getAllColumns()
      .filter((col) => typeof col.accessorFn !== 'undefined' && col.getCanHide()), [table]
  );

  return (
    <Popover>
      <PopoverTrigger {...props} asChild>
        <Button
          aria-label="Toggle columns"
          role="combobox"
          variant="outline"
          className='w-8 sm:w-fit'
          size="sm"
        >
          <IconAdjustmentsHorizontal/>
          <span className='sr-only sm:not-sr-only'>View</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-44 p-0 gap-1 dark">
        <Command className='space-y-1'>
          <CommandInput placeholder="Search columns..." wrapperClassName='p-0' groupClassName='rounded-sm!'/>
          <CommandList>
            <CommandEmpty>No columns found.</CommandEmpty>
            <CommandGroup className='p-0' heading='Columns'>
              {columns.map((column) => {
                const Icon = column.columnDef.meta?.icon;

                return (
                  <CommandItem
                    key={column.id}
                    onSelect={() => column.toggleVisibility(!column.getIsVisible())}
                    hideCheckIcon
                  >
                    {Icon && <Icon className='size-4 text-muted-foreground'/>}
                    <span className="truncate">
                      {column.columnDef.meta?.label ?? column.id}
                    </span>
                    <IconCheck
                      data-visible={column.getIsVisible()}
                      className='ml-auto size-4 shrink-0 data-[visible=false]:opacity-0'
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
