import { User } from '~/prisma/generated/prisma/client.ts';

export interface IUserBriefDto {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  imageUrl?: string | null;
  role?: string | null; // One or many roles separated by ','
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}



export abstract class UserBriefDtoFactory {

  private static baseFromEntity(entity: User): IUserBriefDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      emailVerified: entity.emailVerified,
      imageUrl: entity.image,
      role: entity.role,
      isBanned: entity.banned ?? false,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    };
  }

  static fromEntity<T extends User>(entity: T): IUserBriefDto {
    return { ...this.baseFromEntity(entity) };
  }

  static fromEntities<T extends User>(entities: T[]): IUserBriefDto[] {
    return entities.map(entity => this.fromEntity(entity));
  }
}