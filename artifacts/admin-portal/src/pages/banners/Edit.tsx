import { useRoute } from 'wouter';
import { BannerFormPage } from './BannerFormPage';

export default function BannersEditPage() {
  const [, params] = useRoute('/banners/:id/edit');

  return <BannerFormPage mode="edit" bannerId={params?.id} />;
}
