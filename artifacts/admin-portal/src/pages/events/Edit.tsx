import { useRoute } from 'wouter';
import { EventFormPage } from './EventFormPage';

export default function EventsEditPage() {
  const [, params] = useRoute('/events/:id/edit');

  return <EventFormPage mode="edit" eventId={params?.id} />;
}
