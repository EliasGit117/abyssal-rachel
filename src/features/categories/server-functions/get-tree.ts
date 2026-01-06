import { createServerFn } from '@tanstack/react-start';
import { CategoryService } from '@/features/categories/services/category-service.ts';
import { CategoryDtoMapper } from '@/features/categories/dtos/category-dto.ts';
import { queryOptions } from '@tanstack/react-query';

export const getCategoryTreeServerFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    const categories = await CategoryService.getTree();
    return CategoryDtoMapper.fromEntities(categories);
  });

export const getCategoryTreeQueryOptions = () => {
  return queryOptions({
    queryKey: ['categories', 'tree'],
    queryFn: () => getCategoryTreeServerFn()
  });
}