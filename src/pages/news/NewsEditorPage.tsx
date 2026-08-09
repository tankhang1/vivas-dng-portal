import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "../../components/Layout";
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
} from "../../components/ui";
import { MediaUpload } from "../../components/MediaUpload";
import { FormEditor } from "../../components/FormEditor";
import { saveNews, getNewsById } from "./store";
import { CalendarDays, Link as LinkIcon } from "lucide-react";
import {
  audienceLabel,
  audienceOptions,
  categoryOptions,
  defaultArticle,
  formatDate,
  linkTypeLabel,
  linkTypeOptions,
  normalizeArticle,
  statusOptions,
  type Audience,
  type LinkType,
  type NewsArticle,
  type NewsCategory,
  type NewsStatus,
} from "./types";

type NewsEditorPageProps = {
  mode: "create" | "edit";
  articleId?: string;
};

export function NewsEditorPage({ mode, articleId }: NewsEditorPageProps) {
  const [, navigate] = useLocation();
  const article = useMemo(() => {
    if (mode === "edit" && articleId) {
      return getNewsById(articleId);
    }
    return null;
  }, [articleId, mode]);

  const [form, setForm] = useState<NewsArticle>(
    mode === "edit" && article ? normalizeArticle(article) : defaultArticle(),
  );

  useEffect(() => {
    if (mode === "edit" && article) {
      setForm(normalizeArticle(article));
    }
  }, [article, mode]);

  const updateForm = (patch: Partial<NewsArticle>) => {
    setForm((prev) => ({
      ...prev,
      ...patch,
    }));
  };

  const handleSave = (status: NewsStatus = form.status) => {
    const payload: NewsArticle = {
      ...form,
      status,
      id: form.id || Date.now().toString(),
    };

    saveNews(payload);
    navigate("/news");
  };

  const title = mode === "create" ? "Tạo mới bản tin" : "Chỉnh sửa bản tin";
  const subtitle =
    mode === "create"
      ? "Soạn nội dung, chọn đối tượng nhận và xuất bản bản tin mới."
      : "Cập nhật nội dung và thông tin hiển thị của bản tin.";

  return (
    <Layout>
      {mode === "edit" && !article ? (
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
              <Button variant="outline" onClick={() => handleSave("draft")}>
                Lưu nháp
              </Button>
              <Button onClick={() => handleSave("published")}>Xuất bản</Button>
            </div>
          </div>

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <Card className="self-start">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Nội dung thông báo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="grid gap-2">
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
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="link-type">Loại liên kết</Label>
                    <Select
                      id="link-type"
                      value={form.linkType}
                      onChange={(e) =>
                        updateForm({ linkType: e.target.value as LinkType })
                      }
                    >
                      {linkTypeOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="link-url">URL liên kết</Label>
                    <Input
                      id="link-url"
                      value={form.linkUrl}
                      onChange={(e) => updateForm({ linkUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
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
                    Soạn nội dung trực tiếp bằng form editor. Nội dung sẽ được
                    lưu dưới dạng HTML.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex w-full flex-col gap-6">
              <Card className="w-full">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-lg">Đối tượng nhận</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid gap-2">
                    <Label htmlFor="audience">Gửi đến</Label>
                    <Select
                      id="audience"
                      value={form.audience}
                      onChange={(e) =>
                        updateForm({ audience: e.target.value as Audience })
                      }
                    >
                      {audienceOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-lg">Ảnh bìa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid gap-2">
                    <Label htmlFor="cover-url">URL ảnh</Label>
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
                      accept="image/*"
                      multiple={false}
                      hint="Chọn 1 ảnh bìa cho bản tin."
                    />
                  )}
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader className="border-b border-border">
                  <CardTitle className="text-lg">Thông tin xuất bản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid gap-2">
                    <Label htmlFor="news-category">Danh mục</Label>
                    <Select
                      id="news-category"
                      value={form.category}
                      onChange={(e) =>
                        updateForm({ category: e.target.value as NewsCategory })
                      }
                    >
                      {categoryOptions.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="news-source">Nguồn tin</Label>
                    <Input
                      id="news-source"
                      value={form.source}
                      onChange={(e) => updateForm({ source: e.target.value })}
                      placeholder="Cổng TTĐT Xã Tây Hồ"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="news-date">Ngày đăng</Label>
                      <Input
                        id="news-date"
                        type="date"
                        value={form.date}
                        onChange={(e) => updateForm({ date: e.target.value })}
                      />
                    </div>
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
                  </div>

                  <div className="rounded-lg border border-dashed border-border bg-slate-50 p-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      <span>{formatDate(form.date)}</span>
                    </div>
                    <div className="mt-2 text-foreground">
                      {linkTypeLabel(form.linkType)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
