export type DepartmentItem = {
  id: number;
  name: string;
  note: string;
  staff_item: number;
  staff_name: string | null;
  department_root_item: number;
  department_root_name: string | null;
  total_staff: number;
  total_department_sub: number;
};

export type DepartmentPage = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
};

export type GetDepartmentsResponse = {
  content: DepartmentItem[];
  page: DepartmentPage;
};
