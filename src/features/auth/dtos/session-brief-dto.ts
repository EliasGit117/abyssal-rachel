import { Session } from '~/prisma/generated/prisma/client.ts';

export interface ISessionBriefDto {
  id: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  isCurrent?: boolean;
  isMine?: boolean;
  expired?: boolean;
}

interface SessionBriefDtoOptions {
  currentSessionId?: string;
  currentUserId?: string;
}

export class SessionBriefDtoFactory {
  static fromEntity(entity: Session, options?: SessionBriefDtoOptions): ISessionBriefDto {

    return {
      id: entity.id,
      userId: entity.userId,
      ipAddress: entity.ipAddress,
      userAgent: entity.userAgent,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      expiresAt: entity.expiresAt.toISOString(),
      isCurrent: options?.currentSessionId != null ? entity.id === options.currentSessionId : undefined,
      isMine: options?.currentUserId != null ? entity.userId === options.currentUserId : undefined,
      expired: entity.expiresAt < new Date(),
    };
  }

  static fromEntities(entities: Session[], options?: SessionBriefDtoOptions): ISessionBriefDto[] {
    return entities.map((entity) =>
      this.fromEntity(entity, options)
    );
  }
}