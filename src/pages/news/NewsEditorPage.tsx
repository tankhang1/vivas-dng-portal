import React, { useEffect, useState } from "react";
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
  Select,
  Textarea,
} from "../../shared/components/ui";
import {
  MediaUpload,
  type MediaFile,
} from "../../shared/components/MediaUpload";
import { FormEditor } from "../../shared/components/FormEditor";
import { CURRENT_STAFF, statusOptions, type NewsStatus } from "./types";
import {
  usePostNewsProcessMutation,
  useEditNewsProcessMutation,
  useNewsQuery,
} from "@/features/news/hooks/news.hook";
import { useNewsCategoriesQuery } from "@/features/category-news/hooks/category-news.hook";
import { useUploadImageMutation } from "@/features/upload/hooks/upload.hook";

type NewsEditorPageProps = {
  mode: "create" | "edit";
  articleId?: string;
};

type NewsFormState = {
  title: string;
  categoryItem: number | null;
  shortDescription: string;
  path: string;
  contentHtml: string;
  thumbnail: MediaFile[];
  status: NewsStatus;
};

const defaultFormState = (): NewsFormState => ({
  title: "",
  categoryItem: null,
  shortDescription: "",
  path: "",
  contentHtml: "",
  thumbnail: [],
  status: "draft",
});

export function NewsEditorPage({ mode, articleId }: NewsEditorPageProps) {
  const [, navigate] = useLocation();
  const { data: article, isLoading: isArticleLoading } = useNewsQuery(
    mode === "edit" ? articleId : undefined,
  );
  const { data: categoriesData } = useNewsCategoriesQuery({ sz: 100, nu: 0 });
  const postNewsMutation = usePostNewsProcessMutation();
  const editNewsMutation = useEditNewsProcessMutation();
  const uploadImageMutation = useUploadImageMutation();

  const [form, setForm] = useState<NewsFormState>(defaultFormState());

  useEffect(() => {
    if (mode === "edit" && article) {
      setForm({
        title: article.title,
        categoryItem: article.category_item,
        shortDescription: article.short_describe ?? "",
        path: article.path ?? "",
        contentHtml: article.content ?? "",
        thumbnail: article.thumbnail
          ? [{ id: "cover", name: "cover-image", url: article.thumbnail }]
          : [],
        status: article.status === 1 ? "published" : "draft",
      });
    }
  }, [mode, article]);

  const updateForm = (patch: Partial<NewsFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const handleUploadThumbnail = async (file: File) => {
    const url = await uploadImageMutation.mutateAsync({
      file,
      c: "news-thumbnail",
    });
    if (!url) {
      throw new Error("Upload image response missing url");
    }
    return url;
  };

  const isSaving = postNewsMutation.isPending || editNewsMutation.isPending;

  const handleSave = async (status: NewsStatus) => {
    if (!form.title.trim() || !form.contentHtml.trim() || !form.categoryItem) {
      window.alert("Vui lòng nhập tiêu đề, danh mục và nội dung.");
      return;
    }

    const thumbnail = form.thumbnail[0]?.url ?? "";

    try {
      if (mode === "edit" && article) {
        await editNewsMutation.mutateAsync({
          news_item: article.id,
          category_item: form.categoryItem,
          thumbnail,
          title: form.title,
          path: form.path,
          short_describe: form.shortDescription,
          content: form.contentHtml,
        });
      } else {
        await postNewsMutation.mutateAsync({
          category_item: form.categoryItem,
          thumbnail,
          title: form.title,
          path: form.path,
          short_describe: form.shortDescription,
          content: form.contentHtml,
          staff_item: CURRENT_STAFF.id,
          staff_name: CURRENT_STAFF.name,
        });
      }
      updateForm({ status });
      navigate("/news");
    } catch {
      window.alert("Lưu bản tin thất bại. Vui lòng thử lại.");
    }
  };

  const title = mode === "create" ? "Tạo mới bản tin" : "Chỉnh sửa bản tin";
  const subtitle =
    mode === "create"
      ? "Soạn nội dung, chọn đối tượng nhận và xuất bản bản tin mới."
      : "Cập nhật nội dung và thông tin hiển thị của bản tin.";

  const isNotFound = mode === "edit" && !isArticleLoading && !article;

  return (
    <Layout>
      {isNotFound ? (
        <div className="flex min-h-[50vh] items-center justify-center">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Không tìm thấy bài viết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Bản tin bạn đang chỉnh sửa không tồn tại hoặc đã bị xóa.
              </p>
              <Button onClick={() => navigate("/news")}>
                Quay lại danh sách
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => navigate("/news")}>
                Hủy
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSave("draft")}
                disabled={isSaving}
              >
                Lưu nháp
              </Button>
              <Button
                onClick={() => handleSave("published")}
                disabled={isSaving}
              >
                {isSaving ? "Đang lưu..." : "Xuất bản"}
              </Button>
            </div>
          </div>

          <Card className="w-full">
            <CardContent className="space-y-5 pt-6">
              <div className="grid gap-2">
                <Label htmlFor="cover-url">Ảnh bìa (URL)</Label>
                <Input
                  id="cover-url"
                  value={form.thumbnail[0]?.url ?? ""}
                  onChange={(e) =>
                    updateForm({
                      thumbnail: e.target.value
                        ? [
                            {
                              id: "cover",
                              name: "cover-image",
                              url: e.target.value,
                            },
                          ]
                        : [],
                    })
                  }
                  placeholder="https://..."
                />
              </div>
              {form.thumbnail[0]?.url ? (
                <div className="overflow-hidden rounded-lg border bg-slate-100">
                  <img
                    src={form.thumbnail[0].url}
                    alt={form.title || "Ảnh bìa"}
                    className="h-48 w-full object-cover"
                  />
                </div>
              ) : (
                <MediaUpload
                  value={form.thumbnail}
                  onChange={(thumbnail) => updateForm({ thumbnail })}
                  onUpload={handleUploadThumbnail}
                  accept="image/*"
                  multiple={false}
                  hint="Chọn 1 ảnh bìa cho bản tin."
                />
              )}

              <div className="grid gap-4 md:grid-cols-10">
                <div className="grid gap-2 md:col-span-7">
                  <Label htmlFor="news-title">
                    Tiêu đề <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="news-title"
                    value={form.title}
                    onChange={(e) => updateForm({ title: e.target.value })}
                    placeholder="Tiêu đề thông báo..."
                  />
                </div>
                <div className="grid gap-2 md:col-span-3">
                  <Label htmlFor="news-category">Danh mục</Label>
                  <Select
                    id="news-category"
                    value={form.categoryItem ?? ""}
                    onChange={(e) =>
                      updateForm({ categoryItem: Number(e.target.value) })
                    }
                  >
                    <option value="">Chọn...</option>
                    {categoriesData?.content.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="news-summary">Mô tả ngắn</Label>
                <Textarea
                  id="news-summary"
                  value={form.shortDescription}
                  onChange={(e) =>
                    updateForm({ shortDescription: e.target.value })
                  }
                  placeholder="Mô tả ngắn hiển thị ở danh sách..."
                  className="min-h-[96px]"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="link-url">URL liên kết</Label>
                <Input
                  id="link-url"
                  value={form.path}
                  onChange={(e) => updateForm({ path: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="grid gap-2">
                <Label>
                  Nội dung <span className="text-red-500">*</span>
                </Label>
                <FormEditor
                  value={form.contentHtml}
                  onChange={(contentHtml) => updateForm({ contentHtml })}
                  placeholder="Nhập nội dung thông báo..."
                  className="min-h-[260px]"
                />
                <p className="text-xs text-muted-foreground">
                  Soạn nội dung trực tiếp bằng form editor. Nội dung sẽ được lưu
                  dưới dạng HTML.
                </p>
              </div>

              {mode === "edit" && (
                <div className="grid gap-2">
                  <Label htmlFor="news-status">Trạng thái</Label>
                  <Select
                    id="news-status"
                    value={form.status}
                    onChange={(e) =>
                      updateForm({ status: e.target.value as NewsStatus })
                    }
                  >
                    {statusOptions.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
}
