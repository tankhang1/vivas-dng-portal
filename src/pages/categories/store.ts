import { normalizeCategory, type CategoryRecord } from './types';

let categoryState: CategoryRecord[] = [
  normalizeCategory({
    id: '1',
    name: 'Giới thiệu',
    note: 'Giới thiệu về địa phương',
    type: 'news',
  }),
  normalizeCategory({
    id: '2',
    name: 'Chính trị',
    note: '',
    type: 'news',
  }),
  normalizeCategory({
    id: '3',
    name: 'Kinh tế',
    note: '',
    type: 'news',
  }),
  normalizeCategory({
    id: '4',
    name: 'Văn hóa - Xã hội',
    note: '',
    type: 'news',
  }),
  normalizeCategory({
    id: '5',
    name: 'Môi trường',
    note: 'Phản ánh liên quan đến môi trường',
    type: 'feedback',
  }),
  normalizeCategory({
    id: '6',
    name: 'Trật tự đô thị',
    note: '',
    type: 'feedback',
  }),
  normalizeCategory({
    id: '7',
    name: 'An ninh',
    note: '',
    type: 'feedback',
  }),
];

export function getCategories() {
  return [...categoryState];
}

export function getCategoriesByType(type: CategoryRecord['type']) {
  return categoryState.filter((item) => item.type === type);
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

  categoryState = categoryState.sort((left, right) => left.name.localeCompare(right.name));
}

export function deleteCategory(id: string) {
  categoryState = categoryState.filter((item) => item.id !== id);
}
