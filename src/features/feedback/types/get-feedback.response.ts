export type FeedbackDetailResponse = {
  id: number;
  comment_item: number;
  f_uuid: string;
  url: string;
  content: string;
  title_url: string;
  time_create_number: number;
  time_create: string;
  status: number;
  time_active: string | null;
  time_deactive: string | null;
  staff_approve_item: number;
  staff_approve_name: string | null;
  staff_item: number;
  staff_name: string;
  time_day: number;
};
