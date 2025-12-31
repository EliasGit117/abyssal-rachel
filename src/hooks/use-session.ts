import { useRouteContext } from '@tanstack/react-router';

export const useSession = () => {
  const { session, user } = useRouteContext({ from: '__root__' });

  return {
    session,
    user,
  };
}