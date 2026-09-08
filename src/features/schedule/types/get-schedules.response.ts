export type ScheduleItem = {
  id: number;
  category_item: number;
  category_name: string | null;
  citizen_item: number;
  staff_item: number;
  s_uuid: string;
  name: string;
  zalo_user_id: string;
  phone: string;
  address: string;
  title: string;
  content: string;
  status: number;
  time_create_number: number;
  time_create: string;
  time_cancel: string | null;
  time_verify: string | null;
  time_met: string | null;
  time_day_schedule: number;
  schedule_hour: string;
  rating: number;
  content_feedback: string | null;
};

export type SchedulePage = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
};

export type GetSchedulesResponse = {
  content: ScheduleItem[];
  page: SchedulePage;
};
