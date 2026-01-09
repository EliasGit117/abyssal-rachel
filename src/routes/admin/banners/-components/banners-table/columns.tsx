import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import {
  IconCalendarClock,
  IconCalendarPlus,
  IconCheck,
  IconDotsVertical,
  IconHash,
  IconHeading,
  IconPhoto,
  IconPhotoOff,
  IconLink,
  IconListNumbers,
  IconDeviceDesktop,
  IconPencil,
  IconDeviceMobile,
  IconDeviceTablet,
  IconX
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  ColumnFilterType,
  DataTableColumnHeader
} from '@/components/data-table';
import { Link, useNavigate } from '@tanstack/react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';

const columnHelper = createColumnHelper<any>();

interface IBannerColumnsOptions {
  disabled?: boolean;
}

export const bannerColumns = (options?: IBannerColumnsOptions) => {
  const { disabled } = options ?? {};

  return [
    columnHelper.display({
      id: 'select',
      size: 32,
      enableSorting: false,
      enableHiding: false,
      header: ({ table }) => (
        <Checkbox
          disabled={disabled}
          aria-label="Select all"
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          disabled={disabled}
          aria-label="Select row"
          className="translate-y-0.5 mr-2"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      meta: {
        label: 'Select',
        skeletonClassName: 'w-6 h-6'
      }
    }),
    columnHelper.accessor('id', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: (ctx) => ctx.getValue(),
      meta: {
        label: 'Id',
        key: 'idRange',
        icon: IconHash,
        skeletonClassName: 'h-6 w-8',
        filter: {
          type: ColumnFilterType.NumberRange,
          min: 1,
          max: 5000,
        }
      }
    }),
    columnHelper.accessor('order', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: (ctx) => ctx.getValue(),
      meta: {
        label: 'Order',
        icon: IconListNumbers,
        skeletonClassName: 'h-6 w-8'
      }
    }),
    columnHelper.accessor(row => row, {
      id: 'images',
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: (ctx) => {
        const { desktopImage, tabletImage, mobileImage } = ctx.row.original;

        const renderImage = (img: any, label: string, className: string) => {
          if (!img)
            return (
              <div
                className={`${className} rounded-sm bg-muted text-muted-foreground/50 border justify-center items-center flex`}
                title={`${label} — No image`}
              >
                <IconPhotoOff className="size-5" />
              </div>
            );

          return (
            <figure
              className={`${className} rounded-sm overflow-hidden border border-border/50 bg-muted`}
              title={label}
            >
              <img
                src={img.url}
                className="w-full h-full object-cover"
                alt={`${label} banner`}
              />
            </figure>
          );
        };

        return (
          <div className="flex gap-2 items-center">
            {renderImage(desktopImage, 'Desktop', 'w-28 h-12')}
            {renderImage(tabletImage, 'Tablet', 'w-24 h-12')}
            {renderImage(mobileImage, 'Mobile', 'w-20 h-12')}
          </div>
        );
      },
      meta: {
        label: 'Images',
        icon: IconPhoto,
        key: 'images',
        filter: {
          type: ColumnFilterType.MultiSelect,
          options: [
            { title: 'Has desktop', value: 'desktop', icon: IconDeviceDesktop },
            { title: 'Has tablet', value: 'tablet', icon: IconDeviceTablet },
            { title: 'Has mobile', value: 'mobile', icon: IconDeviceMobile }
          ]
        },
        skeletonItem: (
          <div className="flex gap-2 items-center">
            <Skeleton className="w-28 h-11" />
            <Skeleton className="w-24 h-11" />
            <Skeleton className="w-20 h-11" />
          </div>
        )
      }
    }),
    columnHelper.accessor('path', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: (ctx) => (
        <p className="text-xs italic">{ctx.getValue() || '-'}</p>
      ),
      meta: {
        label: 'Path',
        icon: IconLink,
        skeletonClassName: 'h-6 w-32',
        filter: {
          type: ColumnFilterType.Text,
          placeholder: 'Search by path'
        }
      }
    }),
    columnHelper.accessor('title', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: (ctx) => <p className="text-xs">{ctx.getValue()}</p>,
      meta: {
        label: 'Title',
        icon: IconHeading,
        skeletonClassName: 'h-6 w-32',
        filter: {
          type: ColumnFilterType.Text,
          placeholder: 'Search by title'
        }
      }
    }),
    columnHelper.accessor('isActive', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: ({ getValue }) => (
        <Badge variant="outline" className="gap-2 py-1 px-2 m-0">
          {getValue() ? (
            <IconCheck className="size-3.5" />
          ) : (
            <IconX className="size-3.5" />
          )}
          <span>{getValue() ? 'Active' : 'Inactive'}</span>
        </Badge>
      ),
      meta: {
        label: 'Is active',
        icon: IconCheck,
        skeletonClassName: 'h-6 w-20',
        filter: {
          type: ColumnFilterType.Select,
          options: [
            { title: 'Active', value: true, icon: IconCheck },
            { title: 'Inactive', value: false, icon: IconX }
          ]
        }
      }
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: (ctx) => (
        <span className="text-xs">
          {format(ctx.getValue(), 'dd.MM.yyyy - HH:mm')}
        </span>
      ),
      meta: {
        label: 'Created',
        icon: IconCalendarPlus,
        skeletonClassName: 'h-6 w-26',
        filter: {
          type: ColumnFilterType.DateRange
        }
      }
    }),
    columnHelper.accessor('updatedAt', {
      header: ({ column }) => <DataTableColumnHeader column={column} />,
      cell: (ctx) => (
        <span className="text-xs">
          {format(ctx.getValue(), 'dd.MM.yyyy - HH:mm')}
        </span>
      ),
      meta: {
        label: 'Updated',
        icon: IconCalendarClock,
        skeletonClassName: 'h-6 w-26',
        filter: {
          type: ColumnFilterType.DateRange
        }
      }
    }),
    columnHelper.display({
      id: 'actions',
      size: 44,
      meta: {
        label: 'Actions',
        skeletonClassName: 'h-7 w-7 ml-auto'
      },
      cell: (ctx) => {
        const navigate = useNavigate();
        const id = ctx.row.getValue<number>('id');
        const path = ctx.row.getValue<string | null>('path');

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon-xs" variant="ghost">
                  <IconDotsVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  {path && (
                    <DropdownMenuItem onClick={() => navigate({ to: path })}>
                      <span>Go to page</span>
                      <IconLink className="ml-auto size-4" />
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem asChild>
                    <Link to="/" params={{ id: `${id}` }}>
                      <span>Edit</span>
                      <IconPencil className="ml-auto size-4" />
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }
    })
  ];
};
