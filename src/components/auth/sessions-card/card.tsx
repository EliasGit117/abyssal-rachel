import { Fragment, useState } from 'react';
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
  IconLogout,
  IconRefresh, IconTrash,
  IconX
} from '@tabler/icons-react';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card.tsx';
import { LoadingButton } from '@/components/ui/loading-button.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth/auth-client.ts';
import { useSession } from '@/hooks/use-session.ts';
import { m } from '@/paraglide/messages';
import { Separator } from '@/components/ui/separator.tsx';
import { useConfirm } from '@/components/ui/confirm-dialog.tsx';
import { orpc } from '@/lib/orpc';


const ENGLISH_MESSAGES = {
  title: 'Sessions',
  description: 'Manage your active sessions',
  currentSession: 'Current session',
  revoke: 'Revoke',
  signOut: 'Sign out',
  error: 'Error',
  unknown: 'Unknown',
  revoke_others: 'Revoke other sessions',
};

export interface SessionsCardProps {
  className?: string;
  translated?: boolean;
}

export function SessionsCard({ className, translated = true }: SessionsCardProps) {
  const { session: currentSession } = useSession();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

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
    placeholderData: keepPreviousData
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
      toast.error(getText('error', translated), { description: e.message })
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
      void queryClient.invalidateQueries({
        queryKey: orpc.sessions.current.queryKey()
      });
    },
    onError: (e) =>
      toast.error(getText('error', translated), { description: e.message })
  });

  const revokeOthersMutation = useMutation({
    mutationFn: () => authClient.revokeOtherSessions(),
    onSuccess: () => refetch(),
    onError: (e) =>
      toast.error(getText('error', translated), { description: e.message })
  })

  const onRevokeOthersClick = async () => {
    const isConfirmed = await confirm({
      title: m['components.auth.sessions_card.revoke_others'](),
      description: m['components.auth.sessions_card.revoke_others_confirm'](),
      confirmText: m['common.confirm'](),
      cancelText: m['common.cancel'](),
    });

    if (!isConfirmed)
      return;

    revokeOthersMutation.mutate();
  }

  if (!currentSession)
    return null;

  return (
    <Card className={cn('relative', className)}>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center text-xl">
          <h3>{getText('title', translated)}</h3>
        </CardTitle>

        <CardDescription>{getText('description', translated)}</CardDescription>

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

      <CardContent className="grid gap-2">
        {isPending ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Fragment key={i}>
              {(i > 0) && <Separator className="opacity-35"/>}
              <Skeleton className="h-11 rounded-lg"/>
            </Fragment>
          ))
        ) : res?.error ? (
          <p className="text-sm text-destructive">
            {res.error.message}
          </p>
        ) : (
          res?.data.map((session, index) => {
            const parser = UAParser(session.userAgent ?? '');
            const isCurrent = session.id === currentSession.id;
            const isMobile = parser.device.type === 'mobile';
            const isRevokingThisSession = revokingToken === session.token;
            const isSigningOutCurrent = isCurrent && signingOut;
            const isLoading = isRevokingThisSession || isSigningOutCurrent || revokeOthersMutation.isPending;

            return (
              <Fragment key={session.id}>
                {(index > 0) && <Separator className="opacity-35"/>}

                <div className="flex flex-row items-center gap-3 py-1">
                  <div className="flex justify-center items-center size-8 border rounded-md">
                    {isMobile ? (
                      <IconDeviceMobile className="size-5" stroke={1.2}/>
                    ) : (
                      <IconDeviceLaptop className="size-5" stroke={1.2}/>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {isCurrent ? getText('currentSession', translated) : session.ipAddress}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {parser.os.name && parser.browser.name
                        ? `${parser.os.name}, ${parser.browser.name}`
                        : session.userAgent || getText('unknown', translated)}
                    </span>
                  </div>

                  <LoadingButton
                    hideText
                    size="icon-sm"
                    variant="ghost"
                    className="relative ms-auto shadow-none"
                    disabled={isFetching}
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
                        <span className="sr-only">{getText('signOut', translated)}</span>
                      </>
                    ) : (
                      <>
                        <IconX/>
                        <span className="sr-only">{getText('revoke', translated)}</span>
                      </>
                    )}
                  </LoadingButton>
                </div>
              </Fragment>
            );
          })
        )}
      </CardContent>

      {(!!res?.data && res.data.length > 1) && (
        <CardFooter>
          <LoadingButton
            variant="outline-destructive"
            className="w-full sm:w-fit sm:ml-auto"
            disabled={isFetching}
            loading={revokeOthersMutation.isPending}
            onClick={() => onRevokeOthersClick()}
          >
            <IconTrash/>
            <span>{getText('revoke_others', translated)}</span>
          </LoadingButton>
        </CardFooter>
      )}
    </Card>
  );
}

function getText(key: keyof typeof ENGLISH_MESSAGES, translated: boolean, fallback: string = '') {
  if (!translated)
    return ENGLISH_MESSAGES[key];

  switch (key) {
    case 'title':
      return m['components.auth.sessions_card.title']();
    case 'description':
      return m['components.auth.sessions_card.description']();
    case 'currentSession':
      return m['components.auth.sessions_card.current_session']();
    case 'revoke':
      return m['components.auth.sessions_card.revoke']();
    case 'signOut':
      return m['common.sign_out']();
    case 'error':
      return m['common.error']();
    case 'revoke_others':
      return m['components.auth.sessions_card.revoke_others']();
    case 'unknown':
      return 'Unknown';
    default:
      return fallback;
  }
};