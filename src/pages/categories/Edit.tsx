import { useRoute } from 'wouter';
import { CategoryFormPage } from './CategoryFormPage';

export default function CategoriesEditPage() {
  const [, params] = useRoute('/categories/:id/edit');

  return <CategoryFormPage mode="edit" categoryId={params?.id} />;
}
