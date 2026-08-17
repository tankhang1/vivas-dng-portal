import { useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Layout } from "../../shared/components/Layout";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shared/components/ui";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../shared/components/ui/avatar";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  FileText,
  MapPin,
  Pencil,
  User,
  User2,
} from "lucide-react";
import { useCommentsQuery } from "@/features/comment/hooks/comment.hook";
import type { CommentItem } from "@/features/comment/types/get-comment.response";
import { mockCitizenComments } from "@/shared/data/mock";
import { useCitizenFromCache } from "@/features/citizen/hooks/citizen.hook";

type CommentReply = {
  staffName: string;
  content: string;
  date: string;
  fileName?: string;
  fileUrl?: string;
};

type CitizenComment = CommentItem & { reply?: CommentReply };

const commentStatusMeta = {
  pending: { label: "Chưa duyệt", variant: "secondary" as const, icon: Clock },
  approved: {
    label: "Đã phản hồi",
    variant: "success" as const,
    icon: CheckCircle2,
  },
};

function commentStatus(item: CitizenComment) {
  return item.staff_approve_item > 0
    ? commentStatusMeta.approved
    : commentStatusMeta.pending;
}

function citizenStatusLabel(status: number) {
  return status === 1 ? "Đang hoạt động" : "Tạm ẩn";
}

function citizenStatusVariant(status: number) {
  return status === 1 ? "success" : "warning";
}

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="min-w-40 text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground">{value || "-"}</span>
    </div>
  );
}

type CitizenDetailPageProps = {
  citizenId?: string;
};

export default function CitizenDetailPage({
  citizenId,
}: CitizenDetailPageProps) {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/citizens/:id");
  const id = citizenId ?? params?.id;
  const [selectedComment, setSelectedComment] = useState<CitizenComment | null>(
    null,
  );

  const citizen = useCitizenFromCache(id);

  const { data: commentsData } = useCommentsQuery();

  const citizenComments = useMemo(() => {
    if (!citizen?.phone) return [];
    const apiMatches = (commentsData?.content ?? []).filter(
      (item) => item.phone === citizen.phone,
    );
    if (apiMatches.length > 0) return apiMatches;
    // Fallback dummy data khi API chưa trả về phản ánh nào cho công dân này.
    return mockCitizenComments.filter((item) => item.phone === citizen.phone);
  }, [commentsData, citizen?.phone]);

  if (!citizen) {
    return (
      <Layout>
        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle>Không có sẵn dữ liệu công dân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              API chưa có endpoint lấy chi tiết công dân theo ID, nên trang
              này chỉ hiển thị được khi mở từ danh sách Công dân đã tải sẵn
              dòng tương ứng (công dân #{id}). Hãy quay lại danh sách và mở
              chi tiết từ đó.
            </p>
            <Button onClick={() => navigate("/citizens")}>
              Quay lại danh sách
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  const avatarUrl = citizen.avatar ?? "";
  const initials = citizen.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate("/citizens")}
                title="Quay lại"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Chi tiết công dân
                </h1>
                <p className="text-muted-foreground">
                  Xem thông tin hồ sơ công dân.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/citizens/${citizen.id}/edit`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-10">
          <Card className="xl:col-span-5">
            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={avatarUrl} alt={citizen.name} />
                  <AvatarFallback className="text-lg font-semibold">
                    {initials || <User2 className="h-6 w-6" />}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-semibold">{citizen.name}</h2>
                    <Badge variant={citizenStatusVariant(citizen.status)}>
                      {citizenStatusLabel(citizen.status)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <InfoItem label="Điện thoại" value={citizen.phone} />
                <InfoItem label="Email" value={citizen.email} />
                <InfoItem label="Căn Cước" value={citizen.citizen_number} />
                <InfoItem label="Địa chỉ" value={citizen.address} />
                <InfoItem label="Thôn/Xóm" value={citizen.hamlet} />
                <InfoItem label="Phường/Xã" value={citizen.ward_name} />
                <InfoItem label="Tỉnh/Thành" value={citizen.province_name} />
                <InfoItem
                  label="Theo dõi Zalo OA"
                  value={citizen.followed_oa === 1 ? "Có" : "Không"}
                />
                <InfoItem
                  label="Ngày tạo"
                  value={
                    citizen.time_create
                      ? formatDateTime(citizen.time_create)
                      : "-"
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="xl:col-span-5">
            <CardHeader className="border-b border-border">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-lg">
                  Danh sách phản ảnh của người dùng
                </CardTitle>
                <Badge variant="outline">
                  {citizenComments.length} phản ánh
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {citizenComments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {citizenComments.map((item) => {
                      const meta = commentStatus(item);
                      const isReplied = item.staff_approve_item > 0;
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="max-w-[180px] font-medium">
                            <div className="truncate">{item.title}</div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatDateTime(item.time_create)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={meta.variant} className="gap-1">
                              <meta.icon className="h-3 w-3" />
                              {meta.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {isReplied ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Xem chi tiết phản hồi"
                                onClick={() => setSelectedComment(item)}
                              >
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="rounded-lg border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
                  Công dân này chưa gửi phản ánh nào.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={!!selectedComment}
        onOpenChange={(open) => !open && setSelectedComment(null)}
      >
        {selectedComment && (
          <>
            <DialogHeader>
              <DialogTitle>{selectedComment.title}</DialogTitle>
            </DialogHeader>
            <div className="grid max-h-[65vh] gap-4 overflow-y-auto py-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{selectedComment.category_item}</Badge>
                <Badge
                  variant={
                    selectedComment.annonymous === 1 ? "secondary" : "outline"
                  }
                  className="gap-1"
                >
                  {selectedComment.annonymous === 1 ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <User className="h-3 w-3" />
                  )}
                  {selectedComment.annonymous === 1 ? "Ẩn danh" : "Công khai"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Gửi ngày {formatDateTime(selectedComment.time_create)}
                </span>
              </div>

              {selectedComment.address && (
                <div className="flex items-start gap-1.5 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>{selectedComment.address}</span>
                </div>
              )}

              <div>
                <p className="mb-1 text-sm text-muted-foreground">
                  Nội dung phản ánh
                </p>
                <p className="text-sm leading-relaxed">
                  {selectedComment.content}
                </p>
              </div>

              {selectedComment.reply && (
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">Thông tin phản hồi</p>
                    <span className="text-xs text-muted-foreground">
                      {selectedComment.reply.staffName} ·{" "}
                      {formatDateTime(selectedComment.reply.date)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">
                    {selectedComment.reply.content}
                  </p>
                  {selectedComment.reply.fileUrl && (
                    <a
                      href={selectedComment.reply.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm text-primary hover:underline"
                    >
                      <FileText className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {selectedComment.reply.fileName || "Tệp đính kèm"}
                      </span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </Dialog>
    </Layout>
  );
}
