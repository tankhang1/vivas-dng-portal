import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { Layout } from '../../shared/components/Layout';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
} from '../../shared/components/ui';
import { getCategoryById, saveCategory } from './store';
import { categoryTypeLabel, defaultCategory, type CategoryRecord, type CategoryType } from './types';

type CategoryFormPageProps = {
  mode: 'create' | 'edit';
  categoryId?: string;
};

function readTypeFromSearch(): CategoryType {
  const params = new URLSearchParams(window.location.search);
  return params.get('type') === 'feedback' ? 'feedback' : 'news';
}

export function CategoryFormPage({ mode, categoryId }: CategoryFormPageProps) {
  const [, navigate] = useLocation();
  const category = useMemo(() => {
    if (mode === 'edit' && categoryId) {
      return getCategoryById(categoryId);
    }
    return null;
  }, [categoryId, mode]);

  const [form, setForm] = useState<CategoryRecord>(() =>
    mode === 'create' ? defaultCategory(readTypeFromSearch()) : defaultCategory(),
  );

  useEffect(() => {
    if (mode === 'edit' && category) {
      setForm(category);
    } else if (mode === 'create') {
      setForm(defaultCategory(readTypeFromSearch()));
    }
  }, [category, mode]);

  const updateForm = (patch: Partial<CategoryRecord>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

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

  const typeLabel = categoryTypeLabel(form.type);

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {mode === 'edit' ? 'Chỉnh sửa danh mục' : `Tạo danh mục ${typeLabel} mới`}
            </h1>
            <p className="text-muted-foreground">
              Danh mục thuộc nhóm <span className="font-medium text-foreground">{typeLabel}</span>.
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
                onChange={(event) => updateForm({ name: event.target.value })}
                placeholder="Nhập tên danh mục"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category-note">Ghi chú</Label>
              <Textarea
                id="category-note"
                value={form.note}
                onChange={(event) => updateForm({ note: event.target.value })}
                placeholder="Ghi chú về danh mục..."
              />
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
