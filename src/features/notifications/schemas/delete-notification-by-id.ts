import { notificationSchema } from '@/features/notifications/schemas/notification.ts';
import * as z from "zod";


export const deleteNotificationByIdSchema = notificationSchema.pick({
  id: true
});

export type TDeleteNotificationByIdSchema = z.infer<typeof deleteNotificationByIdSchema>;
