import { useRoute } from 'wouter';
import { CitizenFormPage } from './CitizenFormPage';

export default function CitizensEditPage() {
  const [, params] = useRoute('/citizens/:id/edit');

  return <CitizenFormPage mode="edit" citizenId={params?.id} />;
}
