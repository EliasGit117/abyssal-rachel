import { ComponentProps, FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { toast } from 'sonner';
import {
  createNotificationSchema,
  TCreateNotificationSchema
} from '@/features/notifications/schemas/create-notification';
import { m } from '@/paraglide/messages';
import { Controller, useForm } from 'react-hook-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { LoadingButton } from '@/components/ui/loading-button.tsx';
import { IconSend } from '@tabler/icons-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateNotificationMutation } from '@/features/notifications/hooks/create-notification.ts';
import * as z from 'zod';


export const CreateNotificationCard: FC<ComponentProps<typeof Card>> = ({ ...props }) => {
  const form = useForm<TCreateNotificationSchema>({
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
      toast.error(e.name, { description: e.message });
    },
    onSuccess: () => {
      form.reset();
      toast.success(m['common.success']());
    }
  });

  const onSubmit = (data: z.infer<typeof createNotificationSchema>) => {
    create(data);
  };

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
        <form onSubmit={form.handleSubmit(onSubmit)} id="create-notification-form" method="post">
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
                    <Textarea {...field} className="min-h-36" aria-invalid={fieldState.invalid}/>
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
                    <Textarea {...field} className="min-h-36" aria-invalid={fieldState.invalid}/>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                  </Field>
                )}
              />
            </FieldGroup>
          </fieldset>
        </form>
      </CardContent>

      <CardFooter className="sm:justify-end">
        <LoadingButton loading={isPendingCreation} className="w-full sm:w-fit" form="create-notification-form">
          <IconSend/>
          <span>{m['common.submit']()}</span>
        </LoadingButton>
      </CardFooter>
    </Card>
  );
};
