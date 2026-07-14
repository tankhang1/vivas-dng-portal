import type { MediaFile } from '../../components/MediaUpload';

export type CitizenStatus = 'published' | 'draft';
export type Gender = 'Nam' | 'Nữ' | 'Khác' | '-' | '';

export type CitizenRecord = {
  id: string;
  name: string;
  cccd: string;
  phone: string;
  gender: Gender;
  household: string;
  relationship: string;
  status: CitizenStatus;
  address: string;
  interactions: number;
  birthday: string;
  email: string;
  occupation: string;
  education: string;
  ethnicity: string;
  religion: string;
  notes: string;
  area: string;
  avatar: MediaFile[];
  householdCode: string;
  householdSize: string;
  householdHeadRelation: string;
  householdAddress: string;
  systemUser: string;
  zmaUser: string;
  syncFromZma: boolean;
  linkByPhone: boolean;
};

export const genderOptions: Gender[] = ['Nam', 'Nữ', 'Khác'];
export const householdOptions = ['Hộ ông Nguyễn Văn A', 'Hộ bà Trần Thị B'];
export const relationOptions = ['Chủ hộ', 'Vợ/chồng', 'Con', 'Khác'];
export const areaOptions = ['Khu phố 1', 'Khu phố 2', 'Khu phố 3', 'Khu phố 4'];
export const staffOptions = ['Nguyễn Văn A', 'Phạm Thị D', 'Lê Văn C'];
export const zmaOptions = ['Bùi Hải Hà', 'Giàng A Phố', 'Lê Quốc Anh'];

export function defaultCitizen(): CitizenRecord {
  return {
    id: '',
    name: '',
    cccd: '',
    phone: '',
    gender: '',
    household: '',
    relationship: '',
    status: 'published',
    address: '',
    interactions: 0,
    birthday: '',
    email: '',
    occupation: '',
    education: '',
    ethnicity: '',
    religion: '',
    notes: '',
    area: '',
    avatar: [],
    householdCode: '',
    householdSize: '',
    householdHeadRelation: '',
    householdAddress: '',
    systemUser: '',
    zmaUser: '',
    syncFromZma: false,
    linkByPhone: false,
  };
}

export function normalizeCitizen(citizen: any): CitizenRecord {
  return {
    ...defaultCitizen(),
    id: citizen.id ?? '',
    name: citizen.name ?? '',
    cccd: citizen.cccd ?? '-',
    phone: citizen.phone ?? '',
    gender: citizen.gender ?? '-',
    household: citizen.household ?? '-',
    relationship: citizen.relationship ?? '-',
    status: citizen.status ?? 'published',
    address: citizen.address ?? '-',
    interactions: citizen.interactions ?? 0,
    birthday: citizen.birthday ?? '-',
    email: citizen.email ?? '-',
    occupation: citizen.occupation ?? '-',
    education: citizen.education ?? '-',
    ethnicity: citizen.ethnicity ?? '-',
    religion: citizen.religion ?? '-',
    notes: citizen.notes ?? '-',
    area: citizen.area ?? (citizen.address ? String(citizen.address).split(',')[0].trim() : '-'),
    avatar: citizen.avatar ?? [],
    householdCode: citizen.householdCode ?? '-',
    householdSize: citizen.householdSize ?? '0',
    householdHeadRelation: citizen.householdHeadRelation ?? '-',
    householdAddress: citizen.householdAddress ?? citizen.address ?? '-',
    systemUser: citizen.systemUser ?? '-',
    zmaUser: citizen.zmaUser ?? '-',
    syncFromZma: citizen.syncFromZma ?? false,
    linkByPhone: citizen.linkByPhone ?? false,
  };
}

export function statusLabel(status: CitizenStatus) {
  return status === 'published' ? 'Đã xuất bản' : 'Bản nháp';
}

export function statusBadgeVariant(status: CitizenStatus) {
  return status === 'published' ? 'success' : 'warning';
}

export function displayCitizenValue(value: string | number | boolean | undefined) {
  if (typeof value === 'boolean') return value ? 'Có' : 'Không';
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
}
