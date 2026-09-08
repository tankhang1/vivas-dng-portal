export type StaffCoordinateScheduleItem = {
  id: number;
  time_create_number: number;
  time_create: string;
  time_deactive: string | null;
  status: number;
  schedule_category_item: number;
  schedule_category_name: string;
  staff_item: number;
  staff_name: string;
};

export type StaffCoordinateSchedulePage = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
};

export type GetStaffCoordinateSchedulesByCategoryResponse = {
  content: StaffCoordinateScheduleItem[];
  page: StaffCoordinateSchedulePage;
};
