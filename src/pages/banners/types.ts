import type { MediaFile } from '../../components/MediaUpload';

export type BannerPosition = 'home-top' | 'home-middle' | 'home-bottom' | 'news-top';
export type BannerStatus = 'active' | 'inactive';

export type BannerRecord = {
  id: string;
  title: string;
  clickUrl: string;
  position: BannerPosition;
  order: number;
  status: BannerStatus;
  startDate: string;
  endDate: string;
  image: MediaFile[];
};

export const bannerPositionOptions: { value: BannerPosition; label: string }[] = [
  { value: 'home-top', label: 'Trang chủ - Trên cùng' },
  { value: 'home-middle', label: 'Trang chủ - Giữa trang' },
  { value: 'home-bottom', label: 'Trang chủ - Cuối trang' },
  { value: 'news-top', label: 'Tin tức - Phía trên' },
];

export const bannerStatusOptions: { value: BannerStatus; label: string }[] = [
  { value: 'active', label: 'Kích hoạt' },
  { value: 'inactive', label: 'Tạm ẩn' },
];

export function defaultBanner(): BannerRecord {
  return {
    id: '',
    title: '',
    clickUrl: '',
    position: 'home-top',
    order: 1,
    status: 'active',
    startDate: '',
    endDate: '',
    image: [],
  };
}

export function normalizeBanner(banner: Partial<BannerRecord>): BannerRecord {
  return {
    ...defaultBanner(),
    ...banner,
    title: banner.title ?? '',
    clickUrl: banner.clickUrl ?? '',
    position: banner.position ?? 'home-top',
    order: banner.order ?? 1,
    status: banner.status ?? 'active',
    startDate: banner.startDate ?? '',
    endDate: banner.endDate ?? '',
    image: banner.image ?? [],
  };
}

export const bannerPositionLabel = (position: BannerPosition) =>
  bannerPositionOptions.find((item) => item.value === position)?.label ?? position;

export const bannerStatusLabel = (status: BannerStatus) =>
  bannerStatusOptions.find((item) => item.value === status)?.label ?? status;

export const formatBannerDate = (value: string) =>
  value
    ? new Date(value).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : '-';
