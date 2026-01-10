import { ComponentProps, FC } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { cn } from '@/lib/utils.ts';
import { IconSend } from '@tabler/icons-react';
import { Controller, useForm } from 'react-hook-form';
import { LoadingButton } from '@/components/ui/loading-button.tsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authClient } from '@/features/auth/lib/auth-client.ts';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { m } from '@/paraglide/messages';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field.tsx';
import { Input } from '@/components/ui/input.tsx';
import * as z from 'zod';
import { useSession } from '@/hooks/use-session.ts';
import { getSessionQueryOptions } from '@/features/auth/server-functions/public/get-session.ts';

export const editNameSchema = z.object({
  fullName: z.string().min(3),
});

export type TEditNameSchema = z.infer<typeof editNameSchema>;

const ENGLISH_MESSAGES = {
  title: 'Edit Name',
  description: 'Update your first and last name',
  fullName: 'Full Name',
  submit: 'Save Changes',
  successMessage: 'Name updated successfully',
  error: 'Error',
};

interface IProps extends ComponentProps<typeof Card> {
  type?: 'centered' | 'default';
  translated?: boolean;
  defaultValues?: Partial<TEditNameSchema>;
}

export const EditNameCard: FC<IProps> = ({ className, type, translated = true, defaultValues, ...props }) => {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const getText = (
    key: keyof typeof ENGLISH_MESSAGES,
    fallback: string = ''
  ) => {
    if (!translated)
      return ENGLISH_MESSAGES[key];

    switch (key) {
      case 'title':
        return m['components.edit_name_card.form_title']();
      case 'description':
        return m['components.edit_name_card.form_description']();
      case 'fullName':
        return m['common.full_name']();
      case 'submit':
        return m['common.submit']();
      case 'successMessage':
        return m['components.edit_name_card.success_message']();
      case 'error':
        return m['common.error']();
      default:
        return fallback;
    }
  };

  const form = useForm<TEditNameSchema>({
    resolver: zodResolver(editNameSchema),
    defaultValues: {
      fullName: defaultValues?.fullName ?? '',
    },
  });

  const { mutate: updateName, isPending } = useMutation({
    mutationFn: (data: TEditNameSchema) =>
      authClient.updateUser({ name: data.fullName, }),
    onSuccess: (res) => {
      if (!res.error) {
        toast.success(getText('successMessage'));
        void queryClient.invalidateQueries({ queryKey: getSessionQueryOptions().queryKey });
        form.reset();
        return;
      }
      throw new Error(res.error.message);
    },
    onError: (e) => {
      toast.error(getText('error'), { description: e.message });
    },
  });

  const onSubmit = (data: TEditNameSchema) => updateName(data);

  return (
    <Card className={cn('w-full max-w-sm @container', className)} {...props}>
      <CardHeader className={cn(type === 'centered' && 'text-center')}>
        <CardTitle className="text-xl">{getText('title')}</CardTitle>
        <CardDescription>{getText('description')}</CardDescription>
      </CardHeader>

      <CardContent>
        <form id="edit-name-form" onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={isPending}>
            <FieldGroup>
              <Controller
                name="fullName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="first-name-input">
                      {getText('fullName')}
                    </FieldLabel>
                    <Input
                      {...field}
                      id="first-name-input"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder={user?.name ?? 'Alex Mason'}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </fieldset>
        </form>
      </CardContent>

      <CardFooter>
        <LoadingButton
          className="w-full @md:w-auto @md:ml-auto"
          loading={isPending}
          form="edit-name-form"
        >
          <IconSend />
          <span>{getText('submit')}</span>
        </LoadingButton>
      </CardFooter>
    </Card>
  );
};