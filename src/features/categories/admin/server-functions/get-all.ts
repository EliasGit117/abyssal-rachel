import { createServerFn } from '@tanstack/react-start';
import { prisma } from '@/lib/prisma.ts';
import { AdminCategoryDtoMapper, IAdminCategoryDto } from '@/features/categories/admin/dtos/admin-category-dto.ts';
import { queryOptions } from '@tanstack/react-query';


export const getAllCategoriesForAdminServerFn = createServerFn({ method: 'GET', })
  .handler(async (): Promise<IAdminCategoryDto[]> => {
    const categories = await prisma.category.findMany({
      orderBy: { nameRo: 'asc' },
    });

    return AdminCategoryDtoMapper.fromEntities(categories);
  });

export const getAllCategoriesForAdminQueryOptions = () => {
  return queryOptions({
    queryKey: ['categories'],
    queryFn: () => getAllCategoriesForAdminServerFn()
  });
}