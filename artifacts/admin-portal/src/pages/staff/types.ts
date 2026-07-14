import type { MediaFile } from '../../components/MediaUpload';

export type StaffStatus = 'active' | 'inactive';
export type MobileVisibility = 'public' | 'department' | 'internal' | 'hidden';

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
  position: string;
  status: StaffStatus;
  avatar: MediaFile[];
  extraFields: StaffExtraField[];
  mobileVisibility: MobileVisibility;
};

export const mobileVisibilityOptions: {
  value: MobileVisibility;
  label: string;
  description: string;
}[] = [
  {
    value: 'public',
    label: 'Công khai',
    description: 'Mọi người truy cập app đều thấy liên hệ này.',
  },
  {
    value: 'department',
    label: 'Theo phòng ban',
    description: 'Chỉ cán bộ cùng phòng ban hoặc được phân quyền mới thấy.',
  },
  {
    value: 'internal',
    label: 'Nội bộ',
    description: 'Chỉ hiển thị cho tài khoản nội bộ được phép xem.',
  },
  {
    value: 'hidden',
    label: 'Ẩn',
    description: 'Không hiển thị trên Mobile.',
  },
];

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
    position: '',
    status: 'active',
    avatar: [],
    extraFields: [],
    mobileVisibility: 'public',
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
    position: staff.position ?? staff.role ?? '',
    status: staff.status === 'inactive' ? 'inactive' : 'active',
    avatar: staff.avatar ?? [],
    extraFields: staff.extraFields ?? [],
    mobileVisibility: staff.mobileVisibility ?? 'public',
  };
}

export function statusLabel(status: StaffStatus) {
  return status === 'active' ? 'Hoạt động' : 'Tạm khóa';
}

export function statusBadgeVariant(status: StaffStatus) {
  return status === 'active' ? 'success' : 'warning';
}

export function visibilityLabel(visibility: MobileVisibility) {
  return (
    mobileVisibilityOptions.find((item) => item.value === visibility)?.label ?? visibility
  );
}

export function visibilityDescription(visibility: MobileVisibility) {
  return (
    mobileVisibilityOptions.find((item) => item.value === visibility)?.description ??
    visibility
  );
}
