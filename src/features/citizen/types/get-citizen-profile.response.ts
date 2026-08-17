export type CitizenProfile = {
  address: string | null;
  avatar: string | null;
  career: string | null;
  citizen_number: string | null;
  degree: string | null;
  email: string | null;
  ethnicity: string | null;
  followed_oa: number;
  gender: number | null;
  hamlet: string | null;
  id: number;
  name: string;
  note: string | null;
  phone: string;
  province_code: string | null;
  province_name: string | null;
  religion: string | null;
  status: number;
  time_active: string | null;
  time_create: string;
  time_deactive: string | null;
  ward_code: string | null;
  ward_name: string | null;
  zalo_user_id: string;
};

export type GetCitizenProfileResponse = CitizenProfile;
