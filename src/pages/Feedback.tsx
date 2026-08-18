import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "../shared/components/Layout";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "../shared/components/ui";
import { Spinner } from "@/shared/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { QUERY_KEY } from "@/shared/api";
import { CURRENT_STAFF } from "./news/types";
import { useUploadPdfMutation } from "@/features/upload/hooks/upload.hook";
import {
  useApproveFeedbackProcessMutation,
  useCreateFeedbackProcessMutation,
  useEditFeedbackProcessMutation,
  useFeedbackQuery,
} from "@/features/feedback/hooks/feedback.hook";
import { useCommentsByCategoryQuery } from "@/features/comment/hooks/comment.hook";
import {
  useStaffCoordinateCommentsByStaffApproveQuery,
  useStaffCoordinateCommentsByStaffNoneApproveQuery,
} from "@/features/staff/hooks/staff.hook";
import type { CommentItem } from "@/features/comment/types/get-comment.response";
import type { StaffCoordinateCommentItem } from "@/features/staff/types/get-staff-coordinate-comment.response";
import {
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  MapPin,
  Paperclip,
  User,
  X,
} from "lucide-react";

const PAGE_SIZE = 10;

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

const getFileNameFromUrl = (value: string) => {
  if (!value) return "";

  const cleanValue = value.split("?")[0].split("#")[0];
  const fileName = cleanValue.split("/").filter(Boolean).pop() ?? "";

  return decodeURIComponent(fileName);
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
  return item.status === 1 ? statusMeta.approved : statusMeta.pending;
}

type FeedbackMode = "view" | "approve";

type FeedbackTableProps = {
  items: CommentItem[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onOpenDetail: (item: CommentItem) => void;
};

type RoutingSidebarProps = {
  approvedItems: StaffCoordinateCommentItem[];
  pendingItems: StaffCoordinateCommentItem[];
  isLoadingApproved: boolean;
  isLoadingPending: boolean;
  activeMode: FeedbackMode;
  selectedCategoryId: number | "";
  onSelectCategory: (categoryId: number) => void;
  onModeChange: (mode: FeedbackMode) => void;
};

function RoutingSidebar({
  approvedItems,
  pendingItems,
  isLoadingApproved,
  isLoadingPending,
  activeMode,
  selectedCategoryId,
  onSelectCategory,
  onModeChange,
}: RoutingSidebarProps) {
  const activeItems = activeMode === "approve" ? approvedItems : pendingItems;
  const showInitialLoading =
    (activeMode === "approve" ? isLoadingApproved : isLoadingPending) &&
    activeItems.length === 0;

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <div>
          <CardTitle className="text-lg">Danh sách điều phối</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Chọn một điều phối để lọc danh sách phản ánh bên trái.
          </p>
        </div>
        <Tabs
          value={activeMode}
          onValueChange={(value) => onModeChange(value as FeedbackMode)}
        >
          <TabsList className="mt-3">
            <TabsTrigger value="view">Quyền xem</TabsTrigger>
            <TabsTrigger value="approve">Quyền phản hồi</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {showInitialLoading && (
          <div className="flex justify-center py-8">
            <Spinner className="h-5 w-5" />
          </div>
        )}
        {!showInitialLoading && activeItems.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Chưa có điều phối nào.
          </p>
        )}
        {!showInitialLoading &&
          activeItems.map((item) => {
            const isSelected =
              item.comments_category_item === selectedCategoryId;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectCategory(item.comments_category_item)}
                className={[
                  "w-full rounded-lg border px-3 py-3 text-left transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-slate-50",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p
                      className={[
                        "truncate font-medium",
                        isSelected ? "text-primary" : "text-foreground",
                      ].join(" ")}
                    >
                      {item.comments_category_name || "Không rõ điều phối"}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {item.staff_name || "Không rõ cán bộ"}
                    </p>
                  </div>
                  <Badge
                    variant={activeMode === "approve" ? "success" : "secondary"}
                    className="shrink-0"
                  >
                    {activeMode === "approve" ? "Được duyệt" : "Được xem"}
                  </Badge>
                </div>
              </button>
            );
          })}
      </CardContent>
    </Card>
  );
}

function FeedbackTable({
  items,
  isLoading,
  isFetching,
  isError,
  onOpenDetail,
}: FeedbackTableProps) {
  const showInitialLoading = isLoading && items.length === 0;
  const showRefetchOverlay = isFetching && !showInitialLoading;

  return (
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
              items.map((item) => {
                const meta = feedbackStatus(item);

                return (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => onOpenDetail(item)}
                  >
                    <TableCell className="max-w-[280px] truncate font-medium">
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
                        <Badge variant="outline">{item.category_name}</Badge>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>{formatDateTime(item.time_create)}</TableCell>
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
                        onClick={() => onOpenDetail(item)}
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            {!showInitialLoading && !isError && items.length === 0 && (
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
  );
}

type FeedbackDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current: CommentItem | null;
  feedbackDetail: ReturnType<typeof useFeedbackQuery>["data"];
  isFeedbackLoading: boolean;
  isFeedbackFetching: boolean;
  mode: FeedbackMode;
  replyContent: string;
  replyFile: File | null;
  replyFileUrl: string | null;
  replyFileName: string;
  onReplyContentChange: (value: string) => void;
  onReplyFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveReplyFile: () => void;
  onSendReply: () => void;
  replyActionLabel: string;
  onApprove: () => void;
  isSendingReply: boolean;
  isApproving: boolean;
  isUploadingFile: boolean;
};

function FeedbackDetailDialog({
  open,
  onOpenChange,
  current,
  feedbackDetail,
  isFeedbackLoading,
  isFeedbackFetching,
  mode,
  replyContent,
  replyFile,
  replyFileUrl,
  replyFileName,
  onReplyContentChange,
  onReplyFileChange,
  onRemoveReplyFile,
  onSendReply,
  replyActionLabel,
  onApprove,
  isSendingReply,
  isApproving,
  isUploadingFile,
}: FeedbackDetailDialogProps) {
  const feedbackAttachmentUrls = useMemo(
    () =>
      (feedbackDetail?.url ?? "")
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean),
    [feedbackDetail?.url],
  );
  const attachmentUrls = useMemo(
    () =>
      (current?.url ?? "")
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean),
    [current?.url],
  );

  if (!current) {
    return null;
  }

  const canAct = mode === "approve";
  const isApproved = current.status === 1;
  const status = feedbackStatus(current);
  const StatusIcon = status.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{current.title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2 max-h-[65vh] overflow-y-auto">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{current.category_name || "N/A"}</Badge>
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
            <Badge variant={status.variant} className="gap-1">
              <StatusIcon className="h-3 w-3" />
              {status.label}
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
                {current.annonymous === 1 ? "—" : current.phone || "Không có"}
              </p>
            </div>
          </div>

          {current.address && (
            <div className="flex items-start gap-1.5 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{current.address}</span>
            </div>
          )}

          <div>
            <p className="mb-1 text-sm text-muted-foreground">
              Nội dung phản ánh
            </p>
            <p className="text-sm leading-relaxed">{current.content}</p>
          </div>

          {attachmentUrls.length > 0 && (
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Đính kèm</p>
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
                      className="flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm text-primary hover:border-primary"
                    >
                      <Paperclip className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {getFileNameFromUrl(url) || url}
                      </span>
                    </a>
                  ),
                )}
              </div>
            </div>
          )}

          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Chi tiết phản hồi</p>
              </div>
              {isFeedbackFetching ? <Spinner className="h-4 w-4" /> : null}
            </div>

            {isFeedbackLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner className="h-4 w-4" />
                Đang tải chi tiết phản hồi...
              </div>
            ) : !feedbackDetail ? (
              <p className="text-sm text-muted-foreground">
                Chưa có dữ liệu chi tiết phản hồi.
              </p>
            ) : (
              <div className="grid gap-3 text-sm">
                <div className="grid gap-1">
                  <span className="text-muted-foreground">
                    Nội dung phản hồi
                  </span>
                  <span className="whitespace-pre-line leading-relaxed">
                    {feedbackDetail.content || "-"}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="text-muted-foreground">Ngày tạo</span>
                  <span className="font-medium">
                    {feedbackDetail.time_create
                      ? formatDateTime(feedbackDetail.time_create)
                      : "-"}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="text-muted-foreground">Người phản hồi</span>
                  <span className="font-medium">
                    {feedbackDetail.staff_name || "-"}
                  </span>
                </div>
                <div className="grid gap-1">
                  <span className="text-muted-foreground">Người duyệt</span>
                  <span className="font-medium">
                    {feedbackDetail.staff_approve_name || "-"}
                  </span>
                </div>
                {feedbackAttachmentUrls.length > 0 && (
                  <div className="grid gap-2">
                    <span className="text-muted-foreground">File đính kèm</span>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      {feedbackAttachmentUrls.map((url) =>
                        /\.(png|jpe?g|gif|webp)$/i.test(url) ? (
                          <img
                            key={url}
                            src={url}
                            alt="Đính kèm phản hồi"
                            className="aspect-square w-full rounded-md border border-border object-cover"
                          />
                        ) : (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex w-full min-w-[220px] items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm text-primary hover:border-primary"
                          >
                            <Paperclip className="h-4 w-4 shrink-0" />
                            <span className="truncate">
                              {getFileNameFromUrl(url) || url}
                            </span>
                          </a>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {canAct && (
            <div className="grid gap-2">
              <Label>Phản hồi của cán bộ</Label>
              <Textarea
                placeholder="Nhập nội dung phản hồi cho công dân..."
                value={replyContent}
                onChange={(e) => onReplyContentChange(e.target.value)}
              />

              {replyFileName || replyFileUrl ? (
                <div className="flex items-center gap-2 rounded-md border bg-slate-50 px-3 py-2 text-sm">
                  <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {replyFileName || getFileNameFromUrl(replyFileUrl || "")}
                    </p>
                    {replyFileUrl && (
                      <a
                        href={replyFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-xs text-muted-foreground hover:text-primary hover:underline"
                      >
                        {replyFileUrl}
                      </a>
                    )}
                  </div>
                  {isUploadingFile ? (
                    <Spinner className="h-4 w-4 shrink-0" />
                  ) : (
                    <button
                      type="button"
                      onClick={onRemoveReplyFile}
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
                    onChange={onReplyFileChange}
                  />
                </label>
              )}

              {replyFileUrl && (
                <p className="text-xs text-muted-foreground">
                  File đã tải lên sẵn sàng gửi.
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          {canAct && (
            <>
              <Button
                variant="outline"
                onClick={onSendReply}
                disabled={
                  !replyContent.trim() || isSendingReply || isUploadingFile
                }
              >
                {isSendingReply ? "Đang lưu..." : replyActionLabel}
              </Button>
              <Button onClick={onApprove} disabled={isApproved || isApproving}>
                {isApproved
                  ? "Đã duyệt"
                  : isApproving
                    ? "Đang duyệt..."
                    : "Duyệt phản ánh"}
              </Button>
            </>
          )}
        </DialogFooter>
      </div>
    </Dialog>
  );
}

export default function Feedback() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<FeedbackMode>("approve");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [page, setPage] = useState(1);
  const [current, setCurrent] = useState<CommentItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyFile, setReplyFile] = useState<File | null>(null);
  const [replyFileUrl, setReplyFileUrl] = useState<string | null>(null);
  const [replyFileName, setReplyFileName] = useState("");

  const routingQuery = useStaffCoordinateCommentsByStaffApproveQuery({
    staffId: CURRENT_STAFF.id,
    sz: 10,
    nu: 0,
  });
  const routingPendingQuery = useStaffCoordinateCommentsByStaffNoneApproveQuery(
    {
      staffId: CURRENT_STAFF.id,
      sz: 10,
      nu: 0,
    },
  );
  const routingApprovedItems = routingQuery.data?.content ?? [];
  const routingPendingItems = routingPendingQuery.data?.content ?? [];

  useEffect(() => {
    const activeItems =
      activeTab === "approve" ? routingApprovedItems : routingPendingItems;

    if (
      activeItems.length > 0 &&
      !activeItems.some(
        (item) => item.comments_category_item === selectedCategoryId,
      )
    ) {
      setSelectedCategoryId(activeItems[0].comments_category_item);
    }
  }, [
    activeTab,
    routingApprovedItems,
    routingPendingItems,
    selectedCategoryId,
  ]);

  const selectedCategoryName = useMemo(() => {
    if (selectedCategoryId === "") return "";
    return (
      [...routingApprovedItems, ...routingPendingItems].find(
        (item) => item.comments_category_item === selectedCategoryId,
      )?.comments_category_name ?? ""
    );
  }, [routingApprovedItems, routingPendingItems, selectedCategoryId]);

  const viewQuery = useCommentsByCategoryQuery(
    {
      categoryId: selectedCategoryId,
      sz: PAGE_SIZE,
      nu: page - 1,
    },
    selectedCategoryId !== "",
  );
  const items = viewQuery.data?.content ?? [];
  const totalPages = Math.max(1, viewQuery.data?.page.totalPages ?? 1);
  const totalItems = viewQuery.data?.page.totalElements ?? 0;
  const showInitialLoading = viewQuery.isLoading && items.length === 0;
  const showRefetchOverlay = viewQuery.isFetching && !showInitialLoading;

  const replyMutation = useCreateFeedbackProcessMutation();
  const editReplyMutation = useEditFeedbackProcessMutation();
  const approveMutation = useApproveFeedbackProcessMutation();
  const uploadPdfMutation = useUploadPdfMutation();
  const feedbackQuery = useFeedbackQuery(current?.c_uuid);
  const feedbackDetail = feedbackQuery.data;

  useEffect(() => {
    if (!isDialogOpen || !current) return;

    if (feedbackQuery.isLoading || feedbackQuery.isFetching) return;

    if (feedbackDetail) {
      setReplyContent(feedbackDetail.content ?? "");
      setReplyFileUrl(feedbackDetail.url || null);
      setReplyFileName(
        feedbackDetail.title_url ||
          getFileNameFromUrl(feedbackDetail.url || ""),
      );
    } else {
      setReplyContent("");
      setReplyFileUrl(null);
      setReplyFileName("");
    }

    setReplyFile(null);
  }, [
    current?.c_uuid,
    current?.id,
    feedbackDetail?.id,
    feedbackQuery.isFetching,
    feedbackQuery.isLoading,
    isDialogOpen,
  ]);

  const invalidateComments = () =>
    queryClient.invalidateQueries({ queryKey: QUERY_KEY.COMMENTS });

  const handleOpenDetail = (item: CommentItem) => {
    setCurrent(item);
    setReplyContent("");
    setReplyFile(null);
    setReplyFileUrl(null);
    setReplyFileName("");
    setIsDialogOpen(true);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as FeedbackMode);
    setPage(1);
    setIsDialogOpen(false);
    setCurrent(null);
    setReplyContent("");
    setReplyFile(null);
    setReplyFileUrl(null);
    setReplyFileName("");
  };

  const handleSelectRoutingCategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setPage(1);
  };

  const handleReplyFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setReplyFile(file);
    setReplyFileUrl(null);
    setReplyFileName(file.name);

    try {
      const link = await uploadPdfMutation.mutateAsync({
        file,
        c: file.name.replace(/\.[^/.]+$/, ""),
      });
      setReplyFileUrl(link);
    } catch {
      window.alert("Tải file PDF thất bại. Vui lòng thử lại.");
      setReplyFile(null);
      setReplyFileUrl(null);
      setReplyFileName("");
    }
  };

  const handleRemoveReplyFile = () => {
    setReplyFile(null);
    setReplyFileUrl(null);
    setReplyFileName("");
  };

  const handleSendReply = async () => {
    if (!current || !replyContent.trim()) return;

    try {
      const payload = {
        comment_item: current.id,
        content: replyContent.trim(),
        title_url: replyFileName,
        url: replyFileUrl ?? "",
        staff_item: CURRENT_STAFF.id,
        staff_name: CURRENT_STAFF.name,
      };

      if (feedbackDetail) {
        await editReplyMutation.mutateAsync(payload);
      } else {
        await replyMutation.mutateAsync(payload);
      }

      if (current?.c_uuid) {
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEY.FEEDBACK(current.c_uuid),
        });
      }

      setReplyContent("");
      setReplyFile(null);
      setReplyFileUrl(null);
      invalidateComments();
    } catch {
      window.alert("Lưu phản hồi thất bại. Vui lòng thử lại.");
    }
  };

  const handleApprove = async () => {
    if (!current) return;

    try {
      await approveMutation.mutateAsync({
        comment_item: current.id,
        staff_item: CURRENT_STAFF.id,
        staff_name: CURRENT_STAFF.name,
      });
      setCurrent((value) =>
        value ? { ...value, status: 1, staff_approve_item: 1 } : value,
      );
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
          <p className="mt-1 text-muted-foreground">
            Quản lý phản ánh theo đúng quyền xem và quyền duyệt.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,6fr)_minmax(0,4fr)]">
          <Card className="min-w-0">
            <CardHeader className="flex flex-col gap-3 pb-3 md:flex-row md:items-center md:justify-between">
              <div className="w-full md:max-w-sm">
                <div className="text-sm text-muted-foreground">
                  {selectedCategoryName
                    ? `Đang xem danh mục: ${selectedCategoryName}`
                    : "Chọn một điều phối để tải danh sách phản ánh."}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <FeedbackTable
                items={items}
                isLoading={showInitialLoading}
                isFetching={showRefetchOverlay}
                isError={viewQuery.isError}
                onOpenDetail={handleOpenDetail}
              />

              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                totalItems={totalItems}
                pageSize={PAGE_SIZE}
              />
            </CardContent>
          </Card>

          <div className="min-w-0">
            <RoutingSidebar
              approvedItems={routingApprovedItems}
              pendingItems={routingPendingItems}
              isLoadingApproved={routingQuery.isLoading}
              isLoadingPending={routingPendingQuery.isLoading}
              activeMode={activeTab}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={handleSelectRoutingCategory}
              onModeChange={(mode) => {
                setActiveTab(mode);
                setPage(1);
                setIsDialogOpen(false);
                setCurrent(null);
                setReplyContent("");
                setReplyFile(null);
                setReplyFileUrl(null);
              }}
            />
          </div>
        </div>
      </div>

      <FeedbackDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        current={current}
        mode={activeTab}
        replyContent={replyContent}
        replyFile={replyFile}
        replyFileUrl={replyFileUrl}
        replyFileName={replyFileName}
        onReplyContentChange={setReplyContent}
        onReplyFileChange={handleReplyFileChange}
        onRemoveReplyFile={handleRemoveReplyFile}
        onSendReply={handleSendReply}
        replyActionLabel={feedbackDetail ? "Cập nhật phản hồi" : "Gửi phản hồi"}
        onApprove={handleApprove}
        isSendingReply={replyMutation.isPending || editReplyMutation.isPending}
        isApproving={approveMutation.isPending}
        isUploadingFile={uploadPdfMutation.isPending}
        feedbackDetail={feedbackDetail}
        isFeedbackLoading={feedbackQuery.isLoading}
        isFeedbackFetching={feedbackQuery.isFetching}
      />
    </Layout>
  );
}
