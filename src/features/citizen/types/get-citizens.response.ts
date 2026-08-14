export type CitizenItem = {
  address: string | null;
  avatar: string | null;
  citizen_number: string | null;
  email: string | null;
  followed_oa: number;
  hamlet: string | null;
  id: number;
  name: string;
  phone: string;
  province_code: string | null;
  province_name: string | null;
  status: number;
  time_active: string | null;
  time_create: string;
  time_deactive: string | null;
  ward_code: string | null;
  ward_name: string | null;
  zalo_user_id: string;
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

export type GetCitizensResponse = {
  content: CitizenItem[];
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
