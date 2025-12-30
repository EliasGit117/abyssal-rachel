import { useRouteContext } from '@tanstack/react-router';

export const useSession = () => {
  const { session } = useRouteContext({ from: '__root__' });
  return session;
}