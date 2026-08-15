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
import { getCitizenById, saveCitizen } from "./store";
import {
  defaultCitizen,
  genderOptions,
  type CitizenRecord,
  type CitizenStatus,
  type Gender,
} from "./types";

type CitizenFormPageProps = {
  mode: "create" | "edit";
  citizenId?: string;
};

export function CitizenFormPage({ mode, citizenId }: CitizenFormPageProps) {
  const [, navigate] = useLocation();
  const citizen = useMemo(() => {
    if (mode === "edit" && citizenId) {
      return getCitizenById(citizenId);
    }
    return null;
  }, [citizenId, mode]);

  const [form, setForm] = useState<CitizenRecord>(defaultCitizen());

  useEffect(() => {
    if (mode === "edit" && citizen) {
      setForm({
        ...citizen,
        gender: citizen.gender === "-" ? "" : citizen.gender,
        household: citizen.household === "-" ? "" : citizen.household,
        relationship: citizen.relationship === "-" ? "" : citizen.relationship,
        area: citizen.area === "-" ? "" : citizen.area,
        householdCode:
          citizen.householdCode === "-" ? "" : citizen.householdCode,
        householdSize:
          citizen.householdSize === "0" ? "" : citizen.householdSize,
        householdHeadRelation:
          citizen.householdHeadRelation === "-"
            ? ""
            : citizen.householdHeadRelation,
        householdAddress:
          citizen.householdAddress === "-" ? "" : citizen.householdAddress,
        systemUser: citizen.systemUser === "-" ? "" : citizen.systemUser,
        zmaUser: citizen.zmaUser === "-" ? "" : citizen.zmaUser,
        avatar: citizen.avatar ?? [],
      });
    } else {
      setForm(defaultCitizen());
    }
  }, [citizen, mode]);

  const updateForm = (patch: Partial<CitizenRecord>) => {
    setForm((current) => ({ ...current, ...patch }));
  };

  const handleSave = (status: CitizenStatus = form.status) => {
    saveCitizen({
      ...form,
      status,
      id: mode === "edit" ? form.id : Date.now().toString(),
    });
    navigate("/citizens");
  };

  if (mode === "edit" && !citizen) {
    return (
      <Layout>
        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <CardTitle>Không tìm thấy công dân</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Hồ sơ công dân bạn muốn chỉnh sửa không tồn tại hoặc đã bị xóa.
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
              {mode === "edit"
                ? "Chỉnh sửa hồ sơ công dân"
                : "Thêm công dân mới"}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Cập nhật thông tin cá nhân của công dân.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate("/citizens")}>
              Hủy
            </Button>
            {mode === "edit" ? (
              <Button onClick={() => handleSave()}>Lưu</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => handleSave("draft")}>
                  Lưu nháp
                </Button>
                <Button onClick={() => handleSave("published")}>
                  Tạo mới
                </Button>
              </>
            )}
          </div>
        </div>

        <Card className="w-full">
          <CardContent className="space-y-6 pt-6">
                <div className="space-y-3">
                  <Label>Ảnh đại diện</Label>
                  <MediaUpload
                    value={form.avatar}
                    onChange={(avatar) => updateForm({ avatar })}
                    accept="image/*"
                    multiple={false}
                    hint="Khuyến nghị: vuông hoặc gần vuông - tải lên hoặc chọn từ thư viện"
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
                  <Input
                    value={form.avatar[0]?.url ?? ""}
                    onChange={(e) =>
                      updateForm({
                        avatar: e.target.value
                          ? [
                              {
                                id: "avatar",
                                name: "avatar-image",
                                url: e.target.value,
                              },
                            ]
                          : [],
                      })
                    }
                    placeholder="https://..."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="citizen-name">
                      Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="citizen-name"
                      value={form.name}
                      onChange={(e) => updateForm({ name: e.target.value })}
                      placeholder="Nhập họ và tên công dân"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="citizen-birthday">Ngày sinh</Label>
                    <Input
                      id="citizen-birthday"
                      value={form.birthday}
                      onChange={(e) => updateForm({ birthday: e.target.value })}
                      placeholder="Chọn ngày sinh..."
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="citizen-gender">Giới tính</Label>
                    <Select
                      id="citizen-gender"
                      value={form.gender}
                      onChange={(e) =>
                        updateForm({ gender: e.target.value as Gender })
                      }
                    >
                      <option value="">Chọn giới tính...</option>
                      {genderOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="citizen-cccd">Căn Cước</Label>
                    <Input
                      id="citizen-cccd"
                      value={form.cccd}
                      onChange={(e) => updateForm({ cccd: e.target.value })}
                      placeholder="Nhập số Căn Cước"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="citizen-phone">
                      Số điện thoại <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="citizen-phone"
                      value={form.phone}
                      onChange={(e) => updateForm({ phone: e.target.value })}
                      placeholder="VD: 0912345678"
                    />
                  </div>

                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="citizen-email">Email</Label>
                    <Input
                      id="citizen-email"
                      value={form.email}
                      onChange={(e) => updateForm({ email: e.target.value })}
                      placeholder="Nhập email nếu có"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="citizen-occupation">Nghề nghiệp</Label>
                    <Input
                      id="citizen-occupation"
                      value={form.occupation}
                      onChange={(e) =>
                        updateForm({ occupation: e.target.value })
                      }
                      placeholder="Nhập nghề nghiệp"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="citizen-education">Trình độ học vấn</Label>
                    <Input
                      id="citizen-education"
                      value={form.education}
                      onChange={(e) =>
                        updateForm({ education: e.target.value })
                      }
                      placeholder="Nhập trình độ học vấn"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="citizen-ethnicity">Dân tộc</Label>
                    <Input
                      id="citizen-ethnicity"
                      value={form.ethnicity}
                      onChange={(e) =>
                        updateForm({ ethnicity: e.target.value })
                      }
                      placeholder="Nhập dân tộc"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="citizen-religion">Tôn giáo</Label>
                    <Input
                      id="citizen-religion"
                      value={form.religion}
                      onChange={(e) => updateForm({ religion: e.target.value })}
                      placeholder="Nhập tôn giáo"
                    />
                  </div>
                </div>

                <div className="grid gap-2 md:col-span-2">
                  <Label htmlFor="citizen-notes">Ghi chú</Label>
                  <Input
                    id="citizen-notes"
                    value={form.notes}
                    onChange={(e) => updateForm({ notes: e.target.value })}
                    placeholder="Nhập ghi chú nếu có"
                  />
                </div>

                {mode === "edit" && (
                  <div className="grid gap-2">
                    <Label htmlFor="citizen-status">Trạng thái</Label>
                    <Select
                      id="citizen-status"
                      value={form.status}
                      onChange={(e) =>
                        updateForm({ status: e.target.value as CitizenStatus })
                      }
                    >
                      <option value="published">Đang hoạt động</option>
                      <option value="draft">Tạm ẩn</option>
                    </Select>
                  </div>
                )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
