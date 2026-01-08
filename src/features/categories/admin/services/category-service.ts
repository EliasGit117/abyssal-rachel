import { TCreateCategory } from '@/features/categories/admin/schemas/create.ts';
import { prisma } from '@/lib/prisma.ts';
import { throwBadRequest } from '@/features/shared/utils/throw-api-error.ts';
import { CategoryPathService } from '@/features/categories/admin/services/category-path-service.ts';
import { TDeleteCategory, TUpdateCategory } from '@/features/categories/admin/schemas';
import { Category } from '~/prisma/generated/prisma/client.ts';


export class CategoryService {

  static async create(data: TCreateCategory) {
    return prisma.$transaction(async (tx) => {
      const withSameSlug = await prisma.category.findFirst({ where: { slug: data.slug } });
      if (withSameSlug)
        throwBadRequest({ message: 'Category with same slug already exists' });

      let parent = null;

      if (data.parentId) {
        parent = await tx.category.findUnique({ where: { id: data.parentId } });

        if (!parent)
          throwBadRequest({ message: 'Parent category not found' });
      }

      const category = await tx.category.create({
        data: {
          slug: data.slug.trim(),
          nameRo: data.nameRo.trim(),
          nameRu: data.nameRu.trim(),
          descriptionRo: data.descriptionRo?.trim() || null,
          descriptionRu: data.descriptionRu?.trim() || null,
          parentId: data.parentId ?? null,
          idPath: '',
          slugPath: ''
        }
      });

      const idPath = CategoryPathService.buildIdPath(parent?.idPath ?? null, category.id);
      const slugPath = CategoryPathService.buildSlugPath(parent?.slugPath ?? null, category.slug);

      return tx.category.update({
        where: { id: category.id },
        data: { idPath, slugPath }
      });
    });
  }

  static async update(data: TUpdateCategory) {
    const { id, slug, nameRo, nameRu, descriptionRo, descriptionRu, parentId } = data;

    return prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({ where: { id } });

      if (!category)
        throwBadRequest({ message: 'Category not found' });

      const newData: Partial<TUpdateCategory> = {
        slug: slug.trim(),
        nameRo: nameRo.trim(),
        nameRu: nameRu.trim(),
        descriptionRo: descriptionRo?.trim() || null,
        descriptionRu: descriptionRu?.trim() || null
      };

      const slugChanged = slug !== category.slug;
      const parentChanged = 'parentId' in data && parentId !== category.parentId;

      if (parentChanged || slugChanged) {
        let parent = null;
        const targetParentId = 'parentId' in data ? parentId : category.parentId;

        if (targetParentId != null) {
          parent = await tx.category.findUnique({ where: { id: targetParentId } });

          if (!parent)
            throwBadRequest({ message: 'Parent category not found' });

          CategoryPathService.ensureNoCircularMove(category, parent);
        }

        const newSlug = slug ?? category.slug;

        const newIdPath = CategoryPathService.buildIdPath(
          parent?.idPath ?? null,
          category.id
        );
        const newSlugPath = CategoryPathService.buildSlugPath(
          parent?.slugPath ?? null,
          newSlug
        );

        await tx.category.update({
          where: { id },
          data: {
            ...newData,
            ...('parentId' in data && { parentId: parentId ?? null }),
            idPath: newIdPath,
            slugPath: newSlugPath
          }
        });

        await CategoryPathService.updateSubtree(tx, id, newIdPath, newSlugPath);
        return;
      }

      await tx.category.update({ where: { id }, data: newData });
    });
  }

  static async delete({ categoryId }: TDeleteCategory) {
    return prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({ where: { id: categoryId } });

      if (!category)
        throwBadRequest({ message: 'Category not found' });

      // Check if the category has children (fast, index-backed)
      const hasChildren = await tx.category.count({ where: { parentId: categoryId } });

      if (hasChildren > 0)
        throwBadRequest({ message: 'Cannot delete category with children' });

      await tx.category.delete({ where: { id: categoryId } });
    });
  }

  static async getTree(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      orderBy: [{ idPath: 'asc' }]
    });

    const map = new Map<number, Category & { children?: Category[] }>();
    const roots: (Category & { children?: Category[] })[] = [];

    for (const category of categories) {
      map.set(category.id, {
        ...category,
        children: []
      });
    }

    for (const node of map.values()) {
      if (node.parentId == null) {
        roots.push(node);
      } else {
        const parent = map.get(node.parentId);
        if (parent) {
          parent.children!.push(node);
        }
      }
    }

    return roots;
  }

  static async getById(id: number) {
    const category = await prisma.category.findFirst({ where: { id: id } });
    if (!category)
      throwBadRequest({ message: 'Category not found', translated: false });

    return category;
  }
}