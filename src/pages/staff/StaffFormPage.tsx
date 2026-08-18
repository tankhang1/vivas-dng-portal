import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { isVietnamPhoneNumber } from "@/shared/lib/phone";

type StaffFormPageProps = {
  mode: "create" | "edit";
  staffId?: string;
};

const mediaFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const staffFormBaseSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập họ và tên"),
  email: z
    .string()
    .trim()
    .default("")
    .refine((value) => value === "" || emailRegex.test(value), {
      message: "Email không hợp lệ",
    }),
  phone: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập số điện thoại")
    .refine(isVietnamPhoneNumber, {
      message:
        "Số điện thoại Việt Nam không hợp lệ. Dùng 10 số, bắt đầu bằng 03, 05, 07, 08, 09 hoặc định dạng +84 tương ứng.",
    }),
  department: z.string().min(1, "Vui lòng chọn phòng ban"),
  field: z.string().default(""),
  position: z.string().trim().min(1, "Vui lòng nhập chức vụ"),
  status: z.enum(["active", "inactive"]),
  avatar: z.array(mediaFileSchema).default([]),
  password: z.string().default(""),
});

const staffCreateSchema = staffFormBaseSchema.extend({
  field: z.string().min(1, "Vui lòng chọn lĩnh vực"),
  avatar: z.array(mediaFileSchema).min(1, "Vui lòng chọn ảnh đại diện"),
  password: z.string().trim().min(1, "Vui lòng nhập mật khẩu"),
});

const staffEditSchema = staffFormBaseSchema;

type StaffFormValues = z.infer<typeof staffFormBaseSchema>;

const defaultValues: StaffFormValues = {
  name: "",
  email: "",
  phone: "",
  department: "",
  field: "",
  position: "",
  status: "active",
  avatar: [],
  password: "",
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-red-600">{message}</p>;
}

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
  const hasAppliedCreateDepartmentDefault = useRef(false);

  const schema = mode === "create" ? staffCreateSchema : staffEditSchema;

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (mode === "edit" && staff) {
      reset({
        name: staff.name ?? "",
        email: staff.email ?? "",
        phone: staff.phone ?? "",
        department: String(staff.department_item ?? ""),
        field: staff.division_item ? String(staff.division_item) : "",
        position: staff.potition ?? "",
        status: staff.status === 1 ? "active" : "inactive",
        avatar: staff.avatar
          ? [{ id: "current-avatar", name: "avatar", url: staff.avatar }]
          : [],
        password: "",
      });
      hasAppliedCreateDepartmentDefault.current = false;
      return;
    }

    if (
      mode === "create" &&
      departmentsData?.content[0] &&
      !hasAppliedCreateDepartmentDefault.current
    ) {
      setValue("department", String(departmentsData.content[0].id), {
        shouldDirty: false,
        shouldValidate: false,
      });
      hasAppliedCreateDepartmentDefault.current = true;
    }
  }, [mode, staff, departmentsData, reset, setValue]);

  const handleUploadAvatar = async (file: File) => {
    const url = await uploadImageMutation.mutateAsync({ file, c: "staff-avatar" });
    if (!url) {
      throw new Error("Upload image response missing url");
    }
    return url;
  };

  const isSaving =
    createStaffMutation.isPending ||
    editStaffMutation.isPending ||
    activeStaffMutation.isPending ||
    deactiveStaffMutation.isPending ||
    uploadImageMutation.isPending ||
    isSubmitting;

  const handleSave = handleSubmit(async (values) => {
    const department = departmentsData?.content.find(
      (item) => String(item.id) === values.department,
    );
    const division = divisionsData?.content.find(
      (item) => String(item.id) === values.field,
    );
    const avatar = values.avatar[0]?.url ?? "";

    try {
      if (mode === "edit" && staff) {
        await editStaffMutation.mutateAsync({
          id: staff.id,
          name: values.name,
          avatar,
          email: values.email,
          phone: values.phone,
          potition: values.position,
          department_item: department?.id ?? staff.department_item,
          department_name: department?.name ?? staff.department_name,
          division_item: division?.id ?? staff.division_item ?? 0,
          division_name: division?.name ?? staff.division_name ?? "",
        });

        const nextStatusValue = values.status === "active" ? 1 : 0;
        if (nextStatusValue !== staff.status) {
          const request = { id: staff.id, phone: values.phone };
          if (nextStatusValue === 1) {
            await activeStaffMutation.mutateAsync(request);
          } else {
            await deactiveStaffMutation.mutateAsync(request);
          }
        }
      } else {
        await createStaffMutation.mutateAsync({
          name: values.name,
          avatar,
          email: values.email,
          phone: values.phone,
          potition: values.position,
          department_item: department?.id ?? 0,
          department_name: department?.name ?? "",
          division_item: division?.id ?? 0,
          division_name: division?.name ?? "",
          password: values.password,
        });
      }
      navigate("/staff");
    } catch {
      window.alert("Lưu thông tin cán bộ thất bại. Vui lòng thử lại.");
    }
  });

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
                <Label>
                  Ảnh đại diện{" "}
                  {mode === "create" && <span className="text-red-500">*</span>}
                </Label>
                <Controller
                  control={control}
                  name="avatar"
                  render={({ field }) => (
                    <MediaUpload
                      value={field.value}
                      onChange={field.onChange}
                      onUpload={handleUploadAvatar}
                      accept="image/*"
                      multiple={false}
                      hint="Nhấn để chọn hoặc kéo thả ảnh vào đây. Khuyến nghị: vuông hoặc gần vuông."
                    />
                  )}
                />
                <FieldError message={errors.avatar?.message} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="staff-name">
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <Input
                        id="staff-name"
                        {...field}
                        placeholder="Nguyễn Văn A"
                      />
                    )}
                  />
                  <FieldError message={errors.name?.message} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="staff-email">Email</Label>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <Input
                        id="staff-email"
                        {...field}
                        placeholder="email@company.com"
                      />
                    )}
                  />
                  <FieldError message={errors.email?.message} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="staff-phone">
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="phone"
                    render={({ field }) => (
                      <Input
                        id="staff-phone"
                        {...field}
                        placeholder="0901234567"
                      />
                    )}
                  />
                  <FieldError message={errors.phone?.message} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="staff-department">
                    Phòng ban <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="department"
                    render={({ field }) => (
                      <Select
                        id="staff-department"
                        {...field}
                      >
                        <option value="">Chọn...</option>
                        {departmentsData?.content.map((department) => (
                          <option
                            key={department.id}
                            value={String(department.id)}
                          >
                            {department.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                  <FieldError message={errors.department?.message} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="staff-field">
                    Lĩnh vực{" "}
                    {mode === "create" && <span className="text-red-500">*</span>}
                  </Label>
                  <Controller
                    control={control}
                    name="field"
                    render={({ field }) => (
                      <Select id="staff-field" {...field}>
                        <option value="">Chọn...</option>
                        {divisionsData?.content.map((division) => (
                          <option key={division.id} value={String(division.id)}>
                            {division.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                  <FieldError message={errors.field?.message} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="staff-position">
                    Chức vụ <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="position"
                    render={({ field }) => (
                      <Input
                        id="staff-position"
                        {...field}
                        placeholder="Developer"
                      />
                    )}
                  />
                  <FieldError message={errors.position?.message} />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="staff-status">Trạng thái tài khoản</Label>
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select id="staff-status" {...field}>
                        {["active", "inactive"].map((value) => (
                          <option key={value} value={value}>
                            {value === "active" ? "Hoạt động" : "Tạm khóa"}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                </div>

                {mode === "create" && (
                  <div className="grid gap-2">
                    <Label htmlFor="staff-password">
                      Mật khẩu <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="password"
                      render={({ field }) => (
                        <Input
                          id="staff-password"
                          type="password"
                          {...field}
                          placeholder="••••••••"
                        />
                      )}
                    />
                    <FieldError message={errors.password?.message} />
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
