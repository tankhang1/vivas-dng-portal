import type { MediaFile } from '../../components/MediaUpload';

export type CategoryRouteType = 'path' | 'link';
export type CategoryStatus = 'visible' | 'hidden';

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  routeType: CategoryRouteType;
  icon: MediaFile[];
  description: string;
  order: number;
  isPinned: boolean;
  status: CategoryStatus;
};

export function defaultCategory(): CategoryRecord {
  return {
    id: '',
    name: '',
    slug: '',
    routeType: 'path',
    icon: [],
    description: '',
    order: 0,
    isPinned: false,
    status: 'visible',
  };
}

export function normalizeCategory(category: Partial<CategoryRecord>): CategoryRecord {
  return {
    ...defaultCategory(),
    ...category,
    name: category.name ?? '',
    slug: category.slug ?? '',
    routeType: category.routeType ?? 'path',
    icon: category.icon ?? [],
    description: category.description ?? '',
    order: category.order ?? 0,
    isPinned: category.isPinned ?? false,
    status: category.status ?? 'visible',
  };
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
