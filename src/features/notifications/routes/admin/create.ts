import {
  NotificationBriefDtoFactory,
  TNotificationBriefDto
} from '@/features/notifications/dtos/notification-brief-dto.ts';
import { type } from '@orpc/server';
import {
  createNotificationDtoSchema,
} from '@/features/notifications/dtos/create-notification-dto.ts';
import { getLocale } from '@/paraglide/runtime';
import { prisma } from '@/lib/db/prisma.ts';
import { notificationsAdminBase } from '@/features/notifications/routes/admin/base.ts';
import { authMiddleware } from '@/features/shared/orpc/middlewares/auth.ts';
import { hasPermissionsForRole, Permission } from '@/lib/auth';


export const createNotification = notificationsAdminBase
  .route({
    method: 'POST',
    summary: 'Create notification',
    description: 'Create a new notification',
  })
  .use(authMiddleware)
  .input(createNotificationDtoSchema)
  .output(type<TNotificationBriefDto>())
  .errors({
    FORBIDDEN: { message: 'User does not have permission to create notifications' }
  })
  .handler(async ({ input, errors, context: { user } }) => {
    const { canCreate } = hasPermissionsForRole(user.role, { canCreate: { notification: [Permission.Create] } });
    if (!canCreate)
      throw errors.FORBIDDEN();

    const locale = getLocale();
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