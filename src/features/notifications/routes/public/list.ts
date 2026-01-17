import { notificationsPublicBase } from './base.ts';
import { NotificationBriefDtoFactory, NotificationBriefDtoSchema, } from '@/features/notifications/dtos/notification-dto.ts';
import { getLocale } from '@/paraglide/runtime';
import { prisma } from '@/lib/db/prisma.ts';


export const listNotifications = notificationsPublicBase
  .route({
    method: 'GET',
    summary: 'List notifications',
    description: 'Get all notifications',
  })
  .output(NotificationBriefDtoSchema.array())
  .handler(async () => {
    const locale = getLocale();
    const notifications = await prisma.notification.findMany();

    return NotificationBriefDtoFactory.fromEntities(notifications, locale,);
  });