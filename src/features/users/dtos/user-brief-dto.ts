import { User } from '~/prisma/generated/prisma/client.ts';
import * as z from 'zod';


export const userBriefDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  imageUrl: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  isBanned: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
});

export type TUserBriefDto = z.infer<typeof userBriefDtoSchema>;


export abstract class UserBriefDtoFactory {

  private static baseFromEntity(entity: User): TUserBriefDto {
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

  static fromEntity<T extends User>(entity: T): TUserBriefDto {
    return { ...this.baseFromEntity(entity) };
  }

  static fromEntities<T extends User>(entities: T[]): TUserBriefDto[] {
    return entities.map(entity => this.fromEntity(entity));
  }
}