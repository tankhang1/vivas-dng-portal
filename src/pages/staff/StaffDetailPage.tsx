import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Layout } from "../../shared/components/Layout";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../shared/components/ui";
import { Spinner } from "../../shared/components/ui/spinner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../shared/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  useStaffCoordinateCommentsByStaffApproveQuery,
  useStaffCoordinateCommentsByStaffNoneApproveQuery,
  useStaffDetailQuery,
} from "@/features/staff/hooks/staff.hook";
import {
  ArrowLeft,
  CheckCircle2,
  CircleDashed,
  Mail,
  MapPin,
  Phone,
  Tag,
  User2,
} from "lucide-react";
import { useAuth } from "@/shared/providers";

type StaffDetailPageProps = {
  staffId?: string;
};

function staffStatusLabel(status: number) {
  return status === 1 ? "Hoạt động" : "Tạm khóa";
}

function staffStatusVariant(status: number) {
  return status === 1 ? "success" : "warning";
}

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
  const { isAdminRole } = useAuth();
  const id = staffId ?? params?.id;
  const { data: staff, isLoading: isStaffLoading } = useStaffDetailQuery(id);
  const [categoryTab, setCategoryTab] = useState<"approved" | "pending">(
    "approved",
  );
  const approveQuery = useStaffCoordinateCommentsByStaffApproveQuery({
    staffId: categoryTab === "approved" ? (staff?.id ?? "") : "",
    sz: 200,
    nu: 0,
  });
  const pendingQuery = useStaffCoordinateCommentsByStaffNoneApproveQuery({
    staffId: categoryTab === "pending" ? (staff?.id ?? "") : "",
    sz: 200,
    nu: 0,
  });
  const approvedCategories = approveQuery.data?.content ?? [];
  const pendingCategories = pendingQuery.data?.content ?? [];
  const isLoadingCategories =
    categoryTab === "approved"
      ? approveQuery.isLoading
      : pendingQuery.isLoading;

  if (isStaffLoading) {
    return (
      <Layout>
        <p className="text-sm text-muted-foreground">Đang tải...</p>
      </Layout>
    );
  }

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
            <Button onClick={() => navigate("/staff")}>
              Quay lại danh sách
            </Button>
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
                  Xem thông tin tài khoản và lĩnh vực điều phối phụ trách.
                </p>
              </div>
            </div>
          </div>
          {isAdminRole && (
            <Button
              variant="outline"
              onClick={() => navigate(`/staff/${staff.id}/edit`)}
              className="self-start"
            >
              Chỉnh sửa
            </Button>
          )}
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
                  <div className="text-sm font-medium">
                    {staff.email || "-"}
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    Số điện thoại
                  </div>
                  <div className="text-sm font-medium">
                    {staff.phone || "-"}
                  </div>
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
                  <div className="text-sm font-medium">
                    {staff.division_name || "-"}
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <User2 className="h-4 w-4" />
                    Chức vụ
                  </div>
                  <div className="text-sm font-medium">
                    {staff.potition || "-"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg">
                Lĩnh vực điều phối phụ trách
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Danh mục cán bộ chịu trách nhiệm xử lý, phân theo trạng thái phê
                duyệt.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs
                value={categoryTab}
                onValueChange={(value) =>
                  setCategoryTab(value as "approved" | "pending")
                }
              >
                <TabsList>
                  <TabsTrigger value="approved" className="gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Quyền phản hồi
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="gap-1.5">
                    <CircleDashed className="h-4 w-4" />
                    Quyền xử lý
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="approved"
                  className="overflow-hidden rounded-lg border border-border"
                >
                  {categoryTab === "approved" && isLoadingCategories ? (
                    <div className="flex justify-center py-8">
                      <Spinner />
                    </div>
                  ) : approvedCategories.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                      Chưa được phê duyệt lĩnh vực nào.
                    </p>
                  ) : (
                    approvedCategories.map((item) => (
                      <div
                        key={item.id}
                        className="border-t border-border px-4 py-3 text-sm first:border-t-0"
                      >
                        {item.comments_category_name}
                      </div>
                    ))
                  )}
                </TabsContent>
                <TabsContent
                  value="pending"
                  className="overflow-hidden rounded-lg border border-border"
                >
                  {categoryTab === "pending" && isLoadingCategories ? (
                    <div className="flex justify-center py-8">
                      <Spinner />
                    </div>
                  ) : pendingCategories.length === 0 ? (
                    <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                      Không có lĩnh vực đang chờ phê duyệt.
                    </p>
                  ) : (
                    pendingCategories.map((item) => (
                      <div
                        key={item.id}
                        className="border-t border-border px-4 py-3 text-sm first:border-t-0"
                      >
                        {item.comments_category_name}
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
