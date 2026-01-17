import { notificationsBase } from './base';
import {
  NotificationBriefDtoFactory,
  INotificationBriefDto
} from '@/features/notifications/dtos/notification-dto';
import { type } from '@orpc/server';
import {
  createNotificationSchema,
} from '@/features/notifications/schemas/create-notification';
import { getLocale } from '@/paraglide/runtime';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@/lib/auth/auth';
import { Permission } from '@/lib/auth/permissions';
import { authMiddleware } from '@/features/shared/orpc/middlewares/auth.ts';


export const createNotification = notificationsBase
  .route({
    method: 'POST',
    path: '/notifications',
    summary: 'Create notification',
    description: 'Create a new notification',
  })
  .use(authMiddleware)
  .input(createNotificationSchema)
  .output(type<INotificationBriefDto>())
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