import { createServerFn } from '@tanstack/react-start';
import { prisma } from '@/lib/prisma.ts';
import { CategoryDtoMapper, ICategoryDto } from '@/features/categories/dtos/category-dto.ts';
import { queryOptions } from '@tanstack/react-query';


export const getAllCategoriesServerFn = createServerFn({ method: 'GET', })
  .handler(async (): Promise<ICategoryDto[]> => {
    const categories = await prisma.category.findMany({
      orderBy: { nameRo: 'asc' },
    });

    return CategoryDtoMapper.fromEntities(categories);
  });

export const getAllCategoriesQueryOptions = () => {
  return queryOptions({
    queryKey: ['categories'],
    queryFn: () => getAllCategoriesServerFn()
  });
}