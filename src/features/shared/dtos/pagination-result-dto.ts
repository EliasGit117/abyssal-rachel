import { PageNumberCounters, PageNumberPagination } from 'prisma-extension-pagination/dist/types';


export interface IPaginationResultBase<T> {
  items: T[];
  page: number;
}


export interface IPaginationResultWithCountDto<T> extends IPaginationResultBase<T> {
  pageCount: number;
  totalCount: number;
}

export class PaginationResultDtoFactory {

  static get<T>(items: T[], meta: PageNumberPagination): IPaginationResultBase<T> {

    return {
      items: items,
      page: meta.currentPage
    };
  }

  static getWithCount<T>(items: T[], meta: PageNumberPagination & PageNumberCounters): IPaginationResultWithCountDto<T> {

    return {
      items: items,
      page: meta.currentPage,
      pageCount: meta.pageCount,
      totalCount: meta.totalCount
    };
  }
}