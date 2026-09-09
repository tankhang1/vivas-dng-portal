export type NumberByQueueItem = {
  citizen_item: number;
  id: number;
  number: number;
  queue_item: string;
  queue_name: string;
  staff_item: number;
  staff_name: string | null;
  status: number;
  time_create: string;
  time_create_number: number;
  time_day: number;
  turn_item: number | null;
  zalo_user_id: string;
};

export type NumberByQueuePage = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
};

export type GetNumbersByQueueResponse = {
  content: NumberByQueueItem[];
  page: NumberByQueuePage;
};
