import { ComponentProps, FC, useState } from 'react';
import { getAllNotificationsQueryOptions } from '@/features/notifications/server-functions/get-all.ts';
import { useDeleteNotificationByIdMutation } from '@/features/notifications/server-functions/delete-by-id.ts';
import { toast } from 'sonner';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item.tsx';
import { cn } from '@/lib/utils.ts';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { LoadingButton } from '@/components/ui/loading-button.tsx';
import { IconPlus, IconProgressAlert, IconRefresh, IconTrash } from '@tabler/icons-react';
import { m } from '@/paraglide/messages';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Permission } from '@/features/auth/lib/permissions.ts';
import { useHasPermission } from '@/hooks/use-has-permission.ts';


export const NotificationListSection: FC<ComponentProps<'section'>> = ({ className, ...props }) => {
  const permissions = useHasPermission({
    canCreate: { notification: [Permission.Create] },
    canDelete: { notification: [Permission.Delete] },
  });

  const [deletion, setDeletion] = useState<Record<number, boolean>>({});
  const { isLoading: isPendingNotifications, isFetching, data: notifications, refetch } = useQuery({
    ...getAllNotificationsQueryOptions(),
    placeholderData: keepPreviousData
  });

  const { mutateAsync: deleteNotification } = useDeleteNotificationByIdMutation({
    onError: (e) => toast.error(e.name, { description: e.message })
  });

  const handleDelete = (id: number) => {
    setDeletion((prev) => ({ ...prev, [id]: true }));
    deleteNotification({ id: id })
      .finally(() => {
        setDeletion((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      });
  };

  return (
    <section className={cn('space-y-2', className)} {...props}>
      {isPendingNotifications ? (
        Array.from({ length: 5 }).map((_, i) => (
          <Item variant="outline" key={i}>
            <ItemContent>
              <div className="w-full">
                <Skeleton className="h-3.5 w-full max-w-32"/>
              </div>
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3.5 w-full max-w-64"/>
              </div>
            </ItemContent>
            <ItemActions>
              <Skeleton className="size-9"/>
            </ItemActions>
          </Item>
        ))
      ) : ((notifications && notifications?.length > 0) ? (
          notifications?.map((notification) => (
            <Item variant="outline" key={notification.id}>
              <ItemContent>
                <ItemTitle>
                  {notification.name}
                </ItemTitle>
                <ItemDescription>
                  {notification.text}
                </ItemDescription>
              </ItemContent>
              {permissions.canCreate && (
                <ItemActions>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <LoadingButton
                        hideText
                        size="icon"
                        variant="outline"
                        loading={deletion[notification.id]}
                        onClick={() => handleDelete(notification.id)}
                      >
                        <IconTrash/>
                        <span className="sr-only">
                          {m['common.delete']()}
                        </span>
                      </LoadingButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      {m['common.delete']()}
                    </TooltipContent>
                  </Tooltip>
                </ItemActions>
              )}
            </Item>
          ))) : (
          <div className="flex items-center justify-center h-full">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconProgressAlert/>
                </EmptyMedia>
                <EmptyTitle>
                  {m['pages.notifications.empty.title']()}
                </EmptyTitle>
                {permissions.canCreate && (
                  <EmptyDescription>
                    {m['pages.notifications.empty.description']()}
                  </EmptyDescription>
                )}
              </EmptyHeader>
              <EmptyContent>
                <div className="flex gap-2">
                  {permissions.canCreate && (
                    <Button
                      onClick={() => {
                        const el = document.getElementById('name-ro-input');
                        el?.scrollIntoView();
                        el?.focus();
                      }}
                    >
                      <IconPlus/>
                      <span>{m['common.create']()}</span>
                    </Button>
                  )}
                  <LoadingButton variant='outline' loading={isFetching} onClick={() => refetch()}>
                    <IconRefresh/>
                    <span>{m['common.refresh']()}</span>
                  </LoadingButton>
                </div>
              </EmptyContent>
            </Empty>
          </div>
        )
      )}
    </section>
  );
};