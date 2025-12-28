import { createServerFn } from '@tanstack/react-start';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { prisma } from '@/lib/prisma.ts';
import { getLocale } from '@/paraglide/runtime';
import { INotificationBriefDto, NotificationBriefDtoMapper } from '@/features/notifications/dtos/notification-dto.ts';
import { createNotificationSchema } from '@/features/notifications/schemas/create-notification.ts';


export const createNotificationServerFn = createServerFn({ method: 'POST' })
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

    return NotificationBriefDtoMapper.fromEntity(createdEntity, locale);
  });

// React hook
type TParams = Parameters<typeof createNotificationServerFn>[0]['data'];
type TOptions = Omit<UseMutationOptions<INotificationBriefDto, Error, TParams>, 'mutationFn' | 'onMutate'>;

export const useCreateNotificationMutation = (options?: TOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values) => createNotificationServerFn({ data: values }),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'notifications' });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    }
  });
};
