import { base } from '@/orpc/base.ts';
import { todosRoutes } from '@/features/shared/orpc/todos.ts';

export const orpcRouter = base.router({
  todos: todosRoutes,
});