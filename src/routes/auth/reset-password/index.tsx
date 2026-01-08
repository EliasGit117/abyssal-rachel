import { createFileRoute, Link } from '@tanstack/react-router';
import { IconArrowBackUp } from '@tabler/icons-react';
import { m } from '@/paraglide/messages';
import { Button } from '@/components/ui/button.tsx';
import { ResetPasswordCard } from '@/components/auth';


export const Route = createFileRoute('/auth/reset-password/')({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <div className="mx-auto my-auto space-y-4 min-w-sm">
      <ResetPasswordCard type='centered'/>

      <Button variant="link" size="sm" className="w-full" asChild>
        <Link to="/auth/sign-in">
          <IconArrowBackUp/>
          <span>{m['common.go_back']()}</span>
        </Link>
      </Button>
    </div>
  );
}
