import { Category, Prisma } from '~/prisma/generated/prisma/client.ts';
import { throwBadRequest } from '@/features/shared/utils/throw-api-error.ts';

export class CategoryPathService {

  static buildIdPath(parentIdPath: string | null | undefined, id: number): string {
    return parentIdPath ? `${parentIdPath}${id}/` : `/${id}/`;
  }

  static buildSlugPath(parentSlugPath: string | null | undefined, slug: string): string {
    return parentSlugPath ? `${parentSlugPath}${slug}/` : `/${slug}/`;
  }

  static ensureNoCircularMove(category: Category, parent: Category) {
    if (parent.idPath.startsWith(category.idPath))
      throwBadRequest({ message: 'Cannot move category into its own subtree', translated: false });

    if (parent.slugPath.startsWith(category.slugPath))
      throwBadRequest({ message: 'Cannot move category into its own subtree (slug path)', translated: false });
  }


  static async updateSubtree(
    tx: Prisma.TransactionClient,
    categoryId: number,
    newIdPath: string,
    newSlugPath: string
  ) {
    const updates: Array<{ id: number; idPath: string; slugPath: string }> = [];

    const queue: Array<{ id: number; idPath: string; slugPath: string }> = [
      { id: categoryId, idPath: newIdPath, slugPath: newSlugPath }
    ];

    while (queue.length > 0) {
      const current = queue.shift()!;

      const children = await tx.category.findMany({
        where: { parentId: current.id }
      });

      for (const child of children) {
        const childNewIdPath = CategoryPathService.buildIdPath(current.idPath, child.id);
        const childNewSlugPath = CategoryPathService.buildSlugPath(current.slugPath, child.slug);

        updates.push({
          id: child.id,
          idPath: childNewIdPath,
          slugPath: childNewSlugPath
        });

        queue.push({
          id: child.id,
          idPath: childNewIdPath,
          slugPath: childNewSlugPath
        });
      }
    }

    for (const update of updates) {
      await tx.category.update({
        where: { id: update.id },
        data: {
          idPath: update.idPath,
          slugPath: update.slugPath
        }
      });
    }
  }
}