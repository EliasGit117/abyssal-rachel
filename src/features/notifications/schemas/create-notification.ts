import { notificationSchema } from '@/features/notifications/schemas/notification.ts';
import * as z from 'zod';

export const createNotificationSchema = notificationSchema.pick({
  nameRo: true,
  nameRu: true,
  textRo: true,
  textRu: true
});

export type TCreateNotificationSchema = z.infer<typeof createNotificationSchema>;
