import {
  NotificationBriefDtoFactory,
  TNotificationBriefDto
} from '@/features/notifications/dtos/notification-dto.ts';
import { type } from '@orpc/server';
import {
  createNotificationSchema,
} from '@/features/notifications/schemas/create-notification.ts';
import { getLocale } from '@/paraglide/runtime';
import { prisma } from '@/lib/db/prisma.ts';
import { auth } from '@/lib/auth/auth.ts';
import { Permission } from '@/lib/auth/permissions.ts';
import { authMiddleware } from '@/features/shared/orpc/middlewares/auth.ts';
import { notificationsAdminBase } from '@/features/notifications/routes/admin/base.ts';


export const createNotification = notificationsAdminBase
  .route({
    method: 'POST',
    summary: 'Create notification',
    description: 'Create a new notification',
  })
  .use(authMiddleware)
  .input(createNotificationSchema)
  .output(type<TNotificationBriefDto>())
  .errors({
    FORBIDDEN: { message: 'User does not have permission to create notifications' }
  })
  .handler(async ({ input, errors, context: { user } }) => {
    const locale = getLocale();

    const canCreate = await auth.api.userHasPermission({
      body: {
        userId: user.id,
        permission: { notification: [Permission.Create] },
      },
    });

    if (!canCreate.success)
      throw errors.FORBIDDEN();

    const createdEntity = await prisma.notification.create({
      data: {
        nameRo: input.nameRo,
        nameRu: input.nameRu,
        textRo: input.textRo,
        textRu: input.textRu,
      },
    });

    return NotificationBriefDtoFactory.fromEntity(
      createdEntity,
      locale,
    );
  });