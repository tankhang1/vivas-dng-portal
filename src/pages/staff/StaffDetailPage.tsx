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
import { getStaffById } from "./store";
import { statusBadgeVariant, statusLabel } from "./types";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  Mail,
  MapPin,
  Phone,
  Tag,
  User2,
} from "lucide-react";

type StaffDetailPageProps = {
  staffId?: string;
};

export default function StaffDetailPage({ staffId }: StaffDetailPageProps) {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/staff/:id");

  const staff = useMemo(() => {
    const id = staffId ?? params?.id;
    if (!id) return null;
    return getStaffById(id);
  }, [params?.id, staffId]);

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

  const avatarUrl = staff.avatar[0]?.url ?? "";
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
                    <Badge variant={statusBadgeVariant(staff.status)}>
                      {statusLabel(staff.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    @{staff.username || "chua-cap-nhat"}
                  </p>
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
                  <div className="text-sm font-medium">{staff.department || "-"}</div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    Lĩnh vực
                  </div>
                  <div className="text-sm font-medium">{staff.field || "-"}</div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <User2 className="h-4 w-4" />
                    Chức vụ
                  </div>
                  <div className="text-sm font-medium">{staff.position || "-"}</div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    Dữ liệu mở rộng
                  </div>
                  <div className="text-sm font-medium">
                    {staff.extraFields.length > 0
                      ? `${staff.extraFields.length} mục`
                      : "Không có"}
                  </div>
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
      </div>
    </Layout>
  );
}
