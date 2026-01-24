import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  IconBan,
  IconCalendarPlus,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconDotsVertical,
  IconHash,
  IconMail,
  IconMailCheck,
  IconMailX,
  IconNetwork,
  IconPolaroid,
  IconShield,
  IconTrash,
  IconUser
} from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ColumnFilterType, DataTableColumnHeader } from '@/components/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { TUserBriefDto } from '@/features/auth/dtos/user-brief-dto.ts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Link } from '@tanstack/react-router';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.tsx';


interface IOptions {
  disabled?: boolean;
  canDelete?: boolean;
  currentUserId?: string;
  onDeleteClick?: (id: string) => void;
}

const columnHelper = createColumnHelper<TUserBriefDto>();
export const userColumns = (options?: IOptions) => {
  const { disabled, canDelete, onDeleteClick, currentUserId } = options ?? {};

  return [
    // Select
    columnHelper.display({
      size: 24,
      id: 'select',
      enableSorting: false,
      meta: {
        label: 'Select',
        skeletonClassName: 'size-5 mx-1'
      },
      header: () => null,
      cell: ({ row, table }) => {
        const rowId = row.id;
        const selectedRowId = Object.keys(table.getState().rowSelection)[0] ?? '';
        const isCurrentUser = currentUserId === row.getValue('id');

        return (
          <RadioGroup
            disabled={isCurrentUser || disabled}
            value={selectedRowId}
            onValueChange={(value) => {
              if (value === selectedRowId) {
                table.resetRowSelection();
                return;
              }

              table.resetRowSelection();
              row.toggleSelected(true);
            }}
          >
            <RadioGroupItem
              value={rowId}
              onClick={() => {
                if (selectedRowId !== rowId)
                  return;

                table.resetRowSelection();
              }}
            />
          </RadioGroup>
        );
      }
    }),

    // ID
    columnHelper.accessor('id', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column}/>
      ),
      cell: ({ getValue }) => (
        <p className="text-xs font-mono">{getValue()}</p>
      ),
      meta: {
        label: 'ID',
        icon: IconHash,
        skeletonClassName: 'h-6 w-10',
        filter: {
          type: ColumnFilterType.Text,
          placeholder: 'Search by id',
        }
      },
    }),

    // Avatar
    columnHelper.accessor('imageUrl', {
      size: 28,
      enableSorting: false,
      header: ({}) => null,
      cell: ({ getValue, row }) => {
        const imageUrl = getValue();
        const name = row.getValue<string>('name');
        const initials = name
          ?.split(' ')
          .map((n) => n[0])
          .join('');

        return (
          <Avatar className="size-7">
            <AvatarImage src={imageUrl ?? ''} alt={initials}/>
            <AvatarFallback className="text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        );
      },
      meta: {
        icon: IconPolaroid,
        skeletonItem: <Skeleton className="size-7 rounded-full"/>
      }
    }),

    // Name
    columnHelper.accessor('name', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column}/>
      ),
      cell: ({ getValue }) => (
        <span className="text-xs">{getValue() || '-'}</span>
      ),
      meta: {
        label: 'Name',
        icon: IconUser,
        skeletonClassName: 'h-6 w-28',
        filter: { type: ColumnFilterType.Text }
      }
    }),

    // Email
    columnHelper.accessor('email', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column}/>
      ),
      cell: ({ getValue }) => (
        <span className="text-xs">{getValue()}</span>
      ),
      meta: {
        label: 'Email',
        icon: IconMail,
        skeletonClassName: 'h-6 w-36',
        filter: { type: ColumnFilterType.Text }
      }
    }),

    // Email verified
    columnHelper.accessor('emailVerified', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column}/>
      ),
      cell: ({ getValue }) => (
        <Badge variant="outline" className="rounded-sm min-h-6">
          {getValue() ? (
            <>
              <IconCircleCheck/>
              <span>Verified</span>
            </>
          ) : (
            <>
              <IconCircleX/>
              <span>Unverified</span>
            </>
          )}
        </Badge>
      ),
      meta: {
        label: 'Email verified',
        icon: IconMailCheck,
        skeletonClassName: 'h-6 w-24',
        filter: {
          type: ColumnFilterType.Select,
          options: [
            { icon: IconMailCheck, title: 'Yes', value: true },
            { icon: IconMailX, title: 'No', value: false }
          ]
        }
      }
    }),

    // Role
    columnHelper.accessor('role', {
      enableColumnFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Roles"
        />
      ),
      cell: ({ getValue }) => {
        const roles = getValue()?.split(',');

        return roles ? (
          roles.map((role) => (
            <Badge
              key={role}
              variant="outline"
              className="rounded-sm min-h-6 capitalize"
            >
              {role}
            </Badge>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">
            —
          </span>
        );
      },
      meta: {
        label: 'Role',
        icon: IconShield,
        skeletonClassName: 'h-6 w-20',
        filter: { type: ColumnFilterType.Text }
      }
    }),

    // Status
    columnHelper.accessor('isBanned', {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Status"
        />
      ),
      cell: ({ getValue }) => (
        <Badge
          variant={getValue() ? 'destructive' : 'outline'}
          className="rounded-sm min-h-6"
        >
          {getValue() ? (
            <>
              <IconBan/>
              <span>Banned</span>
            </>
          ) : (
            <>
              <IconCircleCheck/>
              <span>Active</span>
            </>
          )}
        </Badge>
      ),
      meta: {
        key: 'banned',
        label: 'Banned',
        icon: IconBan,
        skeletonClassName: 'h-6 w-20',
        filter: {
          type: ColumnFilterType.Select,
          options: [
            { title: 'Banned', value: true },
            { title: 'Active', value: false }
          ]
        }
      }
    }),

    // Created
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
        icon: IconCalendarPlus,
        skeletonClassName: 'h-6 w-24',
        filter: { type: ColumnFilterType.DateRange }
      }
    }),

    // Updated
    columnHelper.accessor('updatedAt', {
      header: ({ column }) => (
        <DataTableColumnHeader column={column}/>
      ),
      cell: ({ getValue }) => (
        <span className="text-xs">
          {format(new Date(getValue()), 'dd.MM.yyyy - HH:mm')}
        </span>
      ),
      meta: {
        label: 'Updated',
        icon: IconClock,
        skeletonClassName: 'h-6 w-24',
        filter: { type: ColumnFilterType.DateRange }
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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator/>

              <DropdownMenuItem asChild>
                <Link to="/admin/sessions" search={{ userId: row.original.id }}>
                  <IconNetwork className="mr-2 size-4"/>
                  <span>Sessions</span>
                </Link>
              </DropdownMenuItem>

              {(!!onDeleteClick && canDelete) && (
                <DropdownMenuItem
                  variant="destructive"
                  disabled={disabled}
                  onClick={() => onDeleteClick?.(row.getValue<string>('id'))}
                >
                  <IconTrash className="mr-2 size-4"/>
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    })
  ];
};