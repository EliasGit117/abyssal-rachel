import { Category } from '~/prisma/generated/prisma/client.ts';
import { TxClient } from '@/lib/db/prisma.ts';

export class CategoryPathService {

  static buildIdPath(parentIdPath: string | null | undefined, id: number): string {
    return parentIdPath ? `${parentIdPath}${id}/` : `/${id}/`;
  }

  static buildSlugPath(parentSlugPath: string | null | undefined, slug: string): string {
    return parentSlugPath ? `${parentSlugPath}${slug}/` : `/${slug}/`;
  }

  static ensureNoCircularMove(category: Category, parent: Category) {
    if (parent.id === category.id)
      throw Error('Cannot move category under itself');

    if (category.idPath && parent.idPath && parent.idPath.startsWith(category.idPath))
      throw Error('Cannot move category into its own subtree');

    if (category.slugPath && parent.slugPath && parent.slugPath.startsWith(category.slugPath))
      throw Error('Cannot move category into its own subtree (slug path)');
  }

  static async updateSubtree(tx: TxClient, categoryId: number, newIdPath: string, newSlugPath: string) {
    const updates: Array<{ id: number; idPath: string; slugPath: string }> = [];
    const queue: Array<{ id: number; idPath: string; slugPath: string }> = [
      { id: categoryId, idPath: newIdPath, slugPath: newSlugPath }
    ];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const children = await tx.category.findMany({ where: { parentId: current.id } });

      for (const child of children) {
        const childNewIdPath = CategoryPathService.buildIdPath(current.idPath, child.id);
        const childNewSlugPath = CategoryPathService.buildSlugPath(current.slugPath, child.slug);

        updates.push({ id: child.id, idPath: childNewIdPath, slugPath: childNewSlugPath });
        queue.push({ id: child.id, idPath: childNewIdPath, slugPath: childNewSlugPath });
      }
    }

    await Promise.all(updates.map(update => tx.category.update({
      where: { id: update.id },
      data: {
        idPath: update.idPath,
        slugPath: update.slugPath
      }
    })));
  }
}