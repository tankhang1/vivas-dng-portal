import type { BasePaginationResponse } from "@/shared/types/base-response";

export type NewsItem = {
  id: number;
  category_item: number;
  thumbnail: string | null;
  title: string;
  path: string | null;
  short_describe: string;
  content: string;
  status: number;
  time_create_number: number;
  time_create: string;
  time_active: string | null;
  time_deactive: string | null;
  star_index: number;
  time_day: number;
  staff_item: number;
  staff_name: string;
  staff_approval_item: number;
  staff_approval_name: string | null;
  url: string | null;
};

export type GetNewsResponse = BasePaginationResponse<NewsItem>;
