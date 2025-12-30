import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { isMatch, Link, useMatches } from '@tanstack/react-router';
import { ComponentProps, FC, Fragment } from 'react';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { IconHome } from '@tabler/icons-react';

const breadcrumbDataSchema = z.object({
  title: z.string(),
  disabled: z.boolean().optional(),
  link: z.string().optional()
});

const breadcrumbListSchema = z.union([
  breadcrumbDataSchema,
  z.array(breadcrumbDataSchema)
]);

export type TBreadcrumbData = z.infer<typeof breadcrumbDataSchema>;

interface IProps extends ComponentProps<'nav'> {}

const responsiveClassName = 'hidden md:flex';

export const BreadcrumbsNavigation: FC<IProps> = ({ className, ...props }) => {
  const matches = useMatches();

  const hideBreadcrumbs = matches.some(
    (match) => match.staticData.hideBreadcrumbs === true
  );

  if (hideBreadcrumbs) return null;

  const matchesWithCrumbs = matches.filter((match) => {
    return (
      // @ts-ignore
      isMatch(match, 'loaderData.breadcrumbs') ||
      isMatch(match, 'staticData.breadcrumbs')
    );
  });

  const items = matchesWithCrumbs
    .flatMap(({ pathname, staticData, loaderData }) => {
      const res: TBreadcrumbData[] = [];
      // @ts-ignore
      const hasLoaderData = isMatch(loaderData, 'breadcrumbs');
      const loaderValidation =
        hasLoaderData &&
        breadcrumbListSchema.safeParse(loaderData['breadcrumbs']);

      if (loaderValidation && loaderValidation.success) {
        const data = loaderValidation.data;
        const breadcrumbs = Array.isArray(data) ? data : [data];
        breadcrumbs
          .filter((item) => !item.disabled)
          .forEach((breadcrumb) => {
            res.push(breadcrumb);
          });

        return res.map((breadcrumb) => ({
          href: breadcrumb.link ?? pathname,
          label: breadcrumb.title
        }));
      }

      if (staticData.breadcrumbs) {
        const breadcrumbs = Array.isArray(staticData.breadcrumbs)
          ? staticData.breadcrumbs
          : [staticData.breadcrumbs];

        breadcrumbs.forEach((breadcrumb) => {
          res.push(breadcrumb);
        });
      }

      return res.map((breadcrumb) => ({
        href: breadcrumb.link ?? pathname,
        label: breadcrumb.title
      }));
    })
    .filter((i) => i.label);

  if (items.length <= 0) return null;

  return (
    <nav className={cn( className)} {...props}>
      <div className="flex w-max py-1">
        <Breadcrumb>
          <BreadcrumbList>
            <Button size="icon-sm" variant="ghost" className={responsiveClassName} asChild>
              <Link to="/">
                <IconHome/>
              </Link>
            </Button>

            <BreadcrumbSeparator className={cn('-ml-1', responsiveClassName)}/>

            {items.map((item, index) => {
              if (index < items.length - 1) {
                return (
                  <Fragment key={`${index}-${item.label}`}>
                    <BreadcrumbLink className={responsiveClassName} asChild>
                      <Link to={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                    {index < items.length - 1 && (
                      <BreadcrumbSeparator className={responsiveClassName}/>
                    )}
                  </Fragment>
                );
              }

              return (
                <BreadcrumbItem
                  key={`${index}-${item.label}`}
                  className="ml-2 md:ml-0"
                >
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </nav>
  );
};