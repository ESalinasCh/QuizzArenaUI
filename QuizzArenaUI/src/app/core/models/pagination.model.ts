export interface PagedRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  [key: string]: unknown;
}

export const DEFAULT_PAGE_SIZE = 6;
