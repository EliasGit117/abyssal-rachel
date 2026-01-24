import { base } from '@/features/shared/orpc/base.ts';
import { notificationsPublicRoutes } from '@/features/notifications/routes/public';
import { notificationsAdminRoutes } from '@/features/notifications/routes/admin';
import { InferRouterInputs, InferRouterOutputs } from '@orpc/server';
import { usersAdminRoutes } from '@/features/users/routes/admin';
import { sessionsPublicRoutes } from '@/features/sessions/routes/public';
import { sessionsAdminRoutes } from '@/features/sessions/routes/admin';


export const orpcRouter = base.router({
  sessions: sessionsPublicRoutes,
  notifications: notificationsPublicRoutes,
  admin: {
    notifications: notificationsAdminRoutes,
    sessions: sessionsAdminRoutes,
    users: usersAdminRoutes,
  }
});

export type TOrpcRouter = typeof orpcRouter;
export type TOrpcInputs = InferRouterInputs<TOrpcRouter>;
export type TOrpcOutputs = InferRouterOutputs<TOrpcRouter>;