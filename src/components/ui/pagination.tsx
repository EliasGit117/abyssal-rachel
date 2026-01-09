import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { ComponentProps, forwardRef } from 'react';
import { Link, LinkProps } from '@tanstack/react-router';
import { useIsMobile } from '@/hooks/use-mobile';
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconDots } from '@tabler/icons-react';

const Pagination = ({ className, ...props }: ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
);
Pagination.displayName = 'Pagination';

const PaginationContent = forwardRef<
  HTMLUListElement,
  ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-row items-center gap-1', className)}
    {...props}
  />
));
PaginationContent.displayName = 'PaginationContent';

const PaginationItem = forwardRef<
  HTMLLIElement,
  ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
PaginationItem.displayName = 'PaginationItem';

type TPaginationLinkProps =
  { isActive?: boolean }
  & Pick<ComponentProps<typeof Button>, 'size' | 'className' | 'variant'>
  & LinkProps;

const PaginationLink = (props: TPaginationLinkProps) => {
  const { className, isActive, size = 'icon', variant, disabled, ...restOfProps } = props;

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        buttonVariants({ variant: !!variant ? variant : isActive ? 'outline' : 'ghost', size: size }),
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
      {...restOfProps}
    />
  );
};

PaginationLink.displayName = 'PaginationLink';

interface IPaginationPreviousProps extends ComponentProps<typeof PaginationLink> {
  textHidden?: boolean;
}

const PaginationPrevious = (props: IPaginationPreviousProps) => {
  const { className, textHidden, ...restOfProps } = props;

  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn(!textHidden && 'gap-1 pl-2.5', className)}
      {...restOfProps}
    >
      <IconChevronLeft className="h-4 w-4"/>
      {!textHidden && <span>Previous</span>}
    </PaginationLink>
  );
};

PaginationPrevious.displayName = 'PaginationPrevious';


interface IPaginationFirstProps extends ComponentProps<typeof PaginationLink> {
  textHidden?: boolean;
}

const PaginationFirst = (props: IPaginationFirstProps) => {
  const { className, textHidden, ...restOfProps } = props;

  return (
    <PaginationLink
      aria-label="Go to first page"
      size="default"
      className={cn(!textHidden && 'gap-1 pl-2.5', className)}
      {...restOfProps}
    >
      {!textHidden && <span>First</span>}
      <IconChevronsLeft className="h-4 w-4"/>
    </PaginationLink>
  );
};

PaginationFirst.displayName = 'PaginationFirst';

interface IPaginationNextProps extends ComponentProps<typeof PaginationLink> {
  textHidden?: boolean;
}

const PaginationNext = (props: IPaginationNextProps) => {
  const { className, textHidden, ...restOfProps } = props;

  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn(!textHidden && 'gap-1 pl-2.5', className)}
      {...restOfProps}
    >
      {!textHidden && <span>Next</span>}
      <IconChevronRight className="h-4 w-4"/>
    </PaginationLink>
  );
};

PaginationNext.displayName = 'PaginationNext';

interface IPaginationLastProps extends ComponentProps<typeof PaginationLink> {
  textHidden?: boolean;
}

const PaginationLast = (props: IPaginationLastProps) => {
  const { className, textHidden, ...restOfProps } = props;

  return (
    <PaginationLink
      aria-label="Go to last page"
      size="default"
      className={cn(!textHidden && 'gap-1 pl-2.5', className)}
      {...restOfProps}
    >
      {!textHidden && <span>Last</span>}
      <IconChevronsRight className="h-4 w-4"/>
    </PaginationLink>
  );
};

PaginationLast.displayName = 'PaginationLast';

const PaginationEllipsis = ({
                              className,
                              ...props
                            }: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <IconDots className="h-4 w-4"/>
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = 'PaginationEllipsis';


interface IBasicPaginationProps {
  page?: number;
  totalPages?: number;
  className?: string;
  resetScroll?: boolean;
}

function BasicPagination({ className, page = 1, totalPages = 1, resetScroll }: IBasicPaginationProps) {
  const isMobile = useIsMobile();

  const pages = getPaginationList({
    page: page,
    totalPages: totalPages,
    maxItemCount: isMobile ? 7 : 9
  });


  return (
    <div className={className}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              to="."
              textHidden
              disabled={page <= 1}
              resetScroll={resetScroll}
              search={(pv) => ({ ...pv, page: page - 1 })}
            />
          </PaginationItem>

          {pages.map((p, idx) => (
            <PaginationItem key={idx}>
              {p === -1 ? (
                <PaginationEllipsis/>
              ) : (
                <PaginationLink
                  to="."
                  resetScroll={resetScroll}
                  search={(pv) => ({ ...pv, page: p })}
                  className={cn('transition-none', isMobile && 'text-xs')}
                  isActive={p === page}
                >
                  {p}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              to="."
              textHidden
              disabled={page >= totalPages}
              resetScroll={resetScroll}
              search={(pv) => ({ ...pv, page: page + 1 })}
            />
          </PaginationItem>

        </PaginationContent>
      </Pagination>
    </div>
  );
}
BasicPagination.displayName = 'BasicPagination';


interface IGetPaginationListParams {
  page: number;
  totalPages: number;
  maxItemCount: number;
}

function getPaginationList(params: IGetPaginationListParams): number[] {
  const { page, totalPages, maxItemCount } = params;
  if (totalPages <= 0) return [];
  if (totalPages <= maxItemCount) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const nearBeginningThreshold = Math.ceil(maxItemCount / 2);
  const nearEndThreshold = totalPages - Math.ceil(maxItemCount / 2) + 1;

  const result = [];

  if (page <= nearBeginningThreshold) {
    for (let i = 1; i <= maxItemCount - 2; i++) {
      result.push(i);
    }
    result.push(-1);
    result.push(totalPages);
    return result;
  }

  if (page >= nearEndThreshold) {
    result.push(1);
    result.push(-1);
    for (let i = totalPages - (maxItemCount - 3); i <= totalPages; i++) {
      result.push(i);
    }
    return result;
  }

  result.push(1);
  result.push(-1);

  const middleCount = maxItemCount - 4;

  const halfMiddle = Math.floor(middleCount / 2);
  const middleStart = Math.max(2, page - halfMiddle);
  const middleEnd = Math.min(totalPages - 1, middleStart + middleCount - 1);

  for (let i = middleStart; i <= middleEnd; i++) {
    result.push(i);
  }

  result.push(-1);
  result.push(totalPages);
  return result;
}


export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationLast,
  PaginationFirst,
  BasicPagination
};
