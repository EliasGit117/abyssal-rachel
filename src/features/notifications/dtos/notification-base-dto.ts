import * as z from 'zod';

export const notificationBaseDtoSchema = z
  .object({
    id: z.number().int().meta({
      description: "Notification identifier",
      examples: [115],
    }),

    nameRo: z.string().min(3).meta({
      description: "Notification name in Romanian",
      examples: ["Notificare sistem"],
    }),

    nameRu: z.string().min(3).meta({
      description: "Notification name in Russian",
      examples: ["Системное уведомление"],
    }),

    textRo: z.string().min(3).meta({
      description: "Notification text in Romanian",
      examples: ["Mesaj important"],
    }),

    textRu: z.string().min(3).meta({
      description: "Notification text in Russian",
      examples: ["Важное сообщение"],
    }),

    createdAt: z.string().meta({
      description: "Creation timestamp (ISO 8601)",
      examples: ["2025-01-10T14:32:00Z"],
      format: "date-time",
    }),

    updatedAt: z.string().meta({
      description: "Last update timestamp (ISO 8601)",
      examples: ["2025-01-12T09:15:00Z"],
      format: "date-time",
    }),
  })
  .meta({ title: "Notification" });