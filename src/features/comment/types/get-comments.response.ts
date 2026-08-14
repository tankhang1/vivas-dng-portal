export type CommentItem = {
  id: number;
  category_item: number;
  citizen_item: number;
  staff_approve_item: number;
  staff_item: number;
  c_uuid: string;
  name: string;
  zalo_user_id: string;
  phone: string;
  address: string;
  title: string;
  content: string;
  url: string;
  status: number;
  time_create_number: number;
  time_create: string;
  time_active: string | null;
  time_deactive: string | null;
  annonymous: number;
  time_day: number;
  rating: number;
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

export type GetCommentsResponse = {
  content: CommentItem[];
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
