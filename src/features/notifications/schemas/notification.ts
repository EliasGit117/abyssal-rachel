import * as z from 'zod';

export const notificationSchema = z.object({
  id: z.number(),
  nameRo: z.string().min(3),
  nameRu: z.string().min(3),
  textRo: z.string().min(3),
  textRu: z.string().min(3),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type TNotification = z.infer<typeof notificationSchema>;