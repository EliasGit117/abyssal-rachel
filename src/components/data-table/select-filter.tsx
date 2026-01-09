import { useCallback, useMemo, useState } from 'react';
import type { Column } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  ColumnFilterType,
  TFacetedOptionValue
} from '@/components/data-table/types/tanstack-table-meta';
import {
  IconCirclePlus,
  IconCircleX,
  IconPointFilled
} from '@tabler/icons-react';
import { ButtonGroup } from '@/components/ui/button-group.tsx';

interface IDataTableSelectFilter<TData, TValue> {
  column: Column<TData, TValue>;
}

export function DataTableSelectFilter<TData, TValue>({ column }: IDataTableSelectFilter<TData, TValue>) {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { meta } = column.columnDef;
  if (!meta || meta.filter?.type !== ColumnFilterType.Select)
    throw new Error('DataTableSelectFilter requires ColumnFilterType.Select');


  const { label, filter } = meta;
  const options = filter.options;
  const filterValue = (column.getFilterValue() as TFacetedOptionValue) ?? undefined;
  const hasFilter = filterValue !== undefined;
  const title = label ?? column.id;
  const [open, setOpen] = useState(false);

  const selectedOption = useMemo(() => options.find((o) => o.value === filterValue), [options, filterValue]);
  const onItemSelect = useCallback((value: TFacetedOptionValue, isSelected: boolean) => column.setFilterValue(isSelected ? undefined : value), [column]);
  const onReset = useCallback(() => column.setFilterValue(undefined), [column]);

  return (
    <ButtonGroup>
      {hasFilter && (
        <Button
          size="icon-sm"
          variant="outline"
          className="border-dashed"
          aria-label={`Clear ${title} filter`}
          onClick={onReset}
        >
          <IconCircleX className="text-muted-foreground"/>
        </Button>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-dashed px-2.5!"
          >
            {!hasFilter && (<IconCirclePlus className="text-muted-foreground"/>)}
            {title}

            {hasFilter && selectedOption && (
              <>
                <Separator orientation="vertical" className="mx-1 my-auto h-3.5"/>
                <Badge variant="secondary" className="border border-border rounded-sm px-1 font-normal">
                  {selectedOption.title}
                </Badge>
              </>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-50 p-0" align="start">
          <Command>
            {options.length > 5 && (<CommandInput placeholder={title}/>)}

            <CommandList className="max-h-full">
              <CommandEmpty>No results found.</CommandEmpty>

              <CommandGroup className="max-h-75 overflow-y-auto overflow-x-hidden" heading={title}>
                {options.map((option) => {
                  const isSelected = option.value === filterValue;

                  return (
                    <CommandItem
                      key={`${option.value}`}
                      hideCheckIcon
                      data-is-selected={isSelected}
                      onSelect={() => onItemSelect(option.value, isSelected)}
                    >
                      {option.icon && <option.icon/>}
                      <span className="truncate">
                        {option.title}
                      </span>

                      {isSelected && (<IconPointFilled className='ml-auto'/>)}

                      {option.count && (
                        <Badge variant="secondary" className="border border-border ml-auto px-1.5 font-mono text-xs">
                          {option.count}
                        </Badge>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              {hasFilter && (
                <>
                  <CommandSeparator/>
                  <CommandGroup>
                    <CommandItem
                      hideCheckIcon
                      onSelect={onReset}
                      className="flex justify-center"
                    >
                      <IconCircleX/>
                      <span>Clear filters</span>
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  );
}