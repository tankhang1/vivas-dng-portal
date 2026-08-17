import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "../../shared/components/Layout";
import { MediaUpload } from "../../shared/components/MediaUpload";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
} from "../../shared/components/ui";
import {
  defaultStaff,
  statusOptions,
  type StaffRecord,
  type StaffStatus,
} from "./types";
import { useDepartmentsQuery } from "@/features/department/hooks/department.hook";
import { useDivisionsQuery } from "@/features/division/hooks/division.hook";
import {
  useActiveStaffProcessMutation,
  useCreateStaffProcessMutation,
  useDeactiveStaffProcessMutation,
  useEditStaffProcessMutation,
  useStaffDetailQuery,
} from "@/features/staff/hooks/staff.hook";
import { useUploadImageMutation } from "@/features/upload/hooks/upload.hook";

type StaffFormPageProps = {
  mode: "create" | "edit";
  staffId?: string;
};

export function StaffFormPage({ mode, staffId }: StaffFormPageProps) {
  const [, navigate] = useLocation();
  const { data: staff, isLoading: isStaffLoading } = useStaffDetailQuery(
    mode === "edit" ? staffId : undefined,
  );
  const { data: departmentsData } = useDepartmentsQuery();
  const { data: divisionsData } = useDivisionsQuery();
  const createStaffMutation = useCreateStaffProcessMutation();
  const editStaffMutation = useEditStaffProcessMutation();
  const activeStaffMutation = useActiveStaffProcessMutation();
  const deactiveStaffMutation = useDeactiveStaffProcessMutation();
  const uploadImageMutation = useUploadImageMutation();

  const handleUploadAvatar = async (file: File) => {
    const url = await uploadImageMutation.mutateAsync({ file, c: "staff-avatar" });
    if (!url) {
      throw new Error("Upload image response missing url");
    }
    return url;
  };

  const [form, setForm] = useState<StaffRecord>(defaultStaff());
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (mode === "edit" && staff) {
      setForm({
        ...defaultStaff(),
        id: String(staff.id),
        name: staff.name,
        email: staff.email ?? "",
        phone: staff.phone ?? "",
        department: String(staff.department_item),
        field: staff.division_item ? String(staff.division_item) : "",
        position: staff.potition ?? "",
        status: staff.status === 1 ? "active" : "inactive",
        avatar: staff.avatar
          ? [{ id: "current-avatar", name: "avatar", url: staff.avatar }]
          : [],
      });
    } else if (mode === "create") {
      setForm({
        ...defaultStaff(),
        department: departmentsData?.content[0]
          ? String(departmentsData.content[0].id)
          : "",
      });
    }
  }, [mode, staff, departmentsData]);

  const updateForm = (patch: Partial<StaffRecord>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const isSaving =
    createStaffMutation.isPending ||
    editStaffMutation.isPending ||
    activeStaffMutation.isPending ||
    deactiveStaffMutation.isPending ||
    uploadImageMutation.isPending;

  const handleSave = async () => {
    const department = departmentsData?.content.find(
      (item) => String(item.id) === form.department,
    );
    const division = divisionsData?.content.find(
      (item) => String(item.id) === form.field,
    );
    const avatar = form.avatar[0]?.url ?? "";

    try {
      if (mode === "edit" && staff) {
        await editStaffMutation.mutateAsync({
          id: staff.id,
          name: form.name,
          avatar,
          email: form.email,
          phone: form.phone,
          potition: form.position,
          department_item: department?.id ?? staff.department_item,
          department_name: department?.name ?? staff.department_name,
          division_item: division?.id ?? staff.division_item ?? 0,
          division_name: division?.name ?? staff.division_name ?? "",
        });

        const nextStatusValue = form.status === "active" ? 1 : 0;
        if (nextStatusValue !== staff.status) {
          const request = { id: staff.id, phone: form.phone };
          if (nextStatusValue === 1) {
            await activeStaffMutation.mutateAsync(request);
          } else {
            await deactiveStaffMutation.mutateAsync(request);
          }
        }
      } else {
        await createStaffMutation.mutateAsync({
          name: form.name,
          avatar,
          email: form.email,
          phone: form.phone,
          potition: form.position,
          department_item: department?.id ?? 0,
          department_name: department?.name ?? "",
          division_item: division?.id ?? 0,
          division_name: division?.name ?? "",
          password,
        });
      }
      navigate("/staff");
    } catch {
      window.alert("Lưu thông tin cán bộ thất bại. Vui lòng thử lại.");
    }
  };

  if (mode === "edit" && isStaffLoading) {
    return (
      <Layout>
        <p className="text-sm text-muted-foreground">Đang tải...</p>
      </Layout>
    );
  }

  if (mode === "edit" && !staff) {
    return (
      <Layout>
        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle>Không tìm thấy cán bộ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Hồ sơ cán bộ bạn muốn chỉnh sửa không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => navigate("/staff")}>
              Quay lại danh sách
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {mode === "edit" ? "Chỉnh sửa cán bộ" : "Thêm cán bộ mới"}
            </h1>
            <p className="text-muted-foreground">
              Quản lý tài khoản và thông tin hiển thị của cán bộ trên hệ thống.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate("/staff")}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Đang lưu..." : "Lưu thông tin"}
            </Button>
          </div>
        </div>

        <div className="space-y-5">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <Label>Ảnh đại diện</Label>
                <MediaUpload
                  value={form.avatar}
                  onChange={(avatar) => updateForm({ avatar })}
                  onUpload={handleUploadAvatar}
                  accept="image/*"
                  multiple={false}
                  hint="Nhấn để chọn hoặc kéo thả ảnh vào đây. Khuyến nghị: vuông hoặc gần vuông."
                />
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <button
                    type="button"
                    className="font-medium text-red-500 hover:underline"
                  >
                    Chọn từ thư viện
                  </button>
                  <span className="text-muted-foreground">Nhập URL ảnh</span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="staff-name">
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="staff-name"
                    value={form.name}
                    onChange={(e) => updateForm({ name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="staff-email">Email</Label>
                  <Input
                    id="staff-email"
                    value={form.email}
                    onChange={(e) => updateForm({ email: e.target.value })}
                    placeholder="email@company.com"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="staff-phone">
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="staff-phone"
                    value={form.phone}
                    onChange={(e) => updateForm({ phone: e.target.value })}
                    placeholder="0901234567"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="staff-department">
                    Phòng ban <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    id="staff-department"
                    value={form.department}
                    onChange={(e) => updateForm({ department: e.target.value })}
                  >
                    <option value="">Chọn...</option>
                    {departmentsData?.content.map((department) => (
                      <option key={department.id} value={String(department.id)}>
                        {department.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="staff-field">Lĩnh vực</Label>
                  <Select
                    id="staff-field"
                    value={form.field}
                    onChange={(e) => updateForm({ field: e.target.value })}
                  >
                    <option value="">Chọn...</option>
                    {divisionsData?.content.map((division) => (
                      <option key={division.id} value={String(division.id)}>
                        {division.name}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="staff-position">
                    Chức vụ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="staff-position"
                    value={form.position}
                    onChange={(e) => updateForm({ position: e.target.value })}
                    placeholder="Developer"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="staff-status">Trạng thái tài khoản</Label>
                  <Select
                    id="staff-status"
                    value={form.status}
                    onChange={(e) =>
                      updateForm({ status: e.target.value as StaffStatus })
                    }
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>

                {mode === "create" && (
                  <div className="grid gap-2">
                    <Label htmlFor="staff-password">
                      Mật khẩu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="staff-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
