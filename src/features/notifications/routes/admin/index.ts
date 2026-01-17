import { createNotification } from '@/features/notifications/routes/admin/create.ts';
import { deleteNotification } from '@/features/notifications/routes/admin/delete.ts';


export const notificationsAdminRoutes = {
  create: createNotification,
  delete: deleteNotification
};