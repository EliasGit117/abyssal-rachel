import { notificationsPublicBase } from './base.ts';
import { NotificationBriefDtoFactory, notificationBriefDtoSchema, } from '@/features/notifications/dtos/notification-brief-dto.ts';
import { getLocale } from '@/paraglide/runtime';
import { prisma } from '@/lib/db/prisma.ts';


export const listNotifications = notificationsPublicBase
  .route({
    method: 'GET',
    summary: 'List notifications',
    description: 'Get all notifications',
  })
  .output(notificationBriefDtoSchema.array())
  .handler(async () => {
    const locale = getLocale();
    const notifications = await prisma.notification.findMany();

    return NotificationBriefDtoFactory.fromEntities(notifications, locale,);
  });