import { base } from '@/features/shared/orpc/base.ts';

export const notificationsAdminTag = 'Admin / Notifications';
export const notificationAdminPath = '/admin/notifications';

export const notificationsAdminBase = base.route({
  tags: [notificationsAdminTag],
  path: notificationAdminPath
})