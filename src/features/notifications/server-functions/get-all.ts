import { createServerFn } from '@tanstack/react-start';
import { prisma } from '@/lib/prisma.ts';
import { getLocale } from '@/paraglide/runtime';
import { queryOptions } from '@tanstack/react-query';
import { NotificationBriefDtoFactory } from '@/features/notifications/dtos/notification-dto.ts';

export const getAllNotificationsServerFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    const locale = getLocale();
    const notifications = await prisma.notification.findMany();

    return NotificationBriefDtoFactory.fromEntities(notifications, locale);
  });


export function getAllNotificationsQueryOptions() {
  return queryOptions({
    queryKey: ['notifications'],
    queryFn: () => getAllNotificationsServerFn()
  });
}

