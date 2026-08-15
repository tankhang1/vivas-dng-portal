export type CategoryType = 'feedback' | 'news';

export type CategoryRecord = {
  id: string;
  name: string;
  note: string;
  type: CategoryType;
};

export const categoryTypeOptions: { value: CategoryType; label: string }[] = [
  { value: 'feedback', label: 'Phản ánh' },
  { value: 'news', label: 'Tin tức' },
];

export function categoryTypeLabel(type: CategoryType) {
  return categoryTypeOptions.find((item) => item.value === type)?.label ?? type;
}

export function defaultCategory(type: CategoryType = 'news'): CategoryRecord {
  return {
    id: '',
    name: '',
    note: '',
    type,
  };
}

export function normalizeCategory(category: Partial<CategoryRecord>): CategoryRecord {
  return {
    ...defaultCategory(),
    ...category,
    name: category.name ?? '',
    note: category.note ?? '',
    type: category.type ?? 'news',
  };
}
