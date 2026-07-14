import { normalizeCategory, type CategoryRecord } from './types';

let categoryState: CategoryRecord[] = [
  normalizeCategory({
    id: '1',
    name: 'Giới thiệu',
    slug: 'gioi-thieu',
    routeType: 'path',
    icon: [],
    description: 'Giới thiệu về địa phương',
    order: 0,
    isPinned: true,
  }),
  normalizeCategory({
    id: '2',
    name: 'Chính trị',
    slug: 'chinh-tri',
    routeType: 'path',
    icon: [],
    description: '',
    order: 1,
    isPinned: false,
  }),
  normalizeCategory({
    id: '3',
    name: 'Kinh tế',
    slug: 'kinh-te',
    routeType: 'path',
    icon: [],
    description: '',
    order: 2,
    isPinned: false,
  }),
  normalizeCategory({
    id: '4',
    name: 'Văn hóa - Xã hội',
    slug: 'van-hoa-xa-hoi',
    routeType: 'path',
    icon: [],
    description: '',
    order: 3,
    isPinned: false,
  }),
  normalizeCategory({
    id: '5',
    name: 'An ninh - Quốc phòng',
    slug: 'an-ninh-quoc-phong',
    routeType: 'path',
    icon: [],
    description: '',
    order: 4,
    isPinned: false,
  }),
  normalizeCategory({
    id: '6',
    name: 'Chuyển đổi số',
    slug: 'chuyen-doi-so',
    routeType: 'path',
    icon: [],
    description: '',
    order: 5,
    isPinned: false,
  }),
];

export function getCategories() {
  return [...categoryState];
}

export function getCategoryById(id: string) {
  return categoryState.find((item) => item.id === id) ?? null;
}

export function saveCategory(category: CategoryRecord) {
  const nextCategory = normalizeCategory({
    ...category,
    id: category.id || Date.now().toString(),
  });

  const exists = categoryState.some((item) => item.id === nextCategory.id);
  categoryState = exists
    ? categoryState.map((item) => (item.id === nextCategory.id ? nextCategory : item))
    : [nextCategory, ...categoryState];

  categoryState = categoryState.sort(
    (left, right) =>
      Number(right.isPinned) - Number(left.isPinned) ||
      left.order - right.order ||
      left.name.localeCompare(right.name),
  );
}

export function deleteCategory(id: string) {
  categoryState = categoryState.filter((item) => item.id !== id);
}
