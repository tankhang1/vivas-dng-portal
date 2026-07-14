import React, { useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Label,
  Select,
  Textarea,
  Pagination,
} from "../components/ui";
import { MediaUpload } from "../components/MediaUpload";
import { ScrollArea } from "../components/ui/scroll-area";
import { FormEditor } from "../components/FormEditor";
import { mockNews } from "../data/mock";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Globe,
  FileEdit,
  Paperclip,
  ImageUp,
} from "lucide-react";

const PAGE_SIZE = 5;

type MediaItem = {
  id: string;
  name: string;
  url: string;
};

type NewsArticle = {
  id: string;
  title: string;
  category: string;
  status: string;
  date: string;
  source: string;
  media: MediaItem[];
  thumbnail?: MediaItem[];
  shortDescription?: string;
  contentHtml?: string;
};

const defaultArticle = {
  id: "",
  title: "",
  category: "thong-bao",
  status: "draft",
  date: new Date().toISOString().split("T")[0],
  source: "",
  media: [],
  thumbnail: [],
  shortDescription: "",
  contentHtml: "",
} satisfies NewsArticle;

export default function News() {
  const [news, setNews] = useState<NewsArticle[]>(mockNews as NewsArticle[]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<NewsArticle | null>(
    null,
  );

  const filtered = useMemo(() => {
    return news.filter(
      (n) =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoryFilter === "all" || n.category === categoryFilter) &&
        (statusFilter === "all" || n.status === statusFilter),
    );
  }, [news, searchTerm, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleOpenDialog = (article: NewsArticle | null = null) => {
    setCurrentArticle(article || defaultArticle);
    setIsDialogOpen(true);
  };

  const updateArticle = (patch: Partial<NewsArticle>) => {
    setCurrentArticle((prev) => ({
      ...(prev ?? defaultArticle),
      ...patch,
    }));
  };

  const handleSave = () => {
    if (!currentArticle) return;

    if (currentArticle.id) {
      setNews(
        news.map((n) => (n.id === currentArticle.id ? currentArticle : n)),
      );
    } else {
      setNews([{ ...currentArticle, id: Date.now().toString() }, ...news]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bản tin này?")) {
      setNews(news.filter((n) => n.id !== id));
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Tin tức & Thông báo
            </h1>
            <p className="text-muted-foreground mt-1">
              Quản lý bài viết, thông báo hiển thị trên Cổng thông tin điện tử.
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" /> Đăng tin mới
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm tiêu đề bản tin..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                className="w-[150px]"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">Tất cả danh mục</option>
                <option value="thong-bao">Thông báo</option>
                <option value="su-kien">Sự kiện</option>
                <option value="khan-cap">Khẩn cấp</option>
              </Select>
              <Select
                className="w-[150px]"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ảnh</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Nguồn tin</TableHead>
                  <TableHead>Ngày đăng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="h-12 w-12 overflow-hidden rounded-md border bg-slate-100">
                        {item.thumbnail?.[0]?.url ? (
                          <img
                            src={item.thumbnail[0].url}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <ImageUp className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[400px]">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{item.title}</span>
                        {item.media?.length > 0 && (
                          <span className="inline-flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground">
                            <Paperclip className="h-3 w-3" />{" "}
                            {item.media.length}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.source || "Chưa rõ nguồn"}
                    </TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      {item.status === "published" ? (
                        <Badge
                          variant="success"
                          className="gap-1 bg-green-100 text-green-800"
                        >
                          <Globe className="h-3 w-3" /> Đã xuất bản
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <FileEdit className="h-3 w-3" /> Bản nháp
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(item)}
                      >
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Không tìm thấy bản tin nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle>
            {currentArticle?.id ? "Chỉnh sửa bản tin" : "Soạn bản tin mới"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label>Danh mục bài viết</Label>
              <Select
                value={currentArticle?.category || "thong-bao"}
                onChange={(e) => updateArticle({ category: e.target.value })}
              >
                <option value="thong-bao">Thông báo</option>
                <option value="su-kien">Sự kiện</option>
                <option value="khan-cap">Khẩn cấp</option>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Nguồn bài viết</Label>
              <Input
                type="url"
                value={currentArticle?.source || ""}
                onChange={(e) => updateArticle({ source: e.target.value })}
                placeholder="https://example.com/bai-viet"
              />
              <p className="text-xs text-muted-foreground">
                Nhập đường dẫn nguồn đầy đủ bắt đầu bằng `https://`.
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Tiêu đề tin tức</Label>
              <Input
                value={currentArticle?.title || ""}
                onChange={(e) => updateArticle({ title: e.target.value })}
                placeholder="Nhập tiêu đề tin tức..."
              />
            </div>

            <div className="grid gap-2">
              <Label>Hình ảnh thumbnail</Label>
              <MediaUpload
                value={currentArticle?.thumbnail || []}
                onChange={(thumbnail) => updateArticle({ thumbnail })}
                accept="image/*"
                multiple={false}
                hint="Chọn 1 ảnh đại diện cho bài viết."
              />
            </div>

            <div className="grid gap-2">
              <Label>Nội dung mô tả ngắn</Label>
              <Textarea
                value={currentArticle?.shortDescription || ""}
                onChange={(e) =>
                  updateArticle({ shortDescription: e.target.value })
                }
                placeholder="Nhập mô tả ngắn hiển thị ở danh sách hoặc trang xem trước..."
                className="min-h-[96px]"
              />
            </div>

            <div className="grid gap-2">
              <Label>Nội dung</Label>
              <FormEditor
                value={currentArticle?.contentHtml || ""}
                onChange={(contentHtml) => updateArticle({ contentHtml })}
                placeholder="Nhập nội dung bài viết tại đây..."
                className="min-h-[220px]"
              />
              <p className="text-xs text-muted-foreground">
                Soạn nội dung trực tiếp bằng form editor. Nội dung sẽ được lưu
                dưới dạng HTML.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Ngày đăng</Label>
                <Input
                  type="date"
                  value={currentArticle?.date || ""}
                  onChange={(e) => updateArticle({ date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Trạng thái</Label>
                <Select
                  value={currentArticle?.status || "draft"}
                  onChange={(e) => updateArticle({ status: e.target.value })}
                >
                  <option value="draft">Lưu nháp</option>
                  <option value="published">Xuất bản ngay</option>
                </Select>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave}>Lưu bài viết</Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
}
