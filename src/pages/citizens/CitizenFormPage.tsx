import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "../../shared/components/Layout";
import { MediaUpload, type MediaFile } from "../../shared/components/MediaUpload";
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
  useCitizenProfileQuery,
  useEditCitizenProcessMutation,
} from "@/features/citizen/hooks/citizen.hook";
import { useUploadImageMutation } from "@/features/upload/hooks/upload.hook";
import { Spinner } from "../../shared/components/ui/spinner";

type CitizenFormPageProps = {
  mode: "create" | "edit";
  citizenId?: string;
};

type CitizenFormFields = {
  citizen_number: string;
  name: string;
  email: string;
  address: string;
  hamlet: string;
  gender: number;
  degree: string;
  career: string;
  ethnicity: string;
  religion: string;
  note: string;
};

const defaultFields = (): CitizenFormFields => ({
  citizen_number: "",
  name: "",
  email: "",
  address: "",
  hamlet: "",
  gender: 0,
  degree: "",
  career: "",
  ethnicity: "",
  religion: "",
  note: "",
});

export function CitizenFormPage({ mode, citizenId }: CitizenFormPageProps) {
  const [, navigate] = useLocation();
  const { data: citizen, isLoading: isCitizenLoading, isError: isCitizenError } =
    useCitizenProfileQuery(mode === "edit" ? citizenId : undefined);
  const editMutation = useEditCitizenProcessMutation();
  const uploadImageMutation = useUploadImageMutation();

  const [fields, setFields] = useState<CitizenFormFields>(defaultFields());
  const [avatarFiles, setAvatarFiles] = useState<MediaFile[]>([]);

  useEffect(() => {
    if (mode === "edit" && citizen) {
      setFields({
        ...defaultFields(),
        citizen_number: citizen.citizen_number ?? "",
        name: citizen.name,
        email: citizen.email ?? "",
        address: citizen.address ?? "",
        hamlet: citizen.hamlet ?? "",
        gender: citizen.gender ?? 0,
        degree: citizen.degree ?? "",
        career: citizen.career ?? "",
        ethnicity: citizen.ethnicity ?? "",
        religion: citizen.religion ?? "",
        note: citizen.note ?? "",
      });
      setAvatarFiles(
        citizen.avatar
          ? [{ id: "current-avatar", name: "avatar", url: citizen.avatar }]
          : [],
      );
    }
  }, [mode, citizen]);

  const updateForm = (patch: Partial<CitizenFormFields>) => {
    setFields((current) => ({ ...current, ...patch }));
  };

  const handleUploadAvatar = async (file: File) => {
    const url = await uploadImageMutation.mutateAsync({
      file,
      c: file.name.replace(/\.[^/.]+$/, ""),
    });
    if (!url) {
      throw new Error("Upload image response missing url");
    }
    return url;
  };

  const handleSave = async () => {
    if (!citizen) return;
    const name = fields.name.trim();
    if (!name) {
      window.alert("Vui lòng nhập họ và tên.");
      return;
    }

    try {
      await editMutation.mutateAsync({
        id: citizen.id,
        zalo_user_id: citizen.zalo_user_id,
        citizen_number: fields.citizen_number.trim(),
        name,
        avatar: avatarFiles[0]?.url ?? "",
        email: fields.email,
        address: fields.address,
        hamlet: fields.hamlet,
        gender: fields.gender,
        degree: fields.degree,
        career: fields.career,
        ethnicity: fields.ethnicity,
        religion: fields.religion,
        note: fields.note,
      });
      navigate("/citizens");
    } catch {
      window.alert("Lưu hồ sơ công dân thất bại. Vui lòng thử lại.");
    }
  };

  if (mode === "create") {
    return (
      <Layout>
        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle>Không hỗ trợ tạo công dân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Công dân tự đăng ký hồ sơ qua ứng dụng Zalo Mini App. Hệ thống
              quản trị chỉ có API chỉnh sửa (edit), không có API tạo mới.
            </p>
            <Button onClick={() => navigate("/citizens")}>
              Quay lại danh sách
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  if (isCitizenLoading) {
    return (
      <Layout>
        <Card className="mx-auto max-w-lg">
          <CardContent className="flex items-center gap-3 py-8">
            <Spinner className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              Đang tải hồ sơ công dân...
            </span>
          </CardContent>
        </Card>
      </Layout>
    );
  }

  if (isCitizenError || !citizen) {
    return (
      <Layout>
        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle>Không tải được hồ sơ công dân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Kiểm tra lại `zalo_user_id` trên đường dẫn hoặc thử tải lại trang.
            </p>
            <Button onClick={() => navigate("/citizens")}>
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
              Chỉnh sửa hồ sơ công dân
            </h1>
            <p className="mt-1 text-muted-foreground">
              Cập nhật thông tin cá nhân của công dân.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate("/citizens")}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={editMutation.isPending}>
              {editMutation.isPending ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </div>

        <Card className="w-full">
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-3">
              <Label>Ảnh đại diện</Label>
              <MediaUpload
                value={avatarFiles}
                onChange={setAvatarFiles}
                onUpload={handleUploadAvatar}
                accept="image/*"
                multiple={false}
                hint="Khuyến nghị: vuông hoặc gần vuông."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="citizen-name">
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="citizen-name"
                  value={fields.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                  placeholder="Nhập họ và tên công dân"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="citizen-number">Số CCCD / CMND</Label>
                <Input
                  id="citizen-number"
                  value={fields.citizen_number}
                  onChange={(e) =>
                    updateForm({ citizen_number: e.target.value })
                  }
                  placeholder="Nhập số CCCD/CMND"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="citizen-phone">Số điện thoại</Label>
                <Input id="citizen-phone" value={citizen.phone} disabled />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="citizen-gender">Giới tính</Label>
                <Select
                  id="citizen-gender"
                  value={String(fields.gender)}
                  onChange={(e) =>
                    updateForm({ gender: Number(e.target.value) })
                  }
                >
                  <option value="0">Khác</option>
                  <option value="1">Nam</option>
                  <option value="2">Nữ</option>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="citizen-religion">Tôn giáo</Label>
                <Input
                  id="citizen-religion"
                  value={fields.religion}
                  onChange={(e) => updateForm({ religion: e.target.value })}
                  placeholder="Nhập tôn giáo"
                />
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="citizen-email">Email</Label>
                <Input
                  id="citizen-email"
                  value={fields.email}
                  onChange={(e) => updateForm({ email: e.target.value })}
                  placeholder="Nhập email nếu có"
                />
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="citizen-address">Địa chỉ</Label>
                <Input
                  id="citizen-address"
                  value={fields.address}
                  onChange={(e) => updateForm({ address: e.target.value })}
                  placeholder="Nhập địa chỉ"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="citizen-hamlet">Thôn/Xóm</Label>
                <Input
                  id="citizen-hamlet"
                  value={fields.hamlet}
                  onChange={(e) => updateForm({ hamlet: e.target.value })}
                  placeholder="Nhập thôn/xóm"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="citizen-career">Nghề nghiệp</Label>
                <Input
                  id="citizen-career"
                  value={fields.career}
                  onChange={(e) => updateForm({ career: e.target.value })}
                  placeholder="Nhập nghề nghiệp"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="citizen-degree">Trình độ học vấn</Label>
                <Input
                  id="citizen-degree"
                  value={fields.degree}
                  onChange={(e) => updateForm({ degree: e.target.value })}
                  placeholder="Nhập trình độ học vấn"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="citizen-ethnicity">Dân tộc</Label>
                <Input
                  id="citizen-ethnicity"
                  value={fields.ethnicity}
                  onChange={(e) => updateForm({ ethnicity: e.target.value })}
                  placeholder="Nhập dân tộc"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="citizen-note">Ghi chú</Label>
              <Input
                id="citizen-note"
                value={fields.note}
                onChange={(e) => updateForm({ note: e.target.value })}
                placeholder="Nhập ghi chú nếu có"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
