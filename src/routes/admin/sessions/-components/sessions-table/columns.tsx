import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  IconUser,
  IconHash,
  IconClock,
  IconCalendar,
  IconWorld,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconBrandChrome,
  IconBrandFirefox,
  IconBrandSafari,
  IconBrandEdge,
  IconBrandOpera,
  IconQuestionMark,
  IconDotsVertical,
  IconInfoCircle,
  IconSquareMinus,
  IconSquareCheck,
  IconSquare,
  IconActivity,
  IconCircleX,
  IconCircleCheck, IconTrash
} from '@tabler/icons-react';
import {
  ColumnFilterType,
  DataTableColumnHeader
} from '@/components/data-table';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { ISessionBriefDto } from '@/features/auth/dtos/session-brief-dto.ts';
import { UAParser } from 'ua-parser-js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { cn } from '@/lib/utils';
import { Link } from '@tanstack/react-router';


interface IOptions {
  disabled?: boolean;
  canDelete?: boolean;
  onRevokeClick?: (id: string) => void;
}

const columnHelper = createColumnHelper<ISessionBriefDto>();

export const sessionColumns = (options?: IOptions) => {
  const { disabled, canDelete, onRevokeClick } = options ?? {};

  return ([
    columnHelper.display({
      size: 24,
      id: 'select',
      enableSorting: false,
      meta: {
        label: 'Select',
        skeletonClassName: 'size-5 mx-1'
      },
      header: ({ table }) => (
        <div className="size-6 pr-2 flex items-center justify-center">
          <Checkbox
            disabled={disabled}
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="size-6 pr-2 flex items-center justify-center">
          <Checkbox
            disabled={disabled}
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(!!v)}
          />
        </div>
      )
    }),

    columnHelper.accessor('id', {
      header: ({ column }) => (<DataTableColumnHeader column={column}/>),
      cell: ({ getValue }) => (
        <span className="text-xs font-mono">
          {getValue()}
        </span>
      ),
      meta: {
        label: 'ID',
        icon: IconHash
      }
    }),

    columnHelper.accessor('userId', {
      header: ({ column }) => (<DataTableColumnHeader column={column}/>),
      cell: ({ getValue }) => (
        <span className="text-xs font-mono">
          {getValue()}
        </span>
      ),
      meta: {
        label: 'User ID',
        icon: IconUser,
        filter: { type: ColumnFilterType.Text }
      }
    }),

    columnHelper.accessor('userAgent', {
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Agent"/>,
      cell: ({ getValue }) => {
        const ua = getValue();
        if (!ua) return '—';

        const { os, browser, device } = UAParser(getValue() ?? '');
        const isMobile = device.type === 'mobile';
        const DeviceIcon = isMobile ? IconDeviceMobile : IconDeviceDesktop;
        const BrowserIcon = getBrowserIcon(browser.name);

        return (
          <div className="flex items-center gap-2 text-xs">
            <div className="leading-tight">
              <div className="flex gap-1 items-center">
                <BrowserIcon className="size-3 text-muted-foreground"/>
                <div>
                  {browser.name ?? 'Unknown'}{' '}
                  {browser.version?.split('.')[0]}
                </div>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <DeviceIcon className="size-3"/>
                <span>{os.name}</span>
              </div>
            </div>
          </div>
        );
      },
      meta: {
        label: 'Agent',
        icon: IconDeviceDesktop
      }
    }),

    columnHelper.accessor('ipAddress', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column}/>
      ),
      cell: ({ getValue }) => (
        <span className="text-xs">
          {getValue() ?? '—'}
        </span>
      ),
      meta: {
        label: 'IP address',
        icon: IconWorld,
        filter: { type: ColumnFilterType.Text }
      }
    }),

    columnHelper.accessor('createdAt', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column}/>
      ),
      cell: ({ getValue }) => (
        <span className="text-xs">
          {format(new Date(getValue()), 'dd.MM.yyyy - HH:mm')}
        </span>
      ),
      meta: {
        label: 'Created',
        icon: IconCalendar,
        filter: { type: ColumnFilterType.DateRange }
      }
    }),

    columnHelper.accessor('expiresAt', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column}/>
      ),
      cell: ({ getValue }) => (
        <span className="text-xs">
          {format(new Date(getValue()), 'dd.MM.yyyy - HH:mm')}
        </span>
      ),
      meta: {
        label: 'Expires',
        icon: IconClock,
        filter: { type: ColumnFilterType.DateRange }
      }
    }),

    columnHelper.accessor('expired', {
      size: 97,
      enableSorting: false,
      meta: {
        icon: IconActivity,
        label: 'Status',
        skeletonClassName: 'h-4 w-16'
      },
      header: ({ column }) => (<DataTableColumnHeader column={column}/>),
      cell: ({ cell }) => {
        const value = cell.getValue();

        return (
          <Badge variant={value ? 'destructive' : 'outline'} className="rounded-sm min-h-6">
            {value ? (<IconCircleX/>) : (<IconCircleCheck/>)}
            <span>{value ? 'Expired' : 'Alive'}</span>
          </Badge>
        );
      }
    }),

    columnHelper.display({
      id: 'type',
      size: 97,
      enableSorting: false,
      meta: {
        icon: IconInfoCircle,
        label: 'Type',
        skeletonClassName: 'h-4 w-16'
      },
      header: ({ column }) => (<DataTableColumnHeader column={column}/>),
      cell: ({ row }) => {
        const { isCurrent, isMine } = row.original;

        return (
          <Badge
            variant={isMine ? (isCurrent ? 'default' : 'secondary') : 'outline'}
            className={cn('rounded-sm min-h-6', (!isCurrent && isMine) && 'border border-border')}
          >
            {isMine ? (isCurrent ? (<IconSquareCheck/>) : (<IconSquareMinus/>)) : (<IconSquare/>)}
            <span>{isMine ? (isCurrent ? 'Current' : 'Mine') : 'External'}</span>
          </Badge>
        );
      }
    }),

    // Actions
    columnHelper.display({
      id: 'actions',
      size: 40,
      meta: {
        label: 'Actions',
        skeletonClassName: 'size-6 ml-auto'
      },
      cell: ({ row }) => {

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-xs" variant="ghost">
                <IconDotsVertical/>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator/>

              <DropdownMenuItem asChild>
                <Link to="/admin/users" search={{ id: row.original.userId }}>
                  <IconUser className="mr-2 size-4"/>
                  <span>User</span>
                </Link>
              </DropdownMenuItem>

              {(!!onRevokeClick && canDelete) && (
                <DropdownMenuItem
                  variant="destructive"
                  disabled={disabled}
                  onClick={() => onRevokeClick?.(row.original.id)}
                >
                  <IconTrash className="mr-2 size-4"/>
                  <span>Revoke</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    })
  ]);
};

function getBrowserIcon(name?: string) {
  switch (name?.toLowerCase()) {
    case 'chrome':
    case 'mobile chrome':
      return IconBrandChrome;
    case 'firefox':
    case 'mobile firefox':
      return IconBrandFirefox;
    case 'safari':
    case 'mobile safari':
      return IconBrandSafari;
    case 'edge':
      return IconBrandEdge;
    case 'opera':
    case 'mobile opera':
      return IconBrandOpera;
    default:
      return IconQuestionMark;
  }
}