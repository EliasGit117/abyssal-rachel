import { base } from '@/features/shared/orpc/base.ts';
import { todosRoutes } from '@/features/shared/orpc/todos.ts';
import { notificationsRoutes } from '@/features/notifications/routes';

export const orpcRouter = base.router({
  todos: todosRoutes,
  notifications: notificationsRoutes,
});