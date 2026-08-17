import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/components/ui";
import { Spinner } from "@/shared/components/ui/spinner";
import {
  CheckCircle2,
  Edit2,
  Eye,
  ImageUp,
  Paperclip,
  Trash2,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { formatDate, sourceLabel, type NewsArticle } from "../types";
import type { NewsItem } from "@/features/news/types/get-news.response";

const TABLE_MAX_HEIGHT = "480px";

export type NewsRow = {
  item: NewsItem;
  article: NewsArticle;
};

type NewsTableProps = {
  rows: NewsRow[];
  isError: boolean;
  showInitialLoading: boolean;
  showRefetchOverlay: boolean;
  onView: (article: NewsArticle) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onApprove: (id: number) => void;
};

export function NewsTable({
  rows,
  isError,
  showInitialLoading,
  showRefetchOverlay,
  onView,
  onEdit,
  onDelete,
  onApprove,
}: NewsTableProps) {
  return (
    <div className="relative">
      <div className="overflow-y-auto" style={{ maxHeight: TABLE_MAX_HEIGHT }}>
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white">
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
            {showInitialLoading && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  <span className="inline-flex items-center gap-2">
                    <Spinner className="h-4 w-4" /> Đang tải dữ liệu...
                  </span>
                </TableCell>
              </TableRow>
            )}
            {isError && !showInitialLoading && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-red-600"
                >
                  Không thể tải danh sách bản tin. Vui lòng thử lại.
                </TableCell>
              </TableRow>
            )}
            {!showInitialLoading &&
              !isError &&
              rows.map(({ item, article }) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div className="flex h-12 w-12 overflow-hidden rounded-md border bg-slate-100">
                      {article.thumbnail?.[0]?.url ? (
                        <img
                          src={article.thumbnail[0].url}
                          alt={article.title}
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
                      <span className="truncate">{article.title}</span>
                      {article.media?.length > 0 && (
                        <span className="inline-flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground">
                          <Paperclip className="h-3 w-3" />{" "}
                          {article.media.length}
                        </span>
                      )}
                    </div>
                    {item.short_describe && (
                      <p className="mt-1 line-clamp-2 max-w-[400px] truncate text-xs font-normal text-muted-foreground">
                        {item.short_describe}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.category_name ? (
                      <Badge variant="outline">{item.category_name}</Badge>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {sourceLabel(article.source)}
                  </TableCell>
                  <TableCell>{formatDate(article.date)}</TableCell>
                  <TableCell>
                    <StatusBadge status={article.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(article)}
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4 text-slate-700" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(article.id)}
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </Button>
                      {item.status !== 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onApprove(item.id)}
                          title="Duyệt bản tin"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(article.id)}
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            {!showInitialLoading && !isError && rows.length === 0 && (
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
      </div>
      {showRefetchOverlay && (
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-white/60 backdrop-blur-[1px]">
          <Spinner className="h-6 w-6 text-primary" />
        </div>
      )}
    </div>
  );
}
