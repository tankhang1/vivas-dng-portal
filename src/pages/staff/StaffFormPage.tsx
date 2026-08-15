import React, { useEffect, useMemo, useState } from "react";
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
import { getStaffById, saveStaff } from "./store";
import {
  defaultStaff,
  statusOptions,
  type StaffRecord,
  type StaffStatus,
} from "./types";
import { mockDepartments, mockRoutingRules } from "../../shared/data/mock";

type StaffFormPageProps = {
  mode: "create" | "edit";
  staffId?: string;
};

export function StaffFormPage({ mode, staffId }: StaffFormPageProps) {
  const [, navigate] = useLocation();
  const staff = useMemo(() => {
    if (mode === "edit" && staffId) {
      return getStaffById(staffId);
    }
    return null;
  }, [mode, staffId]);

  const [form, setForm] = useState<StaffRecord>(defaultStaff());

  useEffect(() => {
    if (mode === "edit" && staff) {
      setForm(staff);
    } else {
      setForm({
        ...defaultStaff(),
        department: mockDepartments[0]?.name ?? "",
      });
    }
  }, [mode, staff]);

  const updateForm = (patch: Partial<StaffRecord>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const handleSave = () => {
    saveStaff({
      ...form,
      id: mode === "edit" ? form.id : Date.now().toString(),
    });
    navigate("/staff");
  };

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
            <Button onClick={handleSave}>Lưu thông tin</Button>
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
                  accept="image/*"
                  multiple={false}
                  hint="Nhấn để chọn hoặc kéo thả ảnh vào đây. Khuyến nghị: vuông hoặc gần vuông; có thể dán URL hoặc tải file."
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
                    {mockDepartments.map((department) => (
                      <option key={department.id} value={department.name}>
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
                    {Array.from(
                      new Set(mockRoutingRules.map((rule) => rule.field)),
                    ).map((field) => (
                      <option key={field} value={field}>
                        {field}
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
