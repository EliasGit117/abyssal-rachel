import { notificationBaseDtoSchema } from '@/features/notifications/dtos/notification-base-dto.ts';
import * as z from 'zod';


export const deleteNotificationByIdDtoSchema = notificationBaseDtoSchema
  .pick({ id: true });


export type TDeleteNotificationByIdSchema = z.infer<typeof deleteNotificationByIdDtoSchema>;
