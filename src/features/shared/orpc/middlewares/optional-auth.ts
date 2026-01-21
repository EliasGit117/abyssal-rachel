import { base } from '@/features/shared/orpc/base.ts';
import { auth } from '@/lib/auth';
import { ORPCError } from '@orpc/server';


export const optionalAuthMiddleware = base.middleware(
  async ({ procedure, context, next }) => {
    const { meta } = procedure['~orpc'];
    const { anonymous, permissions } = meta ?? {};

    const sessionData = await auth.api.getSession({ headers: context.headers });

    if (anonymous && !sessionData?.session)
      return next({ context: { session: sessionData?.session, user: sessionData?.user } });

    if (!sessionData?.session || !sessionData?.user)
      throw new ORPCError('UNAUTHORIZED');

    if (permissions) {
      const hasPermission = await auth.api.userHasPermission({
        // @ts-ignore
        body: { role: sessionData.user.role, permissions: permissions }
      });

      if (!hasPermission)
        throw new ORPCError('FORBIDDEN');
    }


    return next({ context: { session: sessionData.session, user: sessionData.user } });
  }
);