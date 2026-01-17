import { listNotifications } from '@/features/notifications/routes/list.ts';
import { createNotification } from '@/features/notifications/routes/create.ts';
import { deleteNotification } from '@/features/notifications/routes/delete.ts';

export const notificationsRoutes = {
  list: listNotifications,
  create: createNotification,
  delete: deleteNotification
}