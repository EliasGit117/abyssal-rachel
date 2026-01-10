import { Column } from '@tanstack/react-table';
import {
  IconEraser,
  IconEyeOff,
  IconChevronDown,
  IconChevronUp,
  IconSelector
} from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { HTMLAttributes } from 'react';

interface DataTableColumnHeaderProps<TData, TValue>
  extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title?: string;
  iconHidden?: boolean;
}

export function DataTableColumnHeader<TData, TValue>(props: DataTableColumnHeaderProps<TData, TValue>) {
  // noinspection BadExpressionStatementJS
  'use no memo';

  const { column, title: customTitle, className, iconHidden } = props;
  const isSorted = column.getIsSorted();
  const title = customTitle ?? column.columnDef.meta?.label ?? column.id;
  const Icon = !iconHidden ? column.columnDef.meta?.icon : undefined;

  if (!column.getCanSort()) {
    return (
      <div className={cn(className, 'flex items-center gap-2')}>
        {Icon && <Icon className="size-4 text-muted-foreground"/>}
        <span>{title}</span>
      </div>
    );
  }

  const toggleSorting = (value: boolean) => column.toggleSorting(value);
  const clearSorting = () => column.clearSorting();
  const hide = () => column.toggleVisibility(false);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="data-[state=open]:bg-accent -ml-3 h-fit py-1 flex items-center gap-2"
          >
            {Icon && <Icon className="text-muted-foreground"/>}
            <span>{title}</span>

            {isSorted === 'desc' ? (
              <IconChevronDown className=' text-muted-foreground'/>
            ) : isSorted === 'asc' ? (
              <IconChevronUp className=' text-muted-foreground'/>
            ) : (
              <IconSelector className=' text-muted-foreground'/>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => toggleSorting(false)}>
            <IconChevronUp/>
            <span>Asc</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => toggleSorting(true)}>
            <IconChevronDown/>
            <span>Desc</span>
          </DropdownMenuItem>

          {isSorted && (
            <DropdownMenuItem onClick={clearSorting}>
              <IconEraser/>
              <span>Clear</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator/>

          <DropdownMenuItem onClick={hide}>
            <IconEyeOff/>
            <span>Hide</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
