import { ClientOnly, createFileRoute } from '@tanstack/react-router';
import {
  Map,
  MapLocateControl,
  MapMarker,
  MapTileLayer,
  MapZoomControl
} from '@/components/ui/map.tsx';
import { IconBuildingStore, IconClipboardCheck, IconCopy, IconMapPinFilled } from '@tabler/icons-react';
import GoogleMapsLogo from '@/assets/icons/google-maps.svg?react';
import { ButtonGroup } from '@/components/ui/button-group.tsx';
import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';
import { toast } from 'sonner';


export const Route = createFileRoute('/_public/contact')({
  component: RouteComponent,
  staticData: {
    breadcrumbs: { title: 'Contact' }
  }
});


function RouteComponent() {
  return (
    <main className="container mx-auto p-4 space-y-4 min-h-safe-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shops.map((shop) => (
          <ClientOnly key={shop.name}>
            <Map center={shop.coordinates} className="border">
              <div
                className={cn(
                  'absolute top-1 left-1 z-1000 h-fit border',
                  'pl-3 pr-1 py-2 bg-secondary rounded-md space-y-0.5'
                )}
              >
                <div className="flex gap-1 items-center">
                  <IconBuildingStore className="size-3.5"/>
                  <p className="text-sm">
                    {shop.name}
                  </p>
                </div>

                <div className="flex gap-2 items-center">
                  <p className="text-xs text-muted-foreground">
                    {shop.location}
                  </p>

                  <Button
                    variant="ghost"
                    size="icon-xs" className="text-muted-foreground"
                    onClick={() => {
                      void navigator.clipboard.writeText(shop.location);
                      toast('Copied to clipboard', { icon: <IconClipboardCheck className="size-4"/> });
                    }}
                  >
                    <IconCopy/>
                  </Button>
                </div>
              </div>


              {shop.googleMapUrl && (
                <ButtonGroup
                  orientation="horizontal"
                  aria-label="Zoom controls"
                  className="absolute top-auto left-1 right-auto bottom-1 z-1000 h-fit"
                >
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="secondary"
                    className="border border-border"
                    asChild
                  >
                    <a href={shop.googleMapUrl} target="_blank">
                      <GoogleMapsLogo/>
                    </a>
                  </Button>
                </ButtonGroup>
              )}

              <MapTileLayer/>
              <MapZoomControl className="right-1 top-1 left-auto bottom-auto"/>
              <MapLocateControl className="border border-border"/>
              <MapMarker
                position={shop.coordinates}
                icon={<IconMapPinFilled className="size-6 text-muted-foreground"/>}
              />
            </Map>
          </ClientOnly>
        ))}

      </div>
    </main>
  );
}

interface IShopDto {
  name: string;
  location: string;
  coordinates: [number, number];
  googleMapUrl?: string;
}

const shops: IShopDto[] = [
  {
    name: 'Chișinău',
    location: 'Chișinău, str. Mitropolit Varlaam 65',
    coordinates: [47.021748, 28.840547],
    googleMapUrl: 'https://maps.app.goo.gl/xvt6obHprodBdVNx6'
  },
  {
    name: 'Bălți',
    location: 'Bălți, str. Kiev 107',
    coordinates: [47.775253, 27.928640],
    googleMapUrl: 'https://maps.app.goo.gl/Qf2CMnHw3ztHwAzy9'
  }
];
