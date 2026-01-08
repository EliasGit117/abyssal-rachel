import { Category, Prisma } from '~/prisma/generated/prisma/client.ts';
import { throwBadRequest } from '@/features/shared/utils/throw-api-error.ts';

export class CategoryPathService {

  static buildIdPath(parentIdPath: string | null, id: number): string {
    return parentIdPath ? `${parentIdPath}${id}/` : `/${id}/`;
  }

  static buildSlugPath(parentSlugPath: string | null, slug: string): string {
    return parentSlugPath ? `${parentSlugPath}${slug}/` : `/${slug}/`;
  }

  static ensureNoCircularMove(category: Category, parent: Category) {
    if (parent.idPath.startsWith(category.idPath))
      throwBadRequest({ message: 'Cannot move category into its own subtree', translated: false });

    if (parent.slugPath.startsWith(category.slugPath))
      throwBadRequest({ message: 'Cannot move category into its own subtree (slug path)', translated: false });
  }

  static async updateSubtree(tx: Prisma.TransactionClient, category: Category, newIdPath: string, newSlugPath: string) {
    const oldIdPrefix = `${category.idPath}${category.id}/`;
    const newIdPrefix = `${newIdPath}${category.id}/`;

    const oldSlugPrefix = `${category.slugPath}${category.slug}/`;
    const newSlugPrefix = `${newSlugPath}${category.slug}/`;

    await tx.$executeRawUnsafe(
      `
          UPDATE categories
          SET id_path   = REPLACE(id_path, $1, $2),
              slug_path = REPLACE(slug_path, $3, $4)
          WHERE id_path LIKE $5
      `,
      oldIdPrefix, newIdPrefix, oldSlugPrefix, newSlugPrefix, `${oldIdPrefix}%`
    );
  }
}