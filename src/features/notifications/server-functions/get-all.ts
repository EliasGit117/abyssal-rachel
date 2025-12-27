import { createServerFn } from '@tanstack/react-start';
import { prisma } from '@/lib/prisma.ts';
import { getLocale } from '@/paraglide/runtime';
import { queryOptions } from '@tanstack/react-query';

export const getAllNotifications = createServerFn({ method: 'GET' })
  .handler(async () => {
    const locale = getLocale();
    const notifications = await prisma.notification.findMany();

    return notifications.map(notification => ({
      id: notification.id,
      name: locale === 'ro' ? notification.nameRo : notification.nameRu,
      description:  locale === 'ro' ? notification.textRo : notification.textRu,
    }))
  });


export function getAllNotificationsQueryOptions() {
  return queryOptions({
    queryKey: ['notifications'],
    queryFn: getAllNotifications
  });
}