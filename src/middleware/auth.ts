import { createMiddleware } from '@tanstack/react-start';
import { auth } from '@/features/auth/lib/auth.ts';
import { throwUnauthorizedError } from '@/features/shared/utils/throw-api-error.ts';
import { Permission } from '@/features/auth/lib/permissions.ts';


interface BaseOptions {
  translateErrors?: boolean;
}

interface IOptionalAuthOptions extends BaseOptions {
  optional: true;
  requirePermissions?: never;
}

interface IRequiredAuthOptions extends BaseOptions {
  optional?: false;
  requirePermissions?: Permission[];
}

type TOptions = IOptionalAuthOptions | IRequiredAuthOptions;

const defaultOptions: IRequiredAuthOptions = {
  optional: false,
  translateErrors: true
};

export const authMiddleware = (options?: TOptions) => {
  const { translateErrors, optional, requirePermissions } = options ?? defaultOptions;

  return createMiddleware().server(async ({ next, request: { headers } }) => {
    const authRes = await auth.api.getSession({ headers: headers });
    const { session, user } = authRes ?? {};

    if (!user && !optional)
      throwUnauthorizedError({ translated: translateErrors });

    if (requirePermissions && !!user)
      await auth.api.userHasPermission({ body: { userId: user.id, permission: { user: requirePermissions } } });

    return next({
      context: {
        headers: headers,
        session: session,
        user: user
      }
    });
  });
};