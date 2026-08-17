export type StaffItem = {
  id: number;
  name: string;
  avatar: string | null;
  email: string | null;
  phone: string | null;
  potition: string | null;
  status: number;
  time_active: string | null;
  time_deactive: string | null;
  department_name: string;
  department_item: number;
  division_item?: number;
  division_name?: string | null;
};

export type StaffPage = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
};

export type GetStaffsResponse = {
  content: StaffItem[];
  page: StaffPage;
};
