import { createServerFn } from '@tanstack/react-start';
import { CategoryService } from '@/features/categories/admin/services/category-service.ts';
import { AdminCategoryDtoMapper } from '@/features/categories/admin/dtos/admin-category-dto.ts';
import { queryOptions } from '@tanstack/react-query';

export const getCategoryTreeForAdminServerFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    const categories = await CategoryService.getTree();
    return AdminCategoryDtoMapper.fromEntities(categories);
  });

export const getCategoryTreeForAdminQueryOptions = () => {
  return queryOptions({
    queryKey: ['categories', 'tree'],
    queryFn: () => getCategoryTreeForAdminServerFn()
  });
}