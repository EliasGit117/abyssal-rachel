import { useState } from 'react';
import { UAParser } from 'ua-parser-js';
import { toast } from 'sonner';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import {
  IconDeviceLaptop,
  IconDeviceMobile,
  IconList,
  IconLogout,
  IconRefresh,
  IconX
} from '@tabler/icons-react';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { LoadingButton } from '@/components/ui/loading-button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';
import { useSession } from '@/hooks/use-session';
import { getSessionQueryOptions } from '@/features/auth/server-functions/get-session.ts';
import { m } from '@/paraglide/messages';


export interface SessionsCardProps {
  className?: string;
}

export function SessionsCard({ className }: SessionsCardProps) {
  const { session: currentSession } = useSession();
  const queryClient = useQueryClient();

  const [revokingToken, setRevokingToken] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  const {
    data: res,
    isPending,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => authClient.listSessions(),
    placeholderData: keepPreviousData,
  });

  const revokeMutation = useMutation({
    mutationFn: (token: string) =>
      authClient.revokeSession({ token }),
    onMutate: (token) => {
      setRevokingToken(token);
    },
    onSettled: () => {
      setRevokingToken(null);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['sessions'] }),
    onError: (e) =>
      toast.error(m['common.error'](), { description: e.message })
  });

  const signOutMutation = useMutation({
    mutationFn: () => authClient.signOut(),
    onMutate: () => {
      setSigningOut(true);
    },
    onSettled: () => {
      setSigningOut(false);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: getSessionQueryOptions().queryKey });
    },
    onError: (e) =>
      toast.error(m['common.error'](), { description: e.message })
  });

  if (!currentSession)
    return null;

  return (
    <Card className={cn('relative', className)}>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center">
          <IconList className="size-4"/>
          <h3>{m['components.sessions_card.title']()}</h3>
        </CardTitle>

        <CardDescription>
          {m['components.sessions_card.description']()}
        </CardDescription>

        <CardAction>
          <LoadingButton
            hideText
            size="icon"
            variant="ghost"
            loading={isFetching}
            onClick={() => refetch()}
          >
            <IconRefresh/>
          </LoadingButton>
        </CardAction>
      </CardHeader>

      <CardContent className="grid gap-4 pt-4">
        {isPending ? (
          <Skeleton className="h-13 rounded-lg"/>
        ) : res?.error ? (
          <p className="text-sm text-destructive">
            {res.error.message}
          </p>
        ) : (
          res?.data.map((session) => {
            const parser = UAParser(session.userAgent ?? '');
            const isCurrent = session.id === currentSession.id;
            const isMobile = parser.device.type === 'mobile';
            const isRevokingThisSession = revokingToken === session.token;
            const isSigningOutCurrent = isCurrent && signingOut;
            const isLoading = isRevokingThisSession || isSigningOutCurrent;

            return (
              <div key={session.id} className="flex flex-row items-center gap-3 px-4 py-3 border rounded-xl">
                {isMobile ? (<IconDeviceMobile className="size-4"/>) : (<IconDeviceLaptop className="size-4"/>)}

                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    {isCurrent ? m['components.sessions_card.current_session']() : session.ipAddress}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {parser.os.name && parser.browser.name ? `${parser.os.name}, ${parser.browser.name}` : session.userAgent || 'Unknown'}
                  </span>
                </div>

                <LoadingButton
                  size="sm"
                  variant={"outline"}
                  className="relative ms-auto min-w-28"
                  loading={isLoading}
                  onClick={() => {
                    if (isCurrent) {
                      signOutMutation.mutate();
                      return;
                    }

                    revokeMutation.mutate(session.token);
                  }}
                >
                  {isCurrent ? (
                    <>
                      <IconLogout/>
                      <span>
                        {m['common.sign_out']()}
                      </span>
                    </>
                  ) : (
                    <>
                      <IconX/>
                      <span>
                        {m['components.sessions_card.revoke']()}
                      </span>
                    </>
                  )}
                </LoadingButton>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}