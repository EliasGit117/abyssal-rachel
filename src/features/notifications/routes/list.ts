import { notificationsBase } from './base';
import {
  NotificationBriefDtoFactory,
  INotificationBriefDto
} from '@/features/notifications/dtos/notification-dto.ts';
import { type } from '@orpc/server';
import { getLocale } from '@/paraglide/runtime';
import { prisma } from '@/lib/db/prisma.ts';


export const listNotifications = notificationsBase
  .route({
    method: 'GET',
    path: '/notifications',
    summary: 'List notifications',
    description: 'Get all notifications',
  })
  .output(type<INotificationBriefDto[]>())
  .handler(async () => {
    const locale = getLocale();
    const notifications = await prisma.notification.findMany();

    return NotificationBriefDtoFactory.fromEntities(notifications, locale,);
  });