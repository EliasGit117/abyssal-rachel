import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { auth } from '@/lib/auth.ts';
import { queryOptions } from '@tanstack/react-query';
import type { Session, User } from 'better-auth';



interface IGetSessionResponse {
  session?: Session | null;
  user?: User | null;
}

export const getSessionServerFn = createServerFn()
  .handler(async (): Promise<IGetSessionResponse | null> => {
    const headers = getRequestHeaders();
    return await auth.api.getSession({ headers });
  });


export function getSessionQueryOptions() {
  return queryOptions({
    queryKey: ['session'],
    queryFn: getSessionServerFn,
  });
}