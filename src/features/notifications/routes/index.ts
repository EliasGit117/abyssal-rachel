import { listNotifications } from '@/features/notifications/routes/list.ts';
import { createNotification } from '@/features/notifications/routes/create.ts';

export const notificationsRoutes = {
  list: listNotifications,
  create: createNotification,
}