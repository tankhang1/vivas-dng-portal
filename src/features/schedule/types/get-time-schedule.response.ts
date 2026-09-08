export type TimeScheduleItem = {
  id: number;
  code: string;
  range_time: string;
};

export type GetTimeScheduleResponse = TimeScheduleItem[];
