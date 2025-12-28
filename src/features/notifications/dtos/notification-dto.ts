import { Notification } from '~/prisma/generated/prisma/client';
import { type Locale } from '@/paraglide/runtime';

export interface INotificationBriefDto {
  id: number;
  name: string;
  text: string;
  createdAt: string;
}


export class NotificationBriefDtoMapper {
  private static baseFromEntity(entity: Notification, locale: Locale): INotificationBriefDto {

    return {
      id: entity.id,
      name: locale === 'ro' ? entity.nameRo : entity.nameRu,
      text:  locale === 'ro' ? entity.textRo : entity.textRu,
      createdAt: entity.createdAt.toISOString(),
    };
  }

  static fromEntity<T extends Notification>(entity: T, locale: Locale): INotificationBriefDto {
    return { ...this.baseFromEntity(entity, locale) };
  }

  static fromEntities<T extends Notification>(entities: T[], locale: Locale): INotificationBriefDto[] {
    return entities.map(entity => this.fromEntity(entity, locale));
  }
}