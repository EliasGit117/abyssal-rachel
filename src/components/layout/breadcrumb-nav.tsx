import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Link, LinkOptions, useMatches } from '@tanstack/react-router';
import { ComponentProps, FC, Fragment } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { IconHome } from '@tabler/icons-react';


export interface IBreadcrumb {
  title: string;
  disabled?: boolean;
  link?: LinkOptions;
}

interface IProps extends ComponentProps<'nav'> {}

const responsiveClassName = 'hidden md:flex';

export const BreadcrumbsNavigation: FC<IProps> = ({ className, ...props }) => {
  const matches = useMatches();
  const hideBreadcrumbs = matches.some((match) => match.staticData?.hideCrumbs === true);
  if (hideBreadcrumbs)
    return null;

  const items = matches
    .filter((match) => match.loaderData?.crumbs !== undefined || match.staticData?.crumbs !== undefined)
    .flatMap(({ pathname, loaderData, staticData }) => {
      const loaderCrumbs = parseBreadcrumbList(loaderData?.crumbs);
      const staticCrumbs = parseBreadcrumbList(staticData?.crumbs);
      const crumbs = loaderCrumbs ?? staticCrumbs ?? [];

      return crumbs
        .filter((crumb) => !crumb.disabled)
        .map((crumb) => ({ href: pathname, label: crumb.title, link: crumb.link }));
    });

  if (items.length === 0)
    return null;

  return (
    <nav className={cn(className)} {...props}>
      <div className="flex w-max py-1">
        <Breadcrumb>
          <BreadcrumbList>
            <Button size="icon-sm" variant="ghost" className={responsiveClassName} asChild>
              <Link to="/">
                <IconHome/>
              </Link>
            </Button>

            <BreadcrumbSeparator className={cn('-ml-2', responsiveClassName)}/>

            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              const linkOptions: LinkOptions = item.link ? item.link : { href: item.href };

              if (!isLast) {
                return (
                  <Fragment key={`${index}-${item.label}`}>
                    <BreadcrumbLink className={responsiveClassName} asChild>
                      <Link {...linkOptions}>
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                    <BreadcrumbSeparator
                      className={responsiveClassName}
                    />
                  </Fragment>
                );
              }

              return (
                <BreadcrumbItem key={`${index}-${item.label}`} className="ml-2 md:ml-0">
                  <BreadcrumbPage>
                    {item.label}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </nav>
  );
};

function isBreadcrumb(value: unknown): value is IBreadcrumb {
  if (typeof value !== 'object' || value === null)
    return false;

  const data = value as Record<string, unknown>;

  return (
    typeof data.title === 'string' &&
    (data.disabled === undefined || typeof data.disabled === 'boolean') &&
    (data.link === undefined || typeof data.link === 'object')
  );
}


function parseBreadcrumbList(value: unknown): IBreadcrumb[] | null {
  if (isBreadcrumb(value))
    return [value];

  if (Array.isArray(value) && value.every(isBreadcrumb))
    return value;

  return null;
}
