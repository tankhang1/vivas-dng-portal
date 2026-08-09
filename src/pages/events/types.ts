import type { MediaFile } from '../../components/MediaUpload';

export type EventStatus = 'draft' | 'published';
export type EventCategory = 'hoi-nghi' | 'tap-huan' | 'le-hoat-dong';

export type EventItem = {
  id: string;
  category: EventCategory;
  title: string;
  startAt: string;
  endAt: string;
  location: string;
  thumbnail: MediaFile[];
  shortDescription: string;
  descriptionHtml: string;
  notesHtml: string;
  isPublic: boolean;
  requiresRegistration: boolean;
  trackAttendance: boolean;
  showMobileRegisterButton: boolean;
  useQrCheckin: boolean;
  registrationDeadline: string;
  organizer: string;
  contactEmail: string;
  bookingCapacity: string;
  maxGuests: string;
  onlineLink: string;
  status: EventStatus;
};

export const eventCategories: {
  value: EventCategory;
  label: string;
  description: string;
}[] = [
  {
    value: 'hoi-nghi',
    label: 'Hội nghị',
    description: 'Dùng cho các hội nghị, buổi làm việc, tọa đàm hoặc họp chuyên đề.',
  },
  {
    value: 'tap-huan',
    label: 'Tập huấn',
    description: 'Dùng cho chương trình đào tạo, tập huấn hoặc hướng dẫn nghiệp vụ.',
  },
  {
    value: 'le-hoat-dong',
    label: 'Lễ / Hoạt động',
    description: 'Dùng cho lễ kỷ niệm, khai mạc, hoạt động cộng đồng hoặc sự kiện nổi bật.',
  },
];

export function defaultEvent(): EventItem {
  return {
    id: '',
    category: 'hoi-nghi',
    title: '',
    startAt: '',
    endAt: '',
    location: '',
    thumbnail: [],
    shortDescription: '',
    descriptionHtml: '',
    notesHtml: '',
    isPublic: true,
    requiresRegistration: true,
    trackAttendance: true,
    showMobileRegisterButton: true,
    useQrCheckin: false,
    registrationDeadline: '',
    organizer: '',
    contactEmail: '',
    bookingCapacity: '',
    maxGuests: '',
    onlineLink: '',
    status: 'draft',
  };
}

export function normalizeEvent(event: any): EventItem {
  return {
    ...defaultEvent(),
    id: event.id ?? '',
    category: event.category ?? 'hoi-nghi',
    title: event.title ?? '',
    startAt: event.startAt ?? '',
    endAt: event.endAt ?? '',
    location: event.location ?? '',
    thumbnail: event.thumbnail ?? [],
    shortDescription: event.shortDescription ?? '',
    descriptionHtml: event.descriptionHtml ?? '',
    notesHtml: event.notesHtml ?? '',
    isPublic: event.isPublic ?? true,
    requiresRegistration: event.requiresRegistration ?? true,
    trackAttendance: event.trackAttendance ?? true,
    showMobileRegisterButton: event.showMobileRegisterButton ?? true,
    useQrCheckin: event.useQrCheckin ?? false,
    registrationDeadline: event.registrationDeadline ?? '',
    organizer: event.organizer ?? '',
    contactEmail: event.contactEmail ?? '',
    bookingCapacity: event.bookingCapacity ?? '',
    maxGuests: event.maxGuests ?? '',
    onlineLink: event.onlineLink ?? '',
    status: event.status ?? 'draft',
  };
}

export const categoryLabel = (category: EventCategory) =>
  eventCategories.find((item) => item.value === category)?.label ?? category;

export const statusLabel = (status: EventStatus) =>
  status === 'published' ? 'Đã xuất bản' : 'Bản nháp';

export const statusVariant = (status: EventStatus) =>
  status === 'published' ? 'success' : 'secondary';

export function formatDateTime(value: string) {
  if (!value) return 'Chưa cập nhật';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function splitDateTime(value: string) {
  if (!value) return { date: '', time: '' };
  const [date, time = ''] = value.split('T');
  return { date, time };
}

export function combineDateTime(date: string, time: string) {
  if (!date) return '';
  return `${date}T${time || '00:00'}`;
}

export function nowAsDateTimeLocal() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}
