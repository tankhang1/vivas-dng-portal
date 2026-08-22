import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
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
import { useAuth } from "@/shared/providers";
import {
  useApproveFeedbackProcessMutation,
  useCreateFeedbackProcessMutation,
  useEditFeedbackProcessMutation,
  useFeedbackQuery,
} from "@/features/feedback/hooks/feedback.hook";
import { useInfiniteCommentsByCategoryQuery } from "@/features/comment/hooks/comment.hook";
import { useInfiniteStaffCoordinateCommentsByStaffQuery } from "@/features/staff/hooks/staff.hook";
import type { CommentItem } from "@/features/comment/types/get-comment.response";
import type { CategoryItem } from "@/features/category-news/types/get-categories.response";
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
type FeedbackListTab = "pending" | "approved";

type PendingFeedbackAction =
  | {
      type: "reply";
      commentId: number;
      uuid?: string;
      content: string;
      titleUrl: string;
      url: string;
    }
  | {
      type: "approve";
      commentId: number;
      title: string;
    };

type FeedbackTableProps = {
  items: CommentItem[];
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isError: boolean;
  onOpenDetail: (item: CommentItem) => void;
  onLoadMore: () => void;
};

type CategorySidebarProps = {
  categories: Array<Pick<CategoryItem, "id" | "name"> & { approval: number }>;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  selectedCategoryId: number | "";
  onSelectCategory: (categoryId: number) => void;
  onLoadMore: () => void;
};

function CategorySidebar({
  categories,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  selectedCategoryId,
  onSelectCategory,
  onLoadMore,
}: CategorySidebarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { root: scrollContainerRef.current, rootMargin: "160px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  return (
    <Card className="min-w-0">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg">Danh mục</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">
          Chọn danh mục để lọc danh sách phản ánh.
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <div ref={scrollContainerRef} className="max-h-[620px] space-y-2 overflow-y-auto">
          {isLoading && categories.length === 0 && (
          <div className="flex justify-center py-8">
            <Spinner className="h-5 w-5" />
          </div>
          )}
          {!isLoading && categories.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Chưa có danh mục phản ánh.
          </p>
          )}
          {categories.map((category) => {
          const isSelected = category.id === selectedCategoryId;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectCategory(category.id)}
              className={[
                "w-full rounded-lg border px-3 py-3 text-left transition-colors",
                isSelected
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:bg-slate-50",
              ].join(" ")}
            >
              <span className="font-medium">{category.name}</span>
            </button>
          );
          })}
          <div ref={loadMoreRef} className="flex min-h-10 items-center justify-center">
            {isFetchingNextPage && <Spinner className="h-4 w-4" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FeedbackTable({
  items,
  isLoading,
  isFetching,
  isFetchingNextPage,
  hasNextPage,
  isError,
  onOpenDetail,
  onLoadMore,
}: FeedbackTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const showInitialLoading = isLoading && items.length === 0;
  const showRefetchOverlay = isFetching && !isFetchingNextPage && !showInitialLoading;

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { root: scrollContainerRef.current, rootMargin: "240px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  return (
    <div className="relative">
      <div ref={scrollContainerRef} className="overflow-y-auto" style={{ maxHeight: "480px" }}>
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white">
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Người gửi</TableHead>
              <TableHead>Ngày gửi</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showInitialLoading && (
              <TableRow>
                <TableCell
                  colSpan={5}
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
                  colSpan={5}
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
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Không tìm thấy phản ánh nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div ref={loadMoreRef} className="flex min-h-10 items-center justify-center">
          {isFetchingNextPage && <Spinner className="h-4 w-4" />}
        </div>
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
  canManageFeedback: boolean;
  canApproveCategory: boolean;
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
  canManageFeedback,
  canApproveCategory,
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

  const isApproved = current.status === 1;
  const canAct = mode === "approve" && canManageFeedback && !isApproved;
  const canApprove = canAct && canApproveCategory;
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
              {canApprove && (
                <Button onClick={onApprove} disabled={isApproved || isApproving}>
                  {isApproved
                    ? "Đã duyệt"
                    : isApproving
                      ? "Đang duyệt..."
                      : "Duyệt phản ánh"}
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </div>
    </Dialog>
  );
}

export default function Feedback() {
  const { isStaffRole: canManageFeedback } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<FeedbackListTab>("pending");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [current, setCurrent] = useState<CommentItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyFile, setReplyFile] = useState<File | null>(null);
  const [replyFileUrl, setReplyFileUrl] = useState<string | null>(null);
  const [replyFileName, setReplyFileName] = useState("");
  const [pendingAction, setPendingAction] =
    useState<PendingFeedbackAction | null>(null);

  const categoriesQuery = useInfiniteStaffCoordinateCommentsByStaffQuery({
    staffId: CURRENT_STAFF.id,
    sz: PAGE_SIZE,
  });
  const categories = useMemo(
    () => {
      const unique = new Map<number, Pick<CategoryItem, "id" | "name"> & { approval: number }>();
      categoriesQuery.data?.pages.forEach((pageData) => {
        pageData.content.forEach((item) => {
          unique.set(item.comments_category_item, {
            id: item.comments_category_item,
            name: item.comments_category_name ?? "Không rõ danh mục",
            approval: item.approval,
          });
        });
      });
      return Array.from(unique.values());
    },
    [categoriesQuery.data?.pages],
  );

  useEffect(() => {
    if (categories.length > 0 && !categories.some((item) => item.id === selectedCategoryId)) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const selectedCategoryName = useMemo(() => {
    if (selectedCategoryId === "") return "";
    return categories.find((item) => item.id === selectedCategoryId)?.name ?? "";
  }, [categories, selectedCategoryId]);
  const selectedCategoryCanApprove =
    categories.find((item) => item.id === selectedCategoryId)?.approval === 1;

  const viewQuery = useInfiniteCommentsByCategoryQuery(
    {
      categoryId: selectedCategoryId,
      sz: PAGE_SIZE,
    },
    selectedCategoryId !== "",
  );
  const allItems = useMemo(
    () => viewQuery.data?.pages.flatMap((pageData) => pageData.content) ?? [],
    [viewQuery.data?.pages],
  );
  const filteredItems = useMemo(() => {
    const result = allItems.filter((item) =>
      activeTab === "approved" ? item.status === 1 : item.status !== 1,
    );

    return result.sort((a, b) => b.time_create_number - a.time_create_number);
  }, [activeTab, allItems]);
  const items = filteredItems;
  const showInitialLoading = viewQuery.isLoading && items.length === 0;
  const showRefetchOverlay = viewQuery.isFetching && !viewQuery.isFetchingNextPage && !showInitialLoading;

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
        c: file.name,
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

  const executeSendReply = async (action: Extract<PendingFeedbackAction, { type: "reply" }>) => {
    try {
      const payload = {
        comment_item: action.commentId,
        content: action.content,
        title_url: action.titleUrl,
        url: action.url,
        staff_item: CURRENT_STAFF.id,
        staff_name: CURRENT_STAFF.name,
      };

      if (feedbackDetail) {
        await editReplyMutation.mutateAsync(payload);
      } else {
        await replyMutation.mutateAsync(payload);
      }

      if (action.uuid) {
        await queryClient.invalidateQueries({
          queryKey: QUERY_KEY.FEEDBACK(action.uuid),
        });
      }

      setReplyContent("");
      setReplyFile(null);
      setReplyFileUrl(null);
      invalidateComments();
    } catch {
      window.alert("Lưu phản hồi thất bại. Vui lòng thử lại.");
    } finally {
      setPendingAction(null);
    }
  };

  const handleSendReply = () => {
    if (!current || !replyContent.trim()) return;
    setPendingAction({
      type: "reply",
      commentId: current.id,
      uuid: current.c_uuid,
      content: replyContent.trim(),
      titleUrl: replyFileName,
      url: replyFileUrl ?? "",
    });
  };

  const executeApprove = async (action: Extract<PendingFeedbackAction, { type: "approve" }>) => {
    try {
      await approveMutation.mutateAsync({
        comment_item: action.commentId,
        staff_item: CURRENT_STAFF.id,
        staff_name: CURRENT_STAFF.name,
      });
      setCurrent((value) =>
        value ? { ...value, status: 1, staff_approve_item: 1 } : value,
      );
      invalidateComments();
    } catch {
      window.alert("Duyệt phản ánh thất bại. Vui lòng thử lại.");
    } finally {
      setPendingAction(null);
    }
  };

  const handleApprove = () => {
    if (!current || current.status === 1) return;
    setPendingAction({
      type: "approve",
      commentId: current.id,
      title: current.title,
    });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Phản ánh - Kiến nghị
          </h1>
          <p className="mt-1 text-muted-foreground">
            Quản lý phản ánh theo đúng quyền xử lý và quyền duyệt.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,7fr)]">
          <CategorySidebar
            categories={categories}
            isLoading={categoriesQuery.isLoading}
            isFetchingNextPage={categoriesQuery.isFetchingNextPage}
            hasNextPage={!!categoriesQuery.hasNextPage}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(categoryId) => {
              setSelectedCategoryId(categoryId);
            }}
            onLoadMore={() => {
              void categoriesQuery.fetchNextPage();
            }}
          />

          <Card className="min-w-0">
            <CardHeader className="flex flex-col gap-3 pb-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-lg">Danh sách phản ánh</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {selectedCategoryName
                    ? `Danh mục: ${selectedCategoryName}`
                    : "Chọn một danh mục để tải danh sách phản ánh."}
                </div>
              </div>
              <Tabs
                value={activeTab}
                onValueChange={(value) => {
                  setActiveTab(value as FeedbackListTab);
                  setIsDialogOpen(false);
                  setCurrent(null);
                }}
              >
                <TabsList>
                  <TabsTrigger value="pending">Chờ xử lý mới nhất</TabsTrigger>
                  <TabsTrigger value="approved">Đã duyệt mới nhất</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent className="space-y-4">
              <FeedbackTable
                items={items}
                isLoading={showInitialLoading}
                isFetching={showRefetchOverlay}
                isFetchingNextPage={viewQuery.isFetchingNextPage}
                hasNextPage={!!viewQuery.hasNextPage}
                isError={viewQuery.isError}
                onOpenDetail={handleOpenDetail}
                onLoadMore={() => {
                  void viewQuery.fetchNextPage();
                }}
              />
            </CardContent>
          </Card>

        </div>
      </div>

      <FeedbackDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        current={current}
        mode={canManageFeedback ? "approve" : "view"}
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
        canManageFeedback={canManageFeedback}
        canApproveCategory={selectedCategoryCanApprove}
      />

      <Dialog
        open={pendingAction !== null}
        onOpenChange={(open) => {
          if (
            !open &&
            !replyMutation.isPending &&
            !editReplyMutation.isPending &&
            !approveMutation.isPending
          ) {
            setPendingAction(null);
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {pendingAction?.type === "approve"
              ? "Xác nhận duyệt phản ánh?"
              : "Xác nhận lưu phản hồi?"}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {pendingAction?.type === "approve"
            ? `Bạn có chắc muốn duyệt phản ánh "${pendingAction.title}" không?`
            : "Bạn có chắc muốn gửi nội dung phản hồi này cho công dân không?"}
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setPendingAction(null)}
            disabled={
              replyMutation.isPending ||
              editReplyMutation.isPending ||
              approveMutation.isPending
            }
          >
            Hủy
          </Button>
          <Button
            onClick={async () => {
              if (!pendingAction) return;
              if (pendingAction.type === "approve") {
                await executeApprove(pendingAction);
              } else {
                await executeSendReply(pendingAction);
              }
            }}
            disabled={
              replyMutation.isPending ||
              editReplyMutation.isPending ||
              approveMutation.isPending
            }
          >
            {replyMutation.isPending ||
            editReplyMutation.isPending ||
            approveMutation.isPending
              ? "Đang xử lý..."
              : "Xác nhận"}
          </Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
}
