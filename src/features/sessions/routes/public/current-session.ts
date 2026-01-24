import { type } from '@orpc/server';
import { auth, TSession, TUser } from '@/lib/auth';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { sessionsPublicBase, sessionsPublicPath } from '@/features/sessions/routes/public/base.ts';

interface IGetSessionResponse {
  session?: TSession | null;
  user?: TUser | null;
}

export const getCurrentSession = sessionsPublicBase
  .route({
    method: 'GET',
    path: `${sessionsPublicPath}/current`,
    summary: 'Get current session',
    description: 'Returns current session if user is authorized'
  })
  .output(type<IGetSessionResponse>())
  .handler(async () => {
    const headers = getRequestHeaders();
    const res = await auth.api.getSession({ headers });

    return { session: res?.session, user: res?.user };
  });