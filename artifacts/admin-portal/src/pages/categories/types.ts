import type { MediaFile } from '../../components/MediaUpload';

export type CategoryRouteType = 'path' | 'link';

export type CategoryRecord = {
  id: string;
  name: string;
  slug: string;
  routeType: CategoryRouteType;
  icon: MediaFile[];
  description: string;
  order: number;
  isPinned: boolean;
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
