import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "../../shared/components/Layout";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
} from "../../shared/components/ui";
import { categoryTypeLabel, type CategoryType } from "./types";
import {
  useCreateCategoryNewsProcessMutation,
  useEditCategoryNewsProcessMutation,
  useNewsCategoriesQuery,
} from "@/features/category-news/hooks/category-news.hook";
import {
  useCommentCategoriesQuery,
  useCreateCategoryCommentProcessMutation,
  useEditCategoryCommentProcessMutation,
} from "@/features/category-comment/hooks/category-comment.hook";

type CategoryFormPageProps = {
  mode: "create" | "edit";
  categoryId?: string;
};

function readTypeFromSearch(): CategoryType {
  const params = new URLSearchParams(window.location.search);
  return params.get("type") === "feedback" ? "feedback" : "news";
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CategoryFormPage({ mode, categoryId }: CategoryFormPageProps) {
  const type = readTypeFromSearch();

  if (type === "news") {
    return <NewsCategoryForm mode={mode} categoryId={categoryId} />;
  }
  return <FeedbackCategoryForm mode={mode} categoryId={categoryId} />;
}

type CategoryFormFields = {
  name: string;
  path: string;
  note: string;
  orderNumber: number;
};

const defaultFields = (): CategoryFormFields => ({
  name: "",
  path: "",
  note: "",
  orderNumber: 0,
});

function CategoryFormShell({
  title,
  subtitle,
  isSaving,
  onSave,
  onCancel,
  fields,
  onFieldsChange,
}: {
  title: string;
  subtitle: React.ReactNode;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  fields: CategoryFormFields;
  onFieldsChange: (patch: Partial<CategoryFormFields>) => void;
}) {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={onCancel}>
              Hủy
            </Button>
            <Button onClick={onSave} disabled={isSaving}>
              {isSaving ? "Đang lưu..." : "Lưu danh mục"}
            </Button>
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
                value={fields.name}
                onChange={(event) =>
                  onFieldsChange({ name: event.target.value })
                }
                placeholder="Nhập tên danh mục"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="category-path">Đường dẫn</Label>
                <Input
                  id="category-path"
                  value={fields.path}
                  onChange={(event) =>
                    onFieldsChange({ path: event.target.value })
                  }
                  placeholder="Để trống sẽ tự tạo từ tên danh mục"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category-order">Thứ tự hiển thị</Label>
                <Input
                  id="category-order"
                  type="number"
                  value={fields.orderNumber}
                  onChange={(event) =>
                    onFieldsChange({
                      orderNumber: Number(event.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category-note">Ghi chú</Label>
              <Textarea
                id="category-note"
                value={fields.note}
                onChange={(event) =>
                  onFieldsChange({ note: event.target.value })
                }
                placeholder="Ghi chú về danh mục..."
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={onSave} disabled={isSaving}>
                {isSaving ? "Đang lưu..." : "Lưu danh mục"}
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Hủy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

function NewsCategoryForm({
  mode,
  categoryId,
}: {
  mode: "create" | "edit";
  categoryId?: string;
}) {
  const [, navigate] = useLocation();
  // No get-category-by-id endpoint; the bounded sz:100 list (same batch
  // already used to populate category dropdowns elsewhere) doubles as a
  // lookup source for edit.
  const { data, isLoading } = useNewsCategoriesQuery({ sz: 100, nu: 0 });
  const category = useMemo(() => {
    if (mode !== "edit" || !categoryId) return null;
    return data?.content.find((item) => String(item.id) === categoryId) ?? null;
  }, [data, mode, categoryId]);

  const createMutation = useCreateCategoryNewsProcessMutation();
  const editMutation = useEditCategoryNewsProcessMutation();

  const [fields, setFields] = useState<CategoryFormFields>(defaultFields());

  useEffect(() => {
    if (mode === "edit" && category) {
      setFields({
        name: category.name,
        path: category.path ?? "",
        note: category.note ?? "",
        orderNumber: category.order_number,
      });
    }
  }, [mode, category]);

  const isSaving = createMutation.isPending || editMutation.isPending;
  const isNotFound = mode === "edit" && !isLoading && !category;

  const handleSave = async () => {
    const name = fields.name.trim();
    const path = fields.path.trim() || slugify(name);
    if (!name) {
      window.alert("Vui lòng nhập tên danh mục.");
      return;
    }

    try {
      if (mode === "edit" && category) {
        await editMutation.mutateAsync({
          category_item: category.id,
          name,
          path,
          note: fields.note,
          order_number: fields.orderNumber,
        });
      } else {
        await createMutation.mutateAsync({
          name,
          path,
          note: fields.note,
          order_number: fields.orderNumber,
        });
      }
      navigate("/categories");
    } catch {
      window.alert("Lưu danh mục thất bại. Vui lòng thử lại.");
    }
  };

  if (isNotFound) {
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
            <Button onClick={() => navigate("/categories")}>
              Quay lại danh sách
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <CategoryFormShell
      title={
        mode === "edit" ? "Chỉnh sửa danh mục" : "Tạo danh mục Tin tức mới"
      }
      subtitle={
        <>Danh mục thuộc nhóm <span className="font-medium text-foreground">Tin tức</span>.</>
      }
      isSaving={isSaving}
      onSave={handleSave}
      onCancel={() => navigate("/categories")}
      fields={fields}
      onFieldsChange={(patch) => setFields((current) => ({ ...current, ...patch }))}
    />
  );
}

function FeedbackCategoryForm({
  mode,
  categoryId,
}: {
  mode: "create" | "edit";
  categoryId?: string;
}) {
  const [, navigate] = useLocation();
  // No get-category-by-id endpoint; the bounded sz:100 list doubles as a
  // lookup source for edit, same approach as NewsCategoryForm above.
  const { data, isLoading } = useCommentCategoriesQuery({ sz: 100, nu: 0 });
  const category = useMemo(() => {
    if (mode !== "edit" || !categoryId) return null;
    return data?.content.find((item) => String(item.id) === categoryId) ?? null;
  }, [data, mode, categoryId]);

  const createMutation = useCreateCategoryCommentProcessMutation();
  const editMutation = useEditCategoryCommentProcessMutation();

  const [fields, setFields] = useState<CategoryFormFields>(defaultFields());

  useEffect(() => {
    if (mode === "edit" && category) {
      setFields({
        name: category.name,
        path: category.path ?? "",
        note: category.note ?? "",
        orderNumber: category.order_number,
      });
    }
  }, [mode, category]);

  const isSaving = createMutation.isPending || editMutation.isPending;
  const isNotFound = mode === "edit" && !isLoading && !category;

  const handleSave = async () => {
    const name = fields.name.trim();
    const path = fields.path.trim() || slugify(name);
    if (!name) {
      window.alert("Vui lòng nhập tên danh mục.");
      return;
    }

    try {
      if (mode === "edit" && category) {
        await editMutation.mutateAsync({
          category_item: category.id,
          name,
          path,
          note: fields.note,
          order_number: fields.orderNumber,
        });
      } else {
        // No parent-category picker in this UI yet, so new categories are
        // always created at the top level.
        await createMutation.mutateAsync({
          category_item: 0,
          name,
          path,
          note: fields.note,
          order_number: fields.orderNumber,
        });
      }
      navigate("/categories");
    } catch {
      window.alert("Lưu danh mục thất bại. Vui lòng thử lại.");
    }
  };

  if (isNotFound) {
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
            <Button onClick={() => navigate("/categories")}>
              Quay lại danh sách
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <CategoryFormShell
      title={
        mode === "edit"
          ? "Chỉnh sửa danh mục"
          : `Tạo danh mục ${categoryTypeLabel("feedback")} mới`
      }
      subtitle={
        <>
          Danh mục thuộc nhóm{" "}
          <span className="font-medium text-foreground">
            {categoryTypeLabel("feedback")}
          </span>
          .
        </>
      }
      isSaving={isSaving}
      onSave={handleSave}
      onCancel={() => navigate("/categories")}
      fields={fields}
      onFieldsChange={(patch) => setFields((current) => ({ ...current, ...patch }))}
    />
  );
}
