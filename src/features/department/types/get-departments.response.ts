export type DepartmentItem = {
  id: number;
  name: string;
  note: string;
};

export type PageableSort = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

export type Pageable = {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  sort: PageableSort;
  unpaged: boolean;
};

export type GetDepartmentsResponse = {
  content: DepartmentItem[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: Pageable;
  size: number;
  sort: PageableSort;
  totalElements: number;
  totalPages: number;
};
