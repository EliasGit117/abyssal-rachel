import { Notification } from '~/prisma/generated/prisma/client';
import { type Locale } from '@/paraglide/runtime';
import * as z from 'zod';


export const notificationBriefDtoSchema = z
  .object({
    id: z.number().int().meta({
      description: "Notification identifier",
      examples: [1],
    }),

    name: z.string().min(1).meta({
      description: "Localized notification name (based on request locale)",
      examples: ["Notificare sistem"],
    }),

    text: z.string().min(1).meta({
      description: "Localized notification text (based on request locale)",
      examples: ["Mesaj important"],
    }),

    createdAt: z.string().meta({
      description: "Creation timestamp (ISO 8601)",
      format: "date-time",
      examples: ["2025-01-10T14:32:00Z"],
    }),
  });

export type TNotificationBriefDto = z.infer<typeof notificationBriefDtoSchema>;

export class NotificationBriefDtoFactory {
  private static baseFromEntity(entity: Notification, locale: Locale): TNotificationBriefDto {

    return {
      id: entity.id,
      name: locale === 'ro' ? entity.nameRo : entity.nameRu,
      text:  locale === 'ro' ? entity.textRo : entity.textRu,
      createdAt: entity.createdAt.toISOString(),
    };
  }

  static fromEntity<T extends Notification>(entity: T, locale: Locale): TNotificationBriefDto {
    return { ...this.baseFromEntity(entity, locale) };
  }

  static fromEntities<T extends Notification>(entities: T[], locale: Locale): TNotificationBriefDto[] {
    return entities.map(entity => this.fromEntity(entity, locale));
  }
}