import { createFileRoute } from '@tanstack/react-router';



export const Route = createFileRoute('/_public/')({
  component: RouteComponent,
  staticData: {
    headerOptions: { type: 'fixed' },
  },
});

function RouteComponent() {
  return (
    <>
      <img
        className='object-cover min-h-svh'
        src="https://static-website.imou.com/bb5ef2ed-7f03-44cd-9eac-de57a94aeb27.jpg"
        alt="background image"
      />

      <main className="container mx-auto p-4 space-y-4 min-h-svh">
      </main>
    </>
  );
}
