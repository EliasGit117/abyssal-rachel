import { Category, CategoryStatus, Prisma } from '~/prisma/generated/prisma/client.ts';

type TCategoryWithChildren = Prisma.CategoryGetPayload<{ include: { children: true } }>;

export interface ICategoryDto {
  id: number;
  slug: string;
  nameRo: string;
  nameRu: string;
  descriptionRo?: string | null;
  descriptionRu?: string | null;
  status: CategoryStatus;
  idPath: string;
  slugPath: string;
  parentId?: number | null;
  children?: ICategoryDto[] | null;
}


export class CategoryDtoMapper {

  private static baseFromEntity(entity: Category): ICategoryDto {

    return {
      id: entity.id,
      slug: entity.slug,
      nameRo: entity.nameRo,
      nameRu: entity.nameRu,
      descriptionRo: entity.descriptionRo,
      descriptionRu: entity.descriptionRu,
      status: entity.status,
      parentId: entity.parentId,
      idPath: entity.idPath,
      slugPath: entity.slugPath
    };
  }

  static fromEntity<T extends Category | TCategoryWithChildren>(entity: T): ICategoryDto {
    const dto: ICategoryDto = this.baseFromEntity(entity);

    if ('children' in entity && Array.isArray(entity.children))
      dto.children = entity.children.map((child) => this.fromEntity(child));

    return dto;
  }

  static fromEntities<T extends Category | TCategoryWithChildren>(entities: T[]): ICategoryDto[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}