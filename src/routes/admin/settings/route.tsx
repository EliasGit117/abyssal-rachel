import { createFileRoute, Link, LinkOptions, Outlet, useLocation } from '@tanstack/react-router';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Icon, IconAdjustments, IconLock } from '@tabler/icons-react';


export const Route = createFileRoute('/admin/settings')({
  component: RouteComponent,
  staticData: {
    crumbs: { title: 'Settings' }
  }
});

const tabOptions: { name: string; icon: Icon, linkOptions: LinkOptions }[] = [
  { name: 'Preferences', icon: IconAdjustments, linkOptions: { to: '/admin/settings/preferences' } },
  { name: 'Security', icon: IconLock, linkOptions: { to: '/admin/settings/security' } },
];

function RouteComponent() {
  const location = useLocation();

  return (
    <main className="container mx-auto p-4 space-y-4">
      <Tabs value={location.pathname}>
        <TabsList className='grid grid-cols-2 w-full sm:w-fit gap-1'>
          {tabOptions.map((option) => (
            <TabsTrigger key={option.name} value={option.linkOptions.to ?? ''} className='sm:min-w-42' asChild>
              <Link {...option.linkOptions}>
                <option.icon className='size-3.5 sm:size-4'/>
                <span className='text-xs sm:text-sm'>{option.name}</span>
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Outlet/>
    </main>
  );
}
