import { createServerFn } from '@tanstack/react-start';
import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { prisma } from '@/lib/prisma.ts';
import { getLocale } from '@/paraglide/runtime';
import { INotificationBriefDto, NotificationBriefDtoMapper } from '@/features/notifications/dtos/notification-dto.ts';
import { createNotificationSchema } from '@/features/notifications/schemas/create-notification.ts';
import { requireAuth } from '@/middleware/require-auth.ts';
import { serverZodValidator } from '@/features/shared/utils/server-zod-validator.ts';
import { auth } from '@/features/auth/lib/auth.ts';
import { Permission } from '@/features/auth/lib/permissions.ts';
import { throwForbiddenError, throwUnauthorizedError } from '@/features/shared/utils/throw-api-error.ts';
import { getSessionServerFn } from '@/features/auth/server-functions/get-session.ts';



export const createNotificationServerFn = createServerFn({ method: 'POST' })
  .inputValidator(serverZodValidator(createNotificationSchema))
  .middleware([requireAuth()])
  .handler(async ({ data }) => {
    const locale = getLocale();
    const session = await getSessionServerFn();
    if (!session)
      throwUnauthorizedError();

    const canCreate = await auth.api.userHasPermission({
      body: {
        userId: session.user!.id,
        permission: { "notifications": [Permission.Create] }
      },
    });

    console.log(session, canCreate);

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
