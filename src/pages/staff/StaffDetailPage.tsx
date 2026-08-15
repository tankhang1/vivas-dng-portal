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
import { mockFeedback, feedbackCategories } from "../../shared/data/mock";
import { getStaffById } from "./store";
import { statusBadgeVariant, statusLabel } from "./types";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  Mail,
  MapPin,
  Phone,
  Tag,
  User2,
} from "lucide-react";

const feedbackStatusMeta = {
  pending: { label: "Chưa xử lý", variant: "secondary" as const },
  processing: { label: "Đang xử lý", variant: "warning" as const },
  resolved: { label: "Đã xử lý", variant: "success" as const },
};

function getFeedbackStatus(status: keyof typeof feedbackStatusMeta) {
  return feedbackStatusMeta[status] ?? feedbackStatusMeta.pending;
}

function getCategoryLabel(value: string) {
  return (
    feedbackCategories.find((item) => item.value === value)?.label ?? value
  );
}

type StaffDetailPageProps = {
  staffId?: string;
};

type FeedbackRecord = (typeof mockFeedback)[number];

export default function StaffDetailPage({ staffId }: StaffDetailPageProps) {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/staff/:id");
  const [selectedFeedback, setSelectedFeedback] =
    useState<FeedbackRecord | null>(null);

  const staff = useMemo(() => {
    const id = staffId ?? params?.id;
    if (!id) return null;
    return getStaffById(id);
  }, [params?.id, staffId]);

  const relatedFeedbacks = useMemo(() => {
    if (!staff) return [];
    return mockFeedback
      .filter((item) => item.assignedStaff === staff.name)
      .sort((left, right) => right.date.localeCompare(left.date));
  }, [staff]);

  const openFeedbackDetail = (feedback: FeedbackRecord) => {
    setSelectedFeedback(feedback);
  };

  const closeFeedbackDetail = () => {
    setSelectedFeedback(null);
  };

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
                  Danh sách phản ảnh của người dùng
                </CardTitle>
                <Badge variant="outline">
                  {relatedFeedbacks.length} phản ánh
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {relatedFeedbacks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead>Người gửi</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Ngày</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatedFeedbacks.map((item) => {
                  const meta = getFeedbackStatus(
                        item.status as keyof typeof feedbackStatusMeta,
                      );
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="max-w-[320px] font-medium">
                            <div className="truncate">{item.title}</div>
                            <div className="truncate text-xs text-muted-foreground">
                              {item.location || item.address || "-"}
                            </div>
                          </TableCell>
                          <TableCell>{item.name || "-"}</TableCell>
                          <TableCell>{getCategoryLabel(item.category)}</TableCell>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>
                            <Badge variant={meta.variant}>{meta.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Xem chi tiết"
                              onClick={() => openFeedbackDetail(item)}
                            >
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="rounded-lg border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
                  Chưa có phản ánh nào được gán cho cán bộ này.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog open={!!selectedFeedback} onOpenChange={(open) => !open && closeFeedbackDetail()}>
          {selectedFeedback && (
            <>
              {(() => {
                const feedbackStatus = selectedFeedback.status as keyof typeof feedbackStatusMeta;
                const feedbackMeta = getFeedbackStatus(feedbackStatus);

                return (
                  <>
              <DialogHeader>
                <DialogTitle>{selectedFeedback.title}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-2 max-h-[65vh] overflow-y-auto">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    {getCategoryLabel(selectedFeedback.category)}
                  </Badge>
                  <Badge
                    variant={
                      selectedFeedback.privacy === "anonymous"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {selectedFeedback.privacy === "anonymous"
                      ? "Ẩn danh"
                      : "Công khai"}
                  </Badge>
                  <Badge variant={feedbackMeta.variant}>
                    {feedbackMeta.label}
                  </Badge>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Người gửi</p>
                    <p className="font-medium">
                      {selectedFeedback.privacy === "anonymous"
                        ? "Ẩn danh"
                        : selectedFeedback.name || "Không rõ"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Số điện thoại</p>
                    <p className="font-medium">
                      {selectedFeedback.privacy === "anonymous"
                        ? "—"
                        : selectedFeedback.phone || "Không có"}
                    </p>
                  </div>
                </div>

                {selectedFeedback.address && (
                  <div className="flex items-start gap-1.5 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{selectedFeedback.address}</span>
                  </div>
                )}

                <div>
                  <p className="mb-1 text-sm text-muted-foreground">
                    Nội dung phản ánh
                  </p>
                  <p className="text-sm leading-relaxed">
                    {selectedFeedback.content}
                  </p>
                </div>
              </div>
                  </>
                );
              })()}
            </>
          )}
        </Dialog>
      </div>
    </Layout>
  );
}
