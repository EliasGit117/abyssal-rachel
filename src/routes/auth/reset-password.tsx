import { createFileRoute } from '@tanstack/react-router';
import { ResetPasswordCard } from '@/components/auth/reset-password-card';


export const Route = createFileRoute('/auth/reset-password')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="mx-auto my-auto space-y-4 min-w-sm">
      <ResetPasswordCard type='centered' goBackPath='/auth/sign-in'/>
    </div>
  );
}
