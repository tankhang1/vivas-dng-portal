export type CategoryItem = {
  id: number;
  uuid: number;
  name: string;
  path: string;
  note: string | null;
  order_number: number;
  status: number;
  time_active: string | null;
  time_deactive: string | null;
  type: number;
};

export type CategoryPage = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
};

export type GetCategoriesResponse = {
  content: CategoryItem[];
  page: CategoryPage;
};
