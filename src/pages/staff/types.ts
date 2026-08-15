import type { MediaFile } from '../../shared/components/MediaUpload';

export type StaffStatus = 'active' | 'inactive';

export type StaffExtraField = {
  key: string;
  value: string;
};

export type StaffRecord = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  department: string;
  field: string;
  position: string;
  status: StaffStatus;
  avatar: MediaFile[];
  extraFields: StaffExtraField[];
};

export const statusOptions: { value: StaffStatus; label: string }[] = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Tạm khóa' },
];

export function defaultStaff(): StaffRecord {
  return {
    id: '',
    name: '',
    username: '',
    email: '',
    phone: '',
    department: '',
    field: '',
    position: '',
    status: 'active',
    avatar: [],
    extraFields: [],
  };
}

export function normalizeStaff(staff: any): StaffRecord {
  return {
    ...defaultStaff(),
    id: staff.id ?? '',
    name: staff.name ?? '',
    username: staff.username ?? '',
    email: staff.email ?? '',
    phone: staff.phone ?? '',
    department: staff.department ?? '',
    field: staff.field ?? '',
    position: staff.position ?? staff.role ?? '',
    status: staff.status === 'inactive' ? 'inactive' : 'active',
    avatar: staff.avatar ?? [],
    extraFields: staff.extraFields ?? [],
  };
}

export function statusLabel(status: StaffStatus) {
  return status === 'active' ? 'Hoạt động' : 'Tạm khóa';
}

export function statusBadgeVariant(status: StaffStatus) {
  return status === 'active' ? 'success' : 'warning';
}
