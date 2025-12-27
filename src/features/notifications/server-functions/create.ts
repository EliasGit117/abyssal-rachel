import { createServerFn } from '@tanstack/react-start';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { prisma } from '@/lib/prisma.ts';
import { getLocale } from '@/paraglide/runtime';
import { INotificationDto } from '@/features/notifications/dtos/notification-dto.ts';

export const createNotificationSchema = z.object({
  nameRo: z.string().min(1),
  nameRu: z.string().min(1),
  textRo: z.string().min(1),
  textRu: z.string().min(1)
});

export const createNotification = createServerFn({ method: 'POST' })
  .inputValidator(createNotificationSchema)
  .handler(async ({ data }) => {
    const locale = getLocale();
    const createdEntity = await prisma.notification.create({
      data: {
        nameRo: data.nameRo,
        nameRu: data.nameRu,
        textRo: data.textRo,
        textRu: data.textRu
      }
    });

    return {
      id: createdEntity.id,
      name: locale === 'ro' ? createdEntity.nameRo : createdEntity.nameRu,
      text: locale === 'ro' ? createdEntity.textRo : createdEntity.textRu
    } satisfies INotificationDto;
  });

// React hook
type TParams = Parameters<typeof createNotification>[0]['data'];
type TOptions = Omit<UseMutationOptions<INotificationDto, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useCreateNotificationMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values) => createNotification({ data: values }),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'notifications' });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};
