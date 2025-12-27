import { createFileRoute } from '@tanstack/react-router';
import { getAllNotificationsQueryOptions } from '@/features/notifications/server-functions/get-all.ts';
import { useQuery } from '@tanstack/react-query';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { ComponentProps, FC, useState } from 'react';
import { cn } from '@/lib/utils.ts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import {
  createNotificationSchema,
  useCreateNotificationMutation
} from '@/features/notifications/server-functions/create.ts';
import { z } from 'zod';
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
        <h1 className="text-2xl font-bold">Notifications</h1>
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
      toast.error('Error', { description: e.message ?? 'An unexpected error occurred' });
    },
    onSuccess: () => {
      form.reset();
      toast.success('Success', { description: 'Notification created successfully' });
    }
  });

  function onSubmit(data: z.infer<typeof createNotificationSchema>) {
    create(data);
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create notification</CardTitle>
        <CardDescription>
          Fill in the details of your notification to create a new one
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
                    <FieldLabel htmlFor="name-ro-input">Name RO</FieldLabel>
                    <Input {...field} id='name-ro-input' aria-invalid={fieldState.invalid}/>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                  </Field>
                )}
              />

              <Controller
                name="nameRu"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Name RU</FieldLabel>
                    <Input{...field} aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                  </Field>
                )}
              />

              <Controller
                name="textRo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="col-span-full">
                    <FieldLabel>Text RO</FieldLabel>
                    <Textarea {...field} aria-invalid={fieldState.invalid}/>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                  </Field>
                )}
              />

              <Controller
                name="textRu"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="col-span-full">
                    <FieldLabel>Text RU</FieldLabel>
                    <Textarea {...field} aria-invalid={fieldState.invalid}/>
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
          <span>Submit</span>
        </LoadingButton>
      </CardFooter>
    </Card>
  );
};

const NotificationListSection: FC<ComponentProps<'section'>> = ({ className, ...props }) => {
  const { isPending: isPendingNotifications, data: notifications } = useQuery({ ...getAllNotificationsQueryOptions() });
  const [deletion, setDeletion] = useState<Record<number, boolean>>({});

  const { mutateAsync: deleteNotification } = useDeleteNotificationByIdMutation({
    onError: (e) => {
      toast.error('Error', {
        description: e.message ?? 'Failed to delete notification'
      });
    },
    onSuccess: () => {
      toast.success('Success', {
        description: 'Notification deleted successfully'
      });
    }
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
                <ItemDescription>{notification.description}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <LoadingButton
                  variant="outline"
                  loadingText="Deleting..."
                  loading={deletion[notification.id]}
                  onClick={() => handleDelete(notification.id)}
                >
                  <IconTrash/>
                  <span>Delete</span>
                </LoadingButton>
              </ItemActions>
            </Item>
          ))) : (
          <div className="flex items-center justify-center h-full">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconProgressAlert/>
                </EmptyMedia>
                <EmptyTitle>No notifications</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t created any notifications yet. Get started by creating your first notification.
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
                    <span>Create notification</span>
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