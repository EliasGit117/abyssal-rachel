import { createMiddleware } from '@tanstack/react-start';
import { auth } from '@/lib/auth';
import { throwUnauthorizedError } from '@/features/shared/utils/throw-api-error.ts';


export const requireAuth = () => createMiddleware().server(async ({ next, request: { headers } }) => {
    const authRes = await auth.api.getSession({ headers: headers });
    const { session, user } = authRes ?? {};

    if (!user)
      throwUnauthorizedError();

    return next({
      context: {
        session: session,
        user: user
      }
    });
  });