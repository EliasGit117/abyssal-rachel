import { base } from '@/features/shared/orpc/base.ts';
import { notificationsPublicRoutes } from '@/features/notifications/routes/public';
import { notificationsAdminRoutes } from '@/features/notifications/routes/admin';
import { InferRouterInputs, InferRouterOutputs } from '@orpc/server';


export const orpcRouter = base.router({
  notifications: notificationsPublicRoutes,
  admin: {
    notifications: notificationsAdminRoutes,
  }
});

export type TOrpcRouter = typeof orpcRouter;
export type TOrpcInputs = InferRouterInputs<TOrpcRouter>;
export type TOrpcOutputs = InferRouterOutputs<TOrpcRouter>;