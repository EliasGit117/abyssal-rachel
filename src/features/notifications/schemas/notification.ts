import * as z from 'zod';

export const notificationSchema = z.object({
  id: z.number(),
  nameRo: z.string(),
  nameRu: z.string(),
  textRo: z.string(),
  textRu: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type TNotification = z.infer<typeof notificationSchema>;