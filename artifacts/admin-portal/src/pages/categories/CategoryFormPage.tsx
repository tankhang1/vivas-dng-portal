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
  Textarea,
} from '../../components/ui';
import { getCategoryById, saveCategory } from './store';
import { defaultCategory, slugify, type CategoryRecord, type CategoryRouteType, type CategoryStatus } from './types';

type CategoryFormPageProps = {
  mode: 'create' | 'edit';
  categoryId?: string;
};

export function CategoryFormPage({ mode, categoryId }: CategoryFormPageProps) {
  const [, navigate] = useLocation();
  const category = useMemo(() => {
    if (mode === 'edit' && categoryId) {
      return getCategoryById(categoryId);
    }
    return null;
  }, [categoryId, mode]);

  const [form, setForm] = useState<CategoryRecord>(defaultCategory());

  useEffect(() => {
    if (mode === 'edit' && category) {
      setForm(category);
    } else {
      setForm(defaultCategory());
    }
  }, [category, mode]);

  const updateForm = (patch: Partial<CategoryRecord>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const routePlaceholder =
    form.routeType === 'link' ? 'https://example.com' : '/news/danh-muc';

  const handleSave = () => {
    saveCategory({
      ...form,
      id: mode === 'edit' ? form.id : Date.now().toString(),
    });
    navigate('/categories');
  };

  if (mode === 'edit' && !category) {
    return (
      <Layout>
        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle>Không tìm thấy danh mục</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Danh mục bạn muốn chỉnh sửa không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => navigate('/categories')}>Quay lại danh sách</Button>
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
              {mode === 'edit' ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
            </h1>
            <p className="text-muted-foreground">
              Quản lý danh mục nội dung, icon hiển thị và ghim danh mục quan trọng.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate('/categories')}>
              Hủy
            </Button>
            <Button onClick={handleSave}>Lưu danh mục</Button>
          </div>
        </div>

        <Card className="mx-auto w-full max-w-3xl">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg">Thông tin danh mục</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-2">
              <Label htmlFor="category-name">
                Tên danh mục <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category-name"
                value={form.name}
                onChange={(event) => {
                  const value = event.target.value;
                  updateForm({
                    name: value,
                    slug: form.slug ? form.slug : slugify(value),
                  });
                }}
                placeholder="Nhập tên danh mục"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category-slug">Đường dẫn</Label>
              <div className="grid gap-3 md:grid-cols-[160px_1fr]">
                <Select
                  id="category-route-type"
                  value={form.routeType}
                  onChange={(event) =>
                    updateForm({ routeType: event.target.value as CategoryRouteType })
                  }
                >
                  <option value="path">Path</option>
                  <option value="link">Link</option>
                </Select>
                <Input
                  id="category-slug"
                  value={form.slug}
                  onChange={(event) =>
                    updateForm({
                      slug:
                        form.routeType === 'path'
                          ? slugify(event.target.value)
                          : event.target.value,
                    })
                  }
                  placeholder={routePlaceholder}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Path dùng cho link nội bộ, Link dùng cho URL ngoài.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category-icon">Icon</Label>
              <MediaUpload
                value={form.icon}
                onChange={(icon) => updateForm({ icon })}
                accept="image/*"
                multiple={false}
                hint="Tải ảnh icon danh mục, khuyến nghị ảnh vuông."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category-description">Mô tả</Label>
              <Textarea
                id="category-description"
                value={form.description}
                onChange={(event) => updateForm({ description: event.target.value })}
                placeholder="Mô tả ngắn về danh mục..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category-order">
                Thứ tự <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category-order"
                type="number"
                value={form.order}
                onChange={(event) => updateForm({ order: Number(event.target.value) || 0 })}
                placeholder="0"
              />
            </div>

            <label className="flex items-center gap-2 rounded-md border border-dashed border-border px-3 py-3 text-sm">
              <input
                type="checkbox"
                checked={form.isPinned}
                onChange={(event) => updateForm({ isPinned: event.target.checked })}
              />
              Ghim danh mục lên đầu
            </label>

            <div className="grid gap-2">
              <Label htmlFor="category-status">Trạng thái</Label>
              <Select
                id="category-status"
                value={form.status}
                onChange={(event) =>
                  updateForm({ status: event.target.value as CategoryStatus })
                }
              >
                <option value="visible">Hiện</option>
                <option value="hidden">Ẩn</option>
              </Select>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={handleSave}>Lưu danh mục</Button>
              <Button variant="outline" onClick={() => navigate('/categories')}>
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
