import React, { useDeferredValue, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "../shared/components/Layout";
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
  Textarea,
  Pagination,
  Select,
} from "../shared/components/ui";
import { Spinner } from "@/shared/components/ui/spinner";
import { useSearchCommentsQuery } from "@/features/comment/hooks/comment.hook";
import type { CommentItem } from "@/features/comment/types/get-comment.response";
import {
  useApproveFeedbackProcessMutation,
  useCreateFeedbackProcessMutation,
} from "@/features/feedback/hooks/feedback.hook";
import { useUploadPdfMutation } from "@/features/upload/hooks/upload.hook";
import { QUERY_KEY } from "@/shared/api";
import {
  Search,
  Eye,
  MapPin,
  Clock,
  CheckCircle2,
  EyeOff,
  User,
  Paperclip,
  X,
} from "lucide-react";

const PAGE_SIZE = 5;

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const statusMeta = {
  pending: { label: "Chưa duyệt", variant: "secondary" as const, icon: Clock },
  approved: {
    label: "Đã duyệt",
    variant: "success" as const,
    icon: CheckCircle2,
  },
};

function feedbackStatus(item: CommentItem) {
  return item.staff_approve_item > 0 ? statusMeta.approved : statusMeta.pending;
}

export default function Feedback() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDeferredValue(searchTerm);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved"
  >("all");
  const [page, setPage] = useState(1);
  const [current, setCurrent] = useState<CommentItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyFile, setReplyFile] = useState<File | null>(null);
  const [replyFileUrl, setReplyFileUrl] = useState<string | null>(null);

  const { data, isLoading, isFetching, isError } = useSearchCommentsQuery({
    key: debouncedSearch || undefined,
    nu: page - 1,
  });

  const items = data?.content ?? [];
  const filteredItems = useMemo(() => {
    if (statusFilter === "all") return items;
    return items.filter((item) =>
      statusFilter === "approved"
        ? item.staff_approve_item > 0
        : item.staff_approve_item <= 0,
    );
  }, [items, statusFilter]);
  const totalPages = Math.max(1, data?.page.totalPages ?? 1);
  const totalItems = data?.page.totalElements ?? 0;
  const showInitialLoading = isLoading && items.length === 0;
  const showRefetchOverlay = isFetching && !showInitialLoading;

  const replyMutation = useCreateFeedbackProcessMutation();
  const approveMutation = useApproveFeedbackProcessMutation();
  const uploadPdfMutation = useUploadPdfMutation();

  const attachmentUrls = useMemo(
    () =>
      (current?.url ?? "")
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean),
    [current?.url],
  );

  const invalidateComments = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEY.COMMENTS });

  const handleOpenDetail = (item: CommentItem) => {
    setCurrent(item);
    setReplyContent("");
    setReplyFile(null);
    setReplyFileUrl(null);
    setIsDialogOpen(true);
  };

  const handleReplyFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setReplyFile(file);
    setReplyFileUrl(null);
    try {
      const link = await uploadPdfMutation.mutateAsync({
        file,
        c: "feedback",
      });
      setReplyFileUrl(link);
    } catch {
      window.alert("Tải file PDF thất bại. Vui lòng thử lại.");
      setReplyFile(null);
    }
  };

  const handleRemoveReplyFile = () => {
    setReplyFile(null);
    setReplyFileUrl(null);
  };

  const handleSendReply = async () => {
    if (!current || !replyContent.trim()) return;
    try {
      await replyMutation.mutateAsync({
        comment_item: current.id,
        content: replyContent.trim(),
        title_url: replyFile?.name ?? "",
        url: replyFileUrl ?? "",
        staff_item: 0,
        staff_name: "",
      });
      setReplyContent("");
      setReplyFile(null);
      setReplyFileUrl(null);
      invalidateComments();
    } catch {
      window.alert("Gửi phản hồi thất bại. Vui lòng thử lại.");
    }
  };

  const handleApprove = async () => {
    if (!current) return;
    try {
      await approveMutation.mutateAsync({
        comment_item: current.id,
        staff_item: 0,
        staff_name: "",
      });
      setCurrent((c) => (c ? { ...c, staff_approve_item: 1 } : c));
      invalidateComments();
    } catch {
      window.alert("Duyệt phản ánh thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Phản ánh kiến nghị
          </h1>
          <p className="text-muted-foreground mt-1">
            Tiếp nhận và xử lý phản ánh, kiến nghị của công dân gửi qua ứng
            dụng.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tiêu đề hoặc người gửi..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              className="w-full md:w-48"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(
                  e.target.value as "all" | "pending" | "approved",
                );
                setPage(1);
              }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chưa duyệt</option>
              <option value="approved">Đã duyệt</option>
            </Select>
            {/* Tạm ẩn bộ lọc danh mục, API tìm kiếm hiện chưa hỗ trợ tham số này */}
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="overflow-y-auto" style={{ maxHeight: "480px" }}>
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead>Người gửi</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Ngày gửi</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {showInitialLoading && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
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
                          colSpan={6}
                          className="h-24 text-center text-red-600"
                        >
                          Không thể tải danh sách phản ánh. Vui lòng thử lại.
                        </TableCell>
                      </TableRow>
                    )}
                    {!showInitialLoading &&
                      !isError &&
                      filteredItems.map((item) => {
                        const meta = feedbackStatus(item);
                        return (
                          <TableRow
                            key={item.id}
                            className="cursor-pointer"
                            onClick={() => handleOpenDetail(item)}
                          >
                            <TableCell className="font-medium max-w-[280px] truncate">
                              {item.title}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5 text-sm">
                                {item.annonymous === 1 ? (
                                  <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                                ) : (
                                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                                )}
                                {item.annonymous === 1 ? "Ẩn danh" : item.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.category_name ? (
                                <Badge variant="outline">
                                  {item.category_name}
                                </Badge>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                            <TableCell>
                              {formatDateTime(item.time_create)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={meta.variant} className="gap-1">
                                <meta.icon className="h-3 w-3" /> {meta.label}
                              </Badge>
                            </TableCell>
                            <TableCell
                              className="text-right"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenDetail(item)}
                              >
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {!showInitialLoading &&
                      !isError &&
                      filteredItems.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="h-24 text-center text-muted-foreground"
                          >
                            Không tìm thấy phản ánh nào.
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
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {current && (
          <>
            <DialogHeader>
              <DialogTitle>{current.title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2 max-h-[65vh] overflow-y-auto">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{current.category_name}</Badge>
                <Badge
                  variant={current.annonymous === 1 ? "secondary" : "outline"}
                  className="gap-1"
                >
                  {current.annonymous === 1 ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <User className="h-3 w-3" />
                  )}
                  {current.annonymous === 1 ? "Ẩn danh" : "Công khai"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Gửi ngày {formatDateTime(current.time_create)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Người gửi</p>
                  <p className="font-medium">
                    {current.annonymous === 1
                      ? "Ẩn danh"
                      : current.name || "Không rõ"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">
                    {current.annonymous === 1
                      ? "—"
                      : current.phone || "Không có"}
                  </p>
                </div>
              </div>

              {current.address && (
                <div className="flex items-start gap-1.5 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span>{current.address}</span>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Nội dung phản ánh
                </p>
                <p className="text-sm leading-relaxed">{current.content}</p>
              </div>

              {attachmentUrls.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Đính kèm</p>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {attachmentUrls.map((url) =>
                      /\.(png|jpe?g|gif|webp)$/i.test(url) ? (
                        <img
                          key={url}
                          src={url}
                          alt="Đính kèm"
                          className="aspect-square w-full rounded-md border border-border object-cover"
                        />
                      ) : (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all text-sm text-primary hover:underline"
                        >
                          {url}
                        </a>
                      ),
                    )}
                  </div>
                </div>
              )}

              <div className="grid gap-2">
                <Label>Phản hồi của cán bộ</Label>
                <Textarea
                  placeholder="Nhập nội dung phản hồi cho công dân..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />

                {replyFile ? (
                  <div className="flex items-center gap-2 rounded-md border bg-slate-50 px-3 py-2 text-sm">
                    <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate">
                      {replyFile.name}
                    </span>
                    {uploadPdfMutation.isPending ? (
                      <Spinner className="h-4 w-4 shrink-0" />
                    ) : (
                      <button
                        type="button"
                        onClick={handleRemoveReplyFile}
                        className="shrink-0 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary">
                    <Paperclip className="h-4 w-4" />
                    Đính kèm file PDF
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleReplyFileChange}
                    />
                  </label>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Đóng
              </Button>
              <Button
                variant="outline"
                onClick={handleSendReply}
                disabled={
                  !replyContent.trim() ||
                  replyMutation.isPending ||
                  uploadPdfMutation.isPending
                }
              >
                {replyMutation.isPending ? "Đang gửi..." : "Gửi phản hồi"}
              </Button>
              <Button
                onClick={handleApprove}
                disabled={
                  current.staff_approve_item > 0 || approveMutation.isPending
                }
              >
                {current.staff_approve_item > 0
                  ? "Đã duyệt"
                  : approveMutation.isPending
                    ? "Đang duyệt..."
                    : "Duyệt phản ánh"}
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </Layout>
  );
}
