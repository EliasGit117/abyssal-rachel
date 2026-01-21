import { notificationBaseDtoSchema } from '@/features/notifications/dtos/notification-base-dto.ts';
import * as z from 'zod';

export const createNotificationDtoSchema = notificationBaseDtoSchema.pick({
  nameRo: true,
  nameRu: true,
  textRo: true,
  textRu: true
});


export type TCreateNotificationSchema = z.infer<typeof createNotificationDtoSchema>;