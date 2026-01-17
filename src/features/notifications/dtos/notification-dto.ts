import { Notification } from '~/prisma/generated/prisma/client';
import { type Locale } from '@/paraglide/runtime';
import * as z from 'zod';


export const NotificationBriefDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  text: z.string(),
  createdAt: z.string(),
});

export type TNotificationBriefDto = z.infer<typeof NotificationBriefDtoSchema>;

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