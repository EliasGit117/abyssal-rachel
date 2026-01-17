import { notificationsBase } from './base';
import * as z from 'zod';
import { prisma } from '@/lib/db/prisma.ts';
import { auth } from '@/lib/auth/auth';
import { Permission } from '@/lib/auth/permissions';
import { authMiddleware } from '@/features/shared/orpc/middlewares/auth.ts';

export const deleteNotification = notificationsBase
  .route({
    method: 'DELETE',
    path: '/notifications/{id}',
    summary: 'Delete notification',
    description: 'Delete notification by id'
  })
  .use(authMiddleware)
  .input(z.object({ id: z.coerce.number().int().min(1) }))
  .errors({
    FORBIDDEN: { message: 'User does not have permission to delete notifications' },
    NOT_FOUND: { message: 'Notification not found' }
  })
  .handler(async ({ input, errors, context: { user } }) => {
    const canDelete = await auth.api.userHasPermission({
      body: {
        userId: user.id,
        permission: { notification: [Permission.Delete] }
      }
    });

    if (!canDelete.success)
      throw errors.FORBIDDEN();

    try {
      await prisma.notification.delete({ where: { id: input.id } });
    } catch (e) {
      throw errors.NOT_FOUND();
    }
  });