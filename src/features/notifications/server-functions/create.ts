import { createServerFn } from '@tanstack/react-start';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { prisma } from '@/lib/db/prisma.ts';
import { getLocale } from '@/paraglide/runtime';
import { INotificationBriefDto, NotificationBriefDtoFactory } from '@/features/notifications/dtos/notification-dto.ts';
import { createNotificationSchema } from '@/features/notifications/schemas/create-notification.ts';
import { authMiddleware } from '@/middleware/auth.ts';
import { serverZodValidator } from '@/lib/zod/server-zod-validator.ts';
import { auth } from '@/lib/auth/auth.ts';
import { Permission } from '@/lib/auth/permissions.ts';
import { throwForbiddenError } from '@/lib/errors/throw-api-error.ts';



export const createNotificationServerFn = createServerFn({ method: 'POST' })
  .inputValidator(serverZodValidator(createNotificationSchema))
  .middleware([authMiddleware()])
  .handler(async ({ data, context: { user } }) => {
    const locale = getLocale();
    const canCreate = await auth.api.userHasPermission({
      body: {
        userId: user!.id,
        permission: { notification: [Permission.Create] }
      },
    });

    if (!canCreate.success)
      throwForbiddenError();

    const createdEntity = await prisma.notification.create({
      data: {
        nameRo: data.nameRo,
        nameRu: data.nameRu,
        textRo: data.textRo,
        textRu: data.textRu
      }
    });

    return NotificationBriefDtoFactory.fromEntity(createdEntity, locale);
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
