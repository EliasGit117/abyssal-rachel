import { createFileRoute } from '@tanstack/react-router';
import { getAllNotificationsQueryOptions } from '@/features/notifications/server-functions/get-all.ts';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { ComponentProps, FC, useState } from 'react';
import { cn } from '@/lib/utils.ts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import {
  createNotificationSchema,
  useCreateNotificationMutation
} from '@/features/notifications/server-functions/create.ts';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input';
import { LoadingButton } from '@/components/ui/loading-button.tsx';
import { IconPlus, IconProgressAlert, IconSend, IconTrash } from '@tabler/icons-react';
import { toast } from 'sonner';
import { useDeleteNotificationByIdMutation } from '@/features/notifications/server-functions/delete.ts';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty.tsx';
import { Button } from '@/components/ui/button.tsx';
import { m } from '@/paraglide/messages';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';


export const Route = createFileRoute('/_public/notifications')({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    return queryClient.prefetchQuery(getAllNotificationsQueryOptions());
  }
});

function RouteComponent() {


  return (
    <main className="container mx-auto p-4 space-y-4 min-h-safe-screen">
      <header>
        <h1 className="text-2xl font-bold">
          {m['pages.notifications.title']()}
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <NotificationListSection className="order-2 lg:order-1"/>
        <CreateNotificationCard className="order-1 lg:order-2"/>
      </div>
    </main>
  );
}

const CreateNotificationCard: FC<ComponentProps<typeof Card>> = ({ ...props }) => {
  const form = useForm<z.infer<typeof createNotificationSchema>>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      nameRo: '',
      nameRu: '',
      textRo: '',
      textRu: ''
    }
  });

  const { mutate: create, isPending: isPendingCreation } = useCreateNotificationMutation({
    onError: (e) => {
      toast.error(m['common.error'](), { description: e.message });
    },
    onSuccess: () => {
      form.reset();
      toast.success(m['common.success']());
    }
  });

  const onSubmit = (data: z.infer<typeof createNotificationSchema>) => create(data);


  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>
          {m['pages.notifications.create_form.title']()}
        </CardTitle>
        <CardDescription>
          {m['pages.notifications.create_form.description']()}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} id="create-notifictaion-form">
          <fieldset disabled={isPendingCreation}>
            <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="nameRo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name-ro-input">
                      {m['pages.notifications.create_form.name']()} RO
                    </FieldLabel>
                    <Input {...field} id="name-ro-input" aria-invalid={fieldState.invalid}/>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                  </Field>
                )}
              />

              <Controller
                name="nameRu"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                      {m['pages.notifications.create_form.name']()} RU
                    </FieldLabel>
                    <Input{...field} aria-invalid={fieldState.invalid}/>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                  </Field>
                )}
              />

              <Controller
                name="textRo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="col-span-full sm:col-span-1">
                    <FieldLabel>
                      {m['pages.notifications.create_form.text']()} RO
                    </FieldLabel>
                    <Textarea {...field} className='min-h-36' aria-invalid={fieldState.invalid}/>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                  </Field>
                )}
              />

              <Controller
                name="textRu"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="col-span-full sm:col-span-1">
                    <FieldLabel>
                      {m['pages.notifications.create_form.text']()} RU
                    </FieldLabel>
                    <Textarea {...field} className='min-h-36' aria-invalid={fieldState.invalid}/>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                  </Field>
                )}
              />
            </FieldGroup>
          </fieldset>
        </form>
      </CardContent>

      <CardFooter className="sm:justify-end">
        <LoadingButton loading={isPendingCreation} className="w-full sm:w-fit" form="create-notifictaion-form">
          <IconSend/>
          <span>{m['common.submit']()}</span>
        </LoadingButton>
      </CardFooter>
    </Card>
  );
};

const NotificationListSection: FC<ComponentProps<'section'>> = ({ className, ...props }) => {
  const { isPending: isPendingNotifications, data: notifications } = useQuery({
    ...getAllNotificationsQueryOptions(),
    placeholderData: keepPreviousData
  });
  const [deletion, setDeletion] = useState<Record<number, boolean>>({});

  const { mutateAsync: deleteNotification } = useDeleteNotificationByIdMutation({
    onSuccess: () => toast.success(m['common.success']()),
    onError: (e) => {
      toast.error('Error', { description: e.message ?? 'Failed to delete notification' });
    },
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
        Array.from([1, 2, 3, 4, 5]).map((_, i) => (
          <Item variant="outline" key={i}>
            <ItemContent>
              <ItemTitle className="w-full">
                <Skeleton className="h-4 w-full max-w-32"/>
              </ItemTitle>
              <ItemDescription className="flex flex-col gap-1">
                <Skeleton className="h-4 w-full max-w-64"/>
                <Skeleton className="h-4 w-full max-w-64"/>
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Skeleton className="h-8 w-16"/>
            </ItemActions>
          </Item>
        ))
      ) : ((notifications && notifications?.length > 0) ? (
          notifications?.map((notification) => (
            <Item variant="outline" key={notification.id}>
              <ItemContent>
                <ItemTitle>{notification.name}</ItemTitle>
                <ItemDescription>{notification.text}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <LoadingButton
                      hideText
                      size='icon-sm'
                      variant="outline"
                      loading={deletion[notification.id]}
                      onClick={() => handleDelete(notification.id)}
                    >
                      <IconTrash/>
                      <span className='sr-only'>
                        {m['common.delete']()}
                      </span>
                    </LoadingButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    {m['common.delete']()}
                  </TooltipContent>
                </Tooltip>
              </ItemActions>
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
                <EmptyDescription>
                  {m['pages.notifications.empty.description']()}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <div className="flex gap-2">
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
                </div>
              </EmptyContent>
            </Empty>
          </div>
        )
      )}
    </section>
  );
};