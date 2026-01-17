import { base } from '@/features/shared/orpc/base.ts';

export const notificationsPublicTag = 'Notifications';
export const notificationPublicPath = '/notifications';

export const notificationsPublicBase = base.route({
  tags: [notificationsPublicTag],
  path: notificationPublicPath
});
