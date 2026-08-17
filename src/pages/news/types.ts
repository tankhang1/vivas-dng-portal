import type { MediaFile } from '../../shared/components/MediaUpload';
import { getCurrentStaff } from '@/shared/api';

export const CURRENT_STAFF = {
  get id() {
    return getCurrentStaff().id;
  },
  get name() {
    return getCurrentStaff().name;
  },
};

export type NewsStatus = 'draft' | 'published';
export type Audience = 'all-citizens' | 'residents' | 'staff' | 'leaders';
export type LinkType = 'none' | 'external' | 'document' | 'attachment';

export type NewsArticle = {
  id: string;
  title: string;
  categoryName: string;
  status: NewsStatus;
  date: string;
  source: string;
  media: MediaFile[];
  thumbnail: MediaFile[];
  shortDescription: string;
  contentHtml: string;
  audience: Audience;
  linkType: LinkType;
  linkUrl: string;
};

export const audienceOptions: { value: Audience; label: string }[] = [
  { value: 'all-citizens', label: 'Tất cả người dân' },
  { value: 'residents', label: 'Cư dân trong khu vực' },
  { value: 'staff', label: 'Cán bộ, công chức' },
  { value: 'leaders', label: 'Lãnh đạo, quản lý' },
];

export const linkTypeOptions: { value: LinkType; label: string }[] = [
  { value: 'none', label: 'Không có' },
  { value: 'external', label: 'Liên kết ngoài' },
  { value: 'document', label: 'Tài liệu đính kèm' },
  { value: 'attachment', label: 'Liên kết nội bộ' },
];

export const statusOptions: { value: NewsStatus; label: string }[] = [
  { value: 'draft', label: 'Lưu nháp' },
  { value: 'published', label: 'Xuất bản' },
];

export const defaultArticle = (): NewsArticle => ({
  id: '',
  title: '',
  categoryName: '',
  status: 'draft',
  date: new Date().toISOString().split('T')[0],
  source: '',
  media: [],
  thumbnail: [],
  shortDescription: '',
  contentHtml: '',
  audience: 'all-citizens',
  linkType: 'none',
  linkUrl: '',
});

export const normalizeArticle = (article: Partial<NewsArticle>): NewsArticle => ({
  ...defaultArticle(),
  ...article,
  media: article.media ?? [],
  thumbnail: article.thumbnail ?? [],
  shortDescription: article.shortDescription ?? '',
  contentHtml: article.contentHtml ?? '',
  audience: article.audience ?? 'all-citizens',
  linkType: article.linkType ?? 'none',
  linkUrl: article.linkUrl ?? '',
});

export const audienceLabel = (audience: Audience) =>
  audienceOptions.find((item) => item.value === audience)?.label ?? audience;

export const linkTypeLabel = (linkType: LinkType) =>
  linkTypeOptions.find((item) => item.value === linkType)?.label ?? linkType;

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

export const sourceLabel = (source: string) => source || 'Chưa rõ nguồn';
