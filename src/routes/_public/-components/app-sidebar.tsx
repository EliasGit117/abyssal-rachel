import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { useAppSidebar } from './app-sidebar-provider';
import { ComponentProps, FC } from 'react';
import { cn } from '@/lib/utils';
import { baseLinks, ILinkItem, MenuItemType } from '@/routes/_public/-consts';
import { IconLayoutSidebar } from '@tabler/icons-react';
import { useSession } from '@/hooks/use-session.ts';


export const AppSidebar = () => {
  const isOpen = useAppSidebar((s) => s.isOpen);
  const setOpen = useAppSidebar((s) => s.setOpen);
  const session = useSession();
  let links = baseLinks;
  if (!session)
    links = baseLinks.filter(link => !link.protected);

  const handleClick = () => setOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            Navigation Links
          </SheetTitle>

          <SheetDescription className="max-w-xs">
            Navigate through different sections of the website
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-5 overflow-y-auto">
          <Accordion type="single" className="w-full" collapsible>
            {links.map((link, index) => {
              if (link.type === MenuItemType.Group) {
                return (
                  <AccordionItem
                    key={`group-${index}`}
                    value={`group-${index}`}
                    className="border-0"
                  >
                    <AccordionTrigger className="text-lg">
                      {link.title}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 pt-2 px-0">
                      {link.items.map((item, subIndex) => (
                        <SidebarLink
                          key={`group-item-${index}-${subIndex}`}
                          item={item}
                          variant="ghost"
                          onClick={handleClick}
                          size="sm"
                        />
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              if (link.type === MenuItemType.Single) {
                return (
                  <SidebarLink
                    className="py-4"
                    key={`single-${index}`}
                    item={link.item}
                    variant="link"
                    onClick={handleClick}
                    size="md"
                  />
                );
              }

              return null;
            })}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface ISidebarLinkProps {
  item: ILinkItem;
  variant?: 'link' | 'ghost';
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md';
}


const SidebarLink: FC<ISidebarLinkProps> = (props) => {
  const {
    item,
    variant = 'link',
    onClick,
    className,
    size = 'md'
  } = props;

  const labelClass = size === 'sm' ? 'text-sm font-medium' : 'text-lg font-medium';
  const descClass = size === 'sm' ? 'text-xs' : 'text-sm';
  const paddingClass = size === 'sm' ? 'p-1 px-2' : 'p-2';

  return (
    <Button
      size="dense"
      variant={variant}
      className={cn('justify-start h-fit w-full gap-0 no-underline!', paddingClass, className)}
      onClick={onClick}
      asChild
    >
      <Link to={item.linkOpt.to} className="flex flex-col items-start px-0">
        <span className={labelClass}>{item.label}</span>
        {item.description && (
          <span className={cn(descClass, 'text-muted-foreground whitespace-pre-line')}>
            {item.description}
          </span>
        )}
      </Link>
    </Button>
  );
};

interface IAppSidebarTrigger extends ComponentProps<typeof Button> {
  iconProps?: ComponentProps<typeof IconLayoutSidebar>;
}

export const AppSidebarTrigger: FC<IAppSidebarTrigger> = ({ className, onClick, iconProps, ...props }) => {
  const open = useAppSidebar(s => s.open);

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event);
        open();
      }}
      {...props}
    >
      <IconLayoutSidebar {...iconProps}/>
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};
