import React, { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "../../components/Layout";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui";
import { getNews, deleteNews } from "./store";
import {
  categoryLabel,
  formatDate,
  sourceLabel,
  statusOptions,
  type NewsArticle,
} from "./types";
import { NewsDetailDialog } from "./NewsDetailDialog";
import {
  Edit2,
  Eye,
  FileEdit,
  Globe,
  ImageUp,
  Paperclip,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

const PAGE_SIZE = 5;

const statusBadge = (status: NewsArticle["status"]) => {
  if (status === "published") {
    return (
      <Badge variant="success" className="gap-1 bg-green-100 text-green-800">
        <Globe className="h-3 w-3" /> Đã xuất bản
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1">
      <FileEdit className="h-3 w-3" /> Bản nháp
    </Badge>
  );
};

export default function NewsPage() {
  const [, navigate] = useLocation();
  const [news, setNews] = useState<NewsArticle[]>(() => getNews());
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [detailArticle, setDetailArticle] = useState<NewsArticle | null>(null);

  const filtered = useMemo(() => {
    return news.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoryFilter === "all" || item.category === categoryFilter) &&
        (statusFilter === "all" || item.status === statusFilter),
    );
  }, [news, searchTerm, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToCreate = () => navigate("/news/new");
  const goToEdit = (id: string) => navigate(`/news/${id}/edit`);

  const openDetail = (article: NewsArticle) => {
    setDetailArticle(article);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bản tin này?")) return;
    deleteNews(id);
    setDetailArticle((current) => (current?.id === id ? null : current));
    setNews(getNews());
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Tin tức & Thông báo
            </h1>
            <p className="mt-1 text-muted-foreground">
              Quản lý bài viết, thông báo hiển thị trên Cổng thông tin điện tử.
            </p>
          </div>
          <Button onClick={goToCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Tạo mới
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-3 pb-3 md:flex-row md:items-center md:justify-between">
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
                {["thong-bao", "su-kien", "khan-cap"].map((value) => (
                  <option key={value} value={value}>
                    {categoryLabel(value as NewsArticle["category"])}
                  </option>
                ))}
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
                {statusOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
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
                      <div className="flex h-12 w-12 overflow-hidden rounded-md border bg-slate-100">
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
                    <TableCell className="max-w-[400px] font-medium">
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
                      <Badge variant="outline">
                        {categoryLabel(item.category)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {sourceLabel(item.source)}
                    </TableCell>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>{statusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDetail(item)}
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4 text-slate-700" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => goToEdit(item.id)}
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
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

      <NewsDetailDialog
        open={Boolean(detailArticle)}
        article={detailArticle}
        onOpenChange={(open) => {
          if (!open) setDetailArticle(null);
        }}
        onEdit={(id) => navigate(`/news/${id}/edit`)}
        onDelete={handleDelete}
      />
    </Layout>
  );
}
