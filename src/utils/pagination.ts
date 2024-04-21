/* eslint-disable prettier/prettier */
export type QueryPaginationType = {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
  pageNumber: number;
  pageSize: number;
  skip: number;
};

export type QueryUserPaginationType = {
  searchLoginTerm: string;
  searchEmailTerm: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
  pageNumber: number;
  pageSize: number;
  skip: number;
};

export type PaginationModels<T> = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: T
}

const pageNum = (pageNumber) => {
  if (pageNumber && !isNaN(parseInt(pageNumber, 10)) && parseInt(pageNumber, 10) > 0) {
    return parseInt(pageNumber, 10);
  }
}

export const getQueryPagination = (query: any): QueryPaginationType => {
  const defaultValues: QueryPaginationType = {
    searchNameTerm: "",
    sortBy: "createdAt",
    sortDirection: "desc",
    pageNumber: pageNum(query.pageNumber) ?? 1,
    pageSize: 10,
    skip: 0
  };

  if (query.searchNameTerm) {
    defaultValues.searchNameTerm = query.searchNameTerm;
  }
  if (query.sortBy) {
    defaultValues.sortBy = query.sortBy;
  }
  if (query.sortDirection && query.sortDirection === "asc") {
    defaultValues.sortDirection = "asc";
  }

  if (
    query.pageSize && !isNaN(parseInt(query.pageSize, 10)) && parseInt(query.pageSize, 10) > 0) {
    defaultValues.pageSize = parseInt(query.pageSize, 10);
  }
  defaultValues.skip = (defaultValues.pageNumber - 1) * defaultValues.pageSize;
  return defaultValues;
};

export const getQueryUserPagination = (query: any): QueryUserPaginationType => {
  const defaultValues: QueryUserPaginationType = {
    searchLoginTerm: "",
    searchEmailTerm: "",
    sortBy: "createdAt",
    sortDirection: "desc",
    pageNumber: pageNum(query.pageNumber) ?? 1,
    pageSize: 10,
    skip: 0
  };

  if (query.searchLoginTerm) {
    defaultValues.searchLoginTerm = query.searchLoginTerm;
  }
  if (query.searchEmailTerm) {
    defaultValues.searchEmailTerm = query.searchEmailTerm;
  }
  if (query.sortBy) {
    defaultValues.sortBy = query.sortBy;
  }
  if (query.sortDirection && query.sortDirection === "asc") {
    defaultValues.sortDirection = "asc";
  }

  if (
    query.pageSize &&
    !isNaN(parseInt(query.pageSize, 10)) && parseInt(query.pageSize, 10) > 0) {
    defaultValues.pageSize = parseInt(query.pageSize, 10);
  }

  defaultValues.skip = (defaultValues.pageNumber - 1) * defaultValues.pageSize;
  return defaultValues;
};

