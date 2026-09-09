export type QueueItem = {
  id: number;
  queue_id: string;
  queue_name: string;
  available: number;
};

export type GetQueueResponse = QueueItem[];
