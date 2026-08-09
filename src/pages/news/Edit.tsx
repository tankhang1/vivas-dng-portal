import { useRoute } from 'wouter';
import { NewsEditorPage } from './NewsEditorPage';

export default function NewsEditPage() {
  const [, params] = useRoute('/news/:id/edit');

  return <NewsEditorPage mode="edit" articleId={params?.id} />;
}
