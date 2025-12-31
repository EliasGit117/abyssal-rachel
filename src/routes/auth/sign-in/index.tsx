import { createFileRoute } from '@tanstack/react-router';
import { SignInCard } from '@/routes/auth/sign-in/-components';
import * as z from 'zod';
import { useEffect } from 'react';
import { toast } from 'sonner';


const signInSearchParamsSchema = z.object({
  alert: z.enum(['email_confirmed']).optional().catch(undefined)
});

export const Route = createFileRoute('/auth/sign-in/')({
  component: RouteComponent,
  validateSearch: signInSearchParamsSchema,
  loaderDeps: (deps) => (deps)
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { search: { alert } } = Route.useLoaderDeps();

  useEffect(() => {
    if (alert !== 'email_confirmed')
      return;

    toast.success('Email confirmed successfully.', { description: 'Now you can sign in with email address' });
    navigate({ to: '.', search: (prev) => ({ ...prev, alert: undefined }), replace: true });
  }, [navigate, alert]);

  return (
    <SignInCard className="mx-auto my-auto"/>
  );
}
