import { normalizeBanner, type BannerRecord } from './types';

let bannerState: BannerRecord[] = [
  normalizeBanner({
    id: '1',
    title: 'Banner Tết 2024',
    clickUrl: '/news/tet-2024',
    position: 'home-top',
    order: 1,
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-02-29',
  }),
  normalizeBanner({
    id: '2',
    title: 'Tiêm chủng mở rộng',
    clickUrl: '/news/tiem-chung',
    position: 'home-middle',
    order: 2,
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2024-04-30',
  }),
];

export function getBanners() {
  return [...bannerState];
}

export function getBannerById(id: string) {
  return bannerState.find((item) => item.id === id) ?? null;
}

export function saveBanner(banner: BannerRecord) {
  const nextBanner = normalizeBanner({
    ...banner,
    id: banner.id || Date.now().toString(),
  });

  const exists = bannerState.some((item) => item.id === nextBanner.id);
  bannerState = exists
    ? bannerState.map((item) => (item.id === nextBanner.id ? nextBanner : item))
    : [nextBanner, ...bannerState];
}

export function deleteBanner(id: string) {
  bannerState = bannerState.filter((item) => item.id !== id);
}
