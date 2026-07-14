import { useRoute } from 'wouter';
import { StaffFormPage } from './StaffFormPage';

export default function StaffEditPage() {
  const [, params] = useRoute('/staff/:id/edit');

  return <StaffFormPage mode="edit" staffId={params?.id} />;
}
