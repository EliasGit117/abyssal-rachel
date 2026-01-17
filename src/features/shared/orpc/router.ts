import { base } from '@/features/shared/orpc/base.ts';
import { todosRoutes } from '@/features/shared/orpc/todos.ts';
import { notificationsRoutes } from '@/features/notifications/routes';
import { InferRouterInputs, InferRouterOutputs } from '@orpc/server';


export const orpcRouter = base.router({
  todos: todosRoutes,
  notifications: notificationsRoutes,
});

export type TOrpcRouter = typeof orpcRouter;
export type TOrpcInputs = InferRouterInputs<TOrpcRouter>;
export type TOrpcOutputs = InferRouterOutputs<TOrpcRouter>;