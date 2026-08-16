export type DivisionItem = {
  id: number;
  name: string;
  note: string;
};

export type DepartmentPage = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
};

export type GetDivisionsResponse = {
  content: DivisionItem[];
  page: DepartmentPage;
};
