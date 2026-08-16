import { useMemo } from "react";
import { useLocation, useRoute } from "wouter";
import { Layout } from "../../shared/components/Layout";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { mockFeedback } from "../../shared/data/mock";
import {
  useStaffCoordinateCommentQuery,
  useStaffFromCache,
} from "@/features/staff/hooks/staff.hook";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Mail,
  MapPin,
  MessageSquareWarning,
  Phone,
  ShieldCheck,
  Tag,
  User2,
} from "lucide-react";

type StaffDetailPageProps = {
  staffId?: string;
};

function staffStatusLabel(status: number) {
  return status === 1 ? "Hoạt động" : "Tạm khóa";
}

function staffStatusVariant(status: number) {
  return status === 1 ? "success" : "warning";
}

const APPROVAL_LABEL: Record<number, string> = {
  0: "Xem",
  1: "Duyệt",
  2: "Từ chối",
};

function buildUsername(name: string, phone: string | null) {
  const base = phone || name;
  return (
    base
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, ".")
      .replace(/^\.+|\.+$/g, "") || "chua-cap-nhat"
  );
}

export default function StaffDetailPage({ staffId }: StaffDetailPageProps) {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/staff/:id");
  const id = staffId ?? params?.id;
  const staff = useStaffFromCache(id);
  const {
    data: coordinateComment,
    isLoading: isCoordinateCommentLoading,
    isError: isCoordinateCommentError,
  } = useStaffCoordinateCommentQuery(staff?.id);

  const repliedFeedbacks = useMemo(() => {
    if (!staff) return [];
    return mockFeedback
      .filter((item) => item.assignedStaff === staff.name && item.reply)
      .sort((left, right) => right.date.localeCompare(left.date));
  }, [staff]);

  if (!staff) {
    return (
      <Layout>
        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle>Không tìm thấy cán bộ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Hồ sơ cán bộ bạn muốn xem không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => navigate("/staff")}>Quay lại danh sách</Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  const avatarUrl = staff.avatar ?? "";
  const username = buildUsername(staff.name, staff.phone);
  const initials = staff.name
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
                onClick={() => navigate("/staff")}
                title="Quay lại"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Chi tiết cán bộ
                </h1>
                <p className="text-muted-foreground">
                  Xem thông tin tài khoản và danh sách phản ánh liên quan.
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(`/staff/${staff.id}/edit`)}
            className="self-start"
          >
            Chỉnh sửa
          </Button>
        </div>

        <div className="grid gap-5 xl:grid-cols-[4fr_6fr]">
          <Card>
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg">Thông tin tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={avatarUrl} alt={staff.name} />
                  <AvatarFallback className="text-lg font-semibold">
                    {initials || <User2 className="h-6 w-6" />}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-semibold">{staff.name}</h2>
                    <Badge variant={staffStatusVariant(staff.status)}>
                      {staffStatusLabel(staff.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">@{username}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <div className="text-sm font-medium">{staff.email || "-"}</div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    Số điện thoại
                  </div>
                  <div className="text-sm font-medium">{staff.phone || "-"}</div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    Phòng ban
                  </div>
                  <div className="text-sm font-medium">
                    {staff.department_name || "-"}
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Lĩnh vực
                  </div>
                  <div className="text-sm font-medium">-</div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <User2 className="h-4 w-4" />
                    Chức vụ
                  </div>
                  <div className="text-sm font-medium">{staff.potition || "-"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b border-border">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-lg">
                  Danh sách phản hồi người dùng
                </CardTitle>
                <Badge variant="outline">
                  {repliedFeedbacks.length} phản hồi
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {repliedFeedbacks.length > 0 ? (
                <div
                  className="overflow-x-auto overflow-y-auto"
                  style={{ maxHeight: "480px" }}
                >
                  <Table>
                    <TableHeader className="sticky top-0 z-10 bg-white">
                      <TableRow>
                        <TableHead className="min-w-[220px]">
                          Nội dung phản hồi
                        </TableHead>
                        <TableHead className="min-w-[160px]">File</TableHead>
                        <TableHead className="min-w-[220px]">
                          Thông tin yêu cầu
                        </TableHead>
                        <TableHead className="min-w-[140px]">
                          Người yêu cầu
                        </TableHead>
                        <TableHead className="min-w-[160px]">
                          Thời gian phản hồi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {repliedFeedbacks.map((item) => {
                        const reply = item.reply!;
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="max-w-[260px]">
                              <div className="truncate">{reply.content}</div>
                            </TableCell>
                            <TableCell>
                              {reply.fileUrl ? (
                                <a
                                  href={reply.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1.5 text-primary hover:underline"
                                >
                                  <FileText className="h-4 w-4 shrink-0" />
                                  <span className="max-w-[140px] truncate">
                                    {reply.fileName || "Tệp đính kèm"}
                                  </span>
                                </a>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell className="max-w-[240px] font-medium">
                              <div className="truncate">{item.title}</div>
                              <div className="truncate text-xs text-muted-foreground">
                                {item.content}
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.privacy === "anonymous"
                                ? "Ẩn danh"
                                : item.name || "-"}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {reply.date}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
                  Cán bộ này chưa phản hồi phản ánh nào.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg">
              Thông tin điều phối tiếp nhận phản ánh
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isCoordinateCommentLoading && (
              <p className="text-sm text-muted-foreground">Đang tải...</p>
            )}
            {!isCoordinateCommentLoading && isCoordinateCommentError && (
              <p className="text-sm text-muted-foreground">
                Không tải được thông tin điều phối tiếp nhận phản ánh.
              </p>
            )}
            {!isCoordinateCommentLoading &&
              !isCoordinateCommentError &&
              coordinateComment && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <MessageSquareWarning className="h-4 w-4" />
                      Nhóm phản ánh
                    </div>
                    <div className="text-sm font-medium">
                      {coordinateComment.comments_category_name || "-"}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <ShieldCheck className="h-4 w-4" />
                      Quyền xử lý
                    </div>
                    <div className="text-sm font-medium">
                      {APPROVAL_LABEL[coordinateComment.approval] ?? "-"}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      Thời gian tạo
                    </div>
                    <div className="text-sm font-medium">
                      {coordinateComment.time_create || "-"}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <User2 className="h-4 w-4" />
                      Trạng thái
                    </div>
                    <Badge variant={staffStatusVariant(coordinateComment.status)}>
                      {staffStatusLabel(coordinateComment.status)}
                    </Badge>
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
