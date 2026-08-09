import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { Layout } from '../../components/Layout';
import { MediaUpload } from '../../components/MediaUpload';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
} from '../../components/ui';
import { getBannerById, saveBanner } from './store';
import {
  bannerPositionOptions,
  bannerStatusOptions,
  defaultBanner,
  type BannerRecord,
  type BannerStatus,
} from './types';

type BannerFormPageProps = {
  mode: 'create' | 'edit';
  bannerId?: string;
};

export function BannerFormPage({ mode, bannerId }: BannerFormPageProps) {
  const [, navigate] = useLocation();
  const banner = useMemo(() => {
    if (mode === 'edit' && bannerId) {
      return getBannerById(bannerId);
    }
    return null;
  }, [bannerId, mode]);

  const [form, setForm] = useState<BannerRecord>(defaultBanner());

  useEffect(() => {
    if (mode === 'edit' && banner) {
      setForm(banner);
    } else {
      setForm(defaultBanner());
    }
  }, [banner, mode]);

  const updateForm = (patch: Partial<BannerRecord>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const handleSave = () => {
    saveBanner({
      ...form,
      id: mode === 'edit' ? form.id : Date.now().toString(),
    });
    navigate('/banners');
  };

  if (mode === 'edit' && !banner) {
    return (
      <Layout>
        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle>Không tìm thấy banner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Banner bạn muốn chỉnh sửa không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => navigate('/banners')}>Quay lại danh sách</Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {mode === 'edit' ? 'Chỉnh sửa banner' : 'Tạo banner mới'}
            </h1>
            <p className="text-muted-foreground">
              Cấu hình ảnh banner, đường dẫn khi click và lịch hiển thị.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate('/banners')}>
              Hủy
            </Button>
            <Button onClick={handleSave}>Lưu thông tin</Button>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Thông tin banner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="grid gap-2">
                  <Label htmlFor="banner-title">
                    Tiêu đề banner <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="banner-title"
                    value={form.title}
                    onChange={(event) => updateForm({ title: event.target.value })}
                    placeholder="VD: Banner Tết 2024"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="banner-url">Đường dẫn khi click</Label>
                  <Input
                    id="banner-url"
                    value={form.clickUrl}
                    onChange={(event) => updateForm({ clickUrl: event.target.value })}
                    placeholder="/news/tet-2024 hoặc https://..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Đường dẫn sẽ mở khi người dùng click vào banner.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Hình ảnh banner</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <MediaUpload
                  value={form.image}
                  onChange={(image) => updateForm({ image })}
                  accept="image/*"
                  multiple={false}
                  hint="Nhấn hoặc kéo thả ảnh banner. Khuyến nghị: 750x300px - tỷ lệ 2.5:1."
                />
                <div className="grid gap-2">
                  <Label htmlFor="banner-image-url">Nhập URL ảnh</Label>
                  <Input
                    id="banner-image-url"
                    value={form.image[0]?.url || ''}
                    onChange={(event) =>
                      updateForm({
                        image: event.target.value
                          ? [
                              {
                                id: 'banner-image',
                                name: 'banner-image',
                                url: event.target.value,
                              },
                            ]
                          : [],
                      })
                    }
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Thời gian hiển thị</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="banner-start">Ngày bắt đầu</Label>
                  <Input
                    id="banner-start"
                    type="date"
                    value={form.startDate}
                    onChange={(event) => updateForm({ startDate: event.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Để trống = hiển thị ngay.</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="banner-end">Ngày kết thúc</Label>
                  <Input
                    id="banner-end"
                    type="date"
                    value={form.endDate}
                    onChange={(event) => updateForm({ endDate: event.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Để trống = không giới hạn.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5 self-start">
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Cài đặt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-2">
                  <Label htmlFor="banner-position">
                    Vị trí <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    id="banner-position"
                    value={form.position}
                    onChange={(event) =>
                      updateForm({ position: event.target.value as BannerRecord['position'] })
                    }
                  >
                    {bannerPositionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="banner-order">
                    Thứ tự hiển thị <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="banner-order"
                    type="number"
                    value={form.order}
                    onChange={(event) =>
                      updateForm({ order: Number(event.target.value) || 0 })
                    }
                    placeholder="1"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={form.status === 'active'}
                    onChange={(event) =>
                      updateForm({
                        status: event.target.checked ? 'active' : 'inactive',
                      })
                    }
                  />
                  Kích hoạt banner
                </label>

                <div className="grid gap-2">
                  <Label htmlFor="banner-status">Trạng thái</Label>
                  <Select
                    id="banner-status"
                    value={form.status}
                    onChange={(event) =>
                      updateForm({ status: event.target.value as BannerStatus })
                    }
                  >
                    {bannerStatusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </Layout>
  );
}
