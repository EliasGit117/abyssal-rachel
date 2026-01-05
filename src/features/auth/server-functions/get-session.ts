import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { auth, TSession, TUser } from '@/features/auth/lib/auth.ts';
import { queryOptions } from '@tanstack/react-query';


interface IGetSessionResponse {
  session?: TSession | null;
  user?: TUser | null;
}

export const getSessionServerFn = createServerFn()
  .handler(async (): Promise<IGetSessionResponse | null> => {
    const headers = getRequestHeaders();
    const res = await auth.api.getSession({ headers });

    return {
      session: res?.session,
      user: res?.user,
    };
  });


export function getSessionQueryOptions() {
  return queryOptions({
    queryKey: ['session'],
    queryFn: getSessionServerFn,
  });
}