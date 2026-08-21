import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../shared/components/ui/form";
import { FormInputField } from "../../shared/components/FormInputField";
import {
  MediaUpload,
  type MediaFile,
} from "../../shared/components/MediaUpload";
import { FormEditor } from "../../shared/components/FormEditor";
import { Switch } from "../../shared/components/ui/switch";
import { Spinner } from "../../shared/components/ui/spinner";
import { CURRENT_STAFF } from "./types";
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

const hasArticleContent = (content: string) =>
  content
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim().length > 0;

const newsFormSchema = z
  .object({
    title: z.string().min(1, "Vui lòng nhập tiêu đề"),
    starIndex: z.coerce.number().int().min(0).max(1),
    categoryItem: z.coerce
      .number({ invalid_type_error: "Vui lòng chọn danh mục" })
      .min(1, "Vui lòng chọn danh mục"),
    thumbnail: z.string().min(1, "Vui lòng chọn ảnh bìa"),
    shortDescription: z.string().min(1, "Vui lòng nhập mô tả ngắn"),
    path: z.string(),
    url: z.string(),
    contentHtml: z.string(),
    inputMode: z.enum(["url", "content"]),
  })
  .superRefine((values, context) => {
    const isEmpty =
      values.inputMode === "url"
        ? !values.url.trim()
        : !hasArticleContent(values.contentHtml);

    if (isEmpty) {
      const message =
        values.inputMode === "url"
          ? "Vui lòng nhập đường dẫn bài viết"
          : "Vui lòng nhập nội dung";
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: [values.inputMode === "url" ? "url" : "contentHtml"],
        message,
      });
    }
  });

type NewsFormValues = z.infer<typeof newsFormSchema>;

const defaultValues = (): NewsFormValues => ({
  title: "",
  starIndex: 0,
  categoryItem: 0,
  thumbnail: "",
  shortDescription: "",
  path: "",
  url: "",
  contentHtml: "",
  inputMode: "url",
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

  const [thumbnail, setThumbnailState] = useState<MediaFile[]>([]);
  const [isThumbnailUploading, setIsThumbnailUploading] = useState(false);

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: defaultValues(),
  });
  const { control, handleSubmit, reset, watch, setValue } = form;
  const inputMode = watch("inputMode");

  const setThumbnail = (files: MediaFile[]) => {
    setThumbnailState(files);
    setValue("thumbnail", files[0]?.url ?? "", { shouldValidate: true });
  };

  useEffect(() => {
    if (mode === "edit" && article) {
      reset({
        title: article.title,
        starIndex: article.star_index === 1 ? 1 : 0,
        categoryItem: article.category_item,
        thumbnail: article.thumbnail ?? "",
        shortDescription: article.short_describe ?? "",
        path: article.path ?? "",
        url: article.url ?? "",
        contentHtml: article.content ?? "",
        inputMode: article.url?.trim() ? "url" : "content",
      });
      setThumbnailState(
        article.thumbnail
          ? [{ id: "cover", name: "cover-image", url: article.thumbnail }]
          : [],
      );
    }
  }, [mode, article, reset]);

  const handleUploadThumbnail = async (file: File) => {
    setIsThumbnailUploading(true);
    try {
      const url = await uploadImageMutation.mutateAsync({
        file,
        c: file.name,
      });
      if (!url) {
        throw new Error("Upload image response missing url");
      }
      return url;
    } finally {
      setIsThumbnailUploading(false);
    }
  };

  const handleUploadContentImage = (file: File) =>
    uploadImageMutation.mutateAsync({
      file,
      c: file.name,
    });

  const isSaving = postNewsMutation.isPending || editNewsMutation.isPending;

  const handleSave = async (values: NewsFormValues) => {
    const thumbnailUrl = values.thumbnail;
    const category = categoriesData?.content.find(
      (item) => item.id === values.categoryItem,
    );
    const categoryName = category?.name ?? "";

    try {
      if (mode === "edit" && article) {
        await editNewsMutation.mutateAsync({
          news_item: article.id,
          category_item: values.categoryItem,
          category_name: categoryName,
          thumbnail: thumbnailUrl,
          title: values.title,
          star_index: values.starIndex,
          path: "",
          url: values.url,
          short_describe: values.shortDescription,
          content: values.contentHtml,
        });
      } else {
        await postNewsMutation.mutateAsync({
          category_item: values.categoryItem,
          category_name: categoryName,
          thumbnail: thumbnailUrl,
          title: values.title,
          star_index: values.starIndex,
          path: "",
          url: values.url,
          short_describe: values.shortDescription,
          content: values.contentHtml,
          staff_item: CURRENT_STAFF.id,
          staff_name: CURRENT_STAFF.name,
        });
      }
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

  if (isNotFound) {
    return (
      <Layout>
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
      </Layout>
    );
  }

  return (
    <Layout>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(handleSave)}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/news")}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSaving || isThumbnailUploading}>
                {isSaving ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </div>

          <Card className="w-full">
            <CardContent className="space-y-5 pt-6">
              <div className="grid gap-2">
                <Label htmlFor="cover-url">
                  Ảnh bìa (URL) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cover-url"
                  value={thumbnail[0]?.url ?? ""}
                  onChange={(e) =>
                    setThumbnail(
                      e.target.value
                        ? [
                            {
                              id: "cover",
                              name: "cover-image",
                              url: e.target.value,
                            },
                          ]
                        : [],
                    )
                  }
                  placeholder="https://..."
                />
                {form.formState.errors.thumbnail && (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {form.formState.errors.thumbnail.message}
                  </p>
                )}
              </div>
              {thumbnail[0]?.url ? (
                <div className="relative overflow-hidden rounded-lg border bg-slate-100">
                  <div className="flex max-h-[400px] min-h-48 w-full items-center justify-center">
                    <img
                      src={thumbnail[0].url}
                      alt={watch("title") || "Ảnh bìa"}
                      className="block max-h-[400px] max-w-full object-contain"
                    />
                  </div>
                  {isThumbnailUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Spinner className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
              ) : (
                <MediaUpload
                  value={thumbnail}
                  onChange={setThumbnail}
                  onUpload={handleUploadThumbnail}
                  accept="image/jpeg"
                  multiple={false}
                  hint="Chọn 1 ảnh bìa cho bản tin (định dạng JPG)."
                />
              )}

              <div className="grid gap-4 md:grid-cols-10">
                <div className="md:col-span-6">
                  <FormInputField
                    control={control}
                    name="title"
                    label="Tiêu đề"
                    required
                    inputProps={{ placeholder: "Tiêu đề thông báo..." }}
                  />
                </div>
                <div className="md:col-span-2">
                  <FormField
                    control={control}
                    name="categoryItem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Danh mục</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value ? String(field.value) : ""}
                            onChange={(e) =>
                              setValue("categoryItem", Number(e.target.value), {
                                shouldValidate: true,
                              })
                            }
                          >
                            <option value="">Chọn...</option>
                            {categoriesData?.content.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="md:col-span-2">
                  <FormField
                    control={control}
                    name="starIndex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sự kiện nổi bật</FormLabel>
                        <FormControl>
                          <div className="flex h-10 items-center gap-3">
                            <Switch
                              id="article-featured"
                              checked={field.value === 1}
                              onCheckedChange={(checked) =>
                                setValue("starIndex", checked ? 1 : 0, {
                                  shouldValidate: true,
                                })
                              }
                            />
                            <Label
                              htmlFor="article-featured"
                              className="cursor-pointer text-sm font-normal"
                            >
                              Đánh dấu sự kiện nổi bật
                            </Label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={control}
                name="shortDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Mô tả ngắn</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Mô tả ngắn hiển thị ở danh sách..."
                        className="min-h-24"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-3 rounded-md border bg-muted/20 px-4 py-3">
                <Switch
                  id="article-input-mode"
                  checked={inputMode === "content"}
                  onCheckedChange={(checked) => {
                    const nextMode = checked ? "content" : "url";
                    setValue("inputMode", nextMode, {
                      shouldValidate: true,
                    });
                    setValue(
                      nextMode === "content" ? "url" : "contentHtml",
                      "",
                      {
                        shouldValidate: true,
                      },
                    );
                  }}
                />
                <Label htmlFor="article-input-mode" className="cursor-pointer">
                  {inputMode === "content"
                    ? "Nhập nội dung trực tiếp"
                    : "Nhập đường dẫn bài viết"}
                </Label>
              </div>

              {inputMode === "url" ? (
                <FormInputField
                  control={control}
                  name="url"
                  label="Đường dẫn bài viết"
                  required
                  inputProps={{ placeholder: "https://..." }}
                />
              ) : (
                <FormField
                  control={control}
                  name="contentHtml"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Nội dung</FormLabel>
                      <FormControl>
                        <FormEditor
                          value={field.value}
                          onChange={field.onChange}
                          onUploadImage={handleUploadContentImage}
                          placeholder="Nhập nội dung thông báo..."
                          className="min-h-65"
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Soạn nội dung trực tiếp bằng form editor. Nội dung sẽ
                        được lưu dưới dạng HTML.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>
        </form>
      </Form>
    </Layout>
  );
}
