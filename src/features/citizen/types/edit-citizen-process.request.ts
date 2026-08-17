export type EditCitizenProcessRequest = {
  id: number;
  zalo_user_id: string;
  citizen_number: string;
  name: string;
  avatar: string;
  email: string;
  address: string;
  hamlet: string;
  gender: number;
  degree: string;
  career: string;
  ethnicity: string;
  religion: string;
  note: string;
};
