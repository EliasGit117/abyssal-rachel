import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { auth } from '@/lib/auth.ts';
import { queryOptions } from '@tanstack/react-query';

export const getSessionServerFn = createServerFn()
  .handler(async ({  }) => {
    const headers = getRequestHeaders();
    return await auth.api.getSession({ headers });
  });


export function getSessionQueryOptions() {
  return queryOptions({
    queryKey: ['session'],
    queryFn: getSessionServerFn,
  });
}