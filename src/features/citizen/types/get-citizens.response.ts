import type { BasePaginationResponse } from "@/shared/types/base-response";

export type CitizenItem = {
  address: string | null;
  avatar: string | null;
  citizen_number: string | null;
  email: string | null;
  followed_oa: number;
  hamlet: string | null;
  id: number;
  name: string;
  phone: string;
  province_code: string | null;
  province_name: string | null;
  status: number;
  time_active: string | null;
  time_create: string;
  time_deactive: string | null;
  ward_code: string | null;
  ward_name: string | null;
  zalo_user_id: string;
};

export type GetCitizensResponse = BasePaginationResponse<CitizenItem>;
