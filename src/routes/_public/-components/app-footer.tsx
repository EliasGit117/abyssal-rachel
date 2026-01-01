import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';
import TwitterLogo from '@/assets/icons/socials/twitter.svg?react';
import YoutubeLogo from '@/assets/icons/socials/youtube.svg?react';
import Logo from '@/assets/icons/logo.svg?react';
import { Button } from '@/components/ui/button';
import { envConfig } from '@/lib/env-config.ts';


interface IProps extends ComponentProps<'footer'> {
}

export const AppFooter: FC<IProps> = ({ className, ...props }) => {

  return (
    <footer
      className={cn(
        'bg-muted text-muted-foreground dark:text-foreground space-y-8',
        className)
      }
      {...props}
    >
      <div className="container mx-auto p-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 order-last md:order-first">
          <p className="text-xs md:text-sm text-center md:text-start">
            <b>{envConfig.appName}:</b> Building NO. A13-1, Yiku Industrial Park, The Hills, Dongyi Road, Panyu District,
            Guangzhou,
            China 511492
          </p>

          <p className="text-xs md:text-sm text-center md:text-start">
            <b>Email:</b> info@imou.md, <b>Phone:</b> +86-020-3567 2981
          </p>
        </div>

        <div className="flex flex-col gap-6 items-center md:items-end order-first md:order-last">
          <Logo className="h-8 max-w-30 text-muted-foreground"/>

          <div className="flex gap-2 items-center">
            {socialLinks.map(({ icon: Icon, href }) => (
              <Button
                key={href}
                size="icon-sm"
                variant="ghost"
                className="rounded-full bg-muted-foreground! text-muted!"
              >
                <Icon className='size-4'/>
                <span className="sr-only">Youtube link</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};


const socialLinks: { icon: FC<{ className?: string; }>; href: string; }[] = [
  { icon: YoutubeLogo, href: 'https://youtube.com' },
  { icon: TwitterLogo, href: 'https://x.com' }
];

