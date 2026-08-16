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

export type CommentPage = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
};

export type GetCommentsResponse = {
  content: CommentItem[];
  page: CommentPage;
};
