export type HotlineItem = {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  phone_zalo: string;
  potition: string;
  department: string;
};

export type GetHotlineResponse = HotlineItem[];
