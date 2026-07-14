import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "../../components/Layout";
import { MediaUpload } from "../../components/MediaUpload";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogTitle,
  Input,
  Label,
  Select,
} from "../../components/ui";
import { FormEditor } from "../../components/FormEditor";
import { saveEvent, getEventById } from "./store";
import {
  categoryLabel,
  defaultEvent,
  eventCategories,
  formatDateTime,
  splitDateTime,
  combineDateTime,
  nowAsDateTimeLocal,
  type EventCategory,
  type EventItem,
  type EventStatus,
} from "./types";

type EventFormPageProps = {
  mode: "create" | "edit";
  eventId?: string;
};

export function EventFormPage({ mode, eventId }: EventFormPageProps) {
  const [, navigate] = useLocation();
  const event = useMemo(() => {
    if (mode === "edit" && eventId) {
      return getEventById(eventId);
    }
    return null;
  }, [eventId, mode]);

  const [form, setForm] = useState<EventItem>(defaultEvent());

  useEffect(() => {
    if (mode === "edit" && event) {
      setForm(event);
    } else {
      setForm({
        ...defaultEvent(),
        startAt: nowAsDateTimeLocal(),
        endAt: nowAsDateTimeLocal(),
      });
    }
  }, [event, mode]);

  const updateForm = (patch: Partial<EventItem>) => {
    setForm((current) => ({
      ...current,
      ...patch,
    }));
  };

  const handleSave = (status: EventStatus = "draft") => {
    saveEvent({
      ...form,
      status,
      id: mode === "edit" ? form.id : Date.now().toString(),
    });
    navigate("/events");
  };

  if (mode === "edit" && !event) {
    return (
      <Layout>
        <Dialog
          open
          onOpenChange={() => navigate("/events")}
          className="max-w-lg"
        >
          <div className="space-y-4">
            <DialogTitle>Không tìm thấy sự kiện</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Sự kiện bạn muốn chỉnh sửa không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => navigate("/events")}>
              Quay lại danh sách
            </Button>
          </div>
        </Dialog>
      </Layout>
    );
  }

  const startParts = splitDateTime(form.startAt);
  const endParts = splitDateTime(form.endAt);

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {mode === "edit" ? "Chỉnh sửa sự kiện" : "Tạo sự kiện mới"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "edit"
                ? `Cập nhật sự kiện: ${event ? categoryLabel(event.category) : ""}`
                : "Cập nhật đầy đủ thông tin sự kiện, xuất bản và cấu hình tham gia."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate("/events")}>
              Hủy
            </Button>
            <Button variant="outline" onClick={() => handleSave("draft")}>
              Lưu nháp
            </Button>
            <Button onClick={() => handleSave("published")}>Xuất bản</Button>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_560px]">
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Ảnh bìa sự kiện</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <MediaUpload
                  value={form.thumbnail}
                  onChange={(thumbnail) => updateForm({ thumbnail })}
                  accept="image/*"
                  multiple={false}
                  hint="Nhấn hoặc kéo thả ảnh bìa sự kiện."
                />
                <div className="grid gap-2">
                  <Label htmlFor="event-thumbnail-url">Nhập URL ảnh</Label>
                  <Input
                    id="event-thumbnail-url"
                    value={form.thumbnail?.[0]?.url || ""}
                    onChange={(e) =>
                      updateForm({
                        thumbnail: e.target.value
                          ? [
                              {
                                id: "cover",
                                name: "event-cover",
                                url: e.target.value,
                              },
                            ]
                          : [],
                      })
                    }
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Thông tin sự kiện</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-2">
                  <Label htmlFor="event-title">
                    Tên sự kiện <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="event-title"
                    value={form.title}
                    onChange={(e) => updateForm({ title: e.target.value })}
                    placeholder="Nhập tên sự kiện..."
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="event-description">
                    Mô tả sự kiện <span className="text-red-500">*</span>
                  </Label>
                  <FormEditor
                    value={form.descriptionHtml}
                    onChange={(descriptionHtml) =>
                      updateForm({ descriptionHtml })
                    }
                    placeholder="Nhập mô tả sự kiện..."
                    className="min-h-[260px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Ghi chú nội bộ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-2">
                  <Label htmlFor="event-notes">Ghi chú</Label>
                  <FormEditor
                    value={form.notesHtml}
                    onChange={(notesHtml) => updateForm({ notesHtml })}
                    placeholder="Nhập ghi chú nội bộ..."
                    className="min-h-[220px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-5 self-start">
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">
                  Trạng thái và Xuất bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                <div className="grid gap-2">
                  <Label>
                    Trạng thái <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.status}
                    onChange={(e) =>
                      updateForm({ status: e.target.value as EventStatus })
                    }
                  >
                    <option value="draft">Nháp</option>
                    <option value="published">Xuất bản</option>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>
                    Loại sự kiện <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.category}
                    onChange={(e) =>
                      updateForm({ category: e.target.value as EventCategory })
                    }
                  >
                    {eventCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isPublic}
                    onChange={(e) => updateForm({ isPublic: e.target.checked })}
                  />
                  Sự kiện công khai
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.requiresRegistration}
                    onChange={(e) =>
                      updateForm({ requiresRegistration: e.target.checked })
                    }
                  />
                  Yêu cầu đăng ký
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.trackAttendance}
                    onChange={(e) =>
                      updateForm({ trackAttendance: e.target.checked })
                    }
                  />
                  Theo dõi số lượng tham gia
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.showMobileRegisterButton}
                    onChange={(e) =>
                      updateForm({ showMobileRegisterButton: e.target.checked })
                    }
                  />
                  Hiển thị nút đăng ký trên chi tiết mobile
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.useQrCheckin}
                    onChange={(e) =>
                      updateForm({ useQrCheckin: e.target.checked })
                    }
                  />
                  Sử dụng QR check-in
                </label>

                <div className="grid gap-2">
                  <Label htmlFor="event-registration-deadline">
                    Hạn đăng ký
                  </Label>
                  <Input
                    id="event-registration-deadline"
                    type="date"
                    value={form.registrationDeadline}
                    onChange={(e) =>
                      updateForm({ registrationDeadline: e.target.value })
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Chỉ chọn một: nút đăng ký trên app hoặc QR check-in. Link
                  check-in sau đăng ký cấu hình tại Cài đặt → Mobile.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Thời gian và Địa điểm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="event-start-date">
                      Ngày bắt đầu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="event-start-date"
                      type="date"
                      value={startParts.date}
                      onChange={(e) =>
                        updateForm({
                          startAt: combineDateTime(
                            e.target.value,
                            startParts.time,
                          ),
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="event-start-time">Giờ bắt đầu</Label>
                    <Input
                      id="event-start-time"
                      type="time"
                      value={startParts.time}
                      onChange={(e) =>
                        updateForm({
                          startAt: combineDateTime(
                            startParts.date,
                            e.target.value,
                          ),
                        })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="event-end-date">
                      Ngày kết thúc <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="event-end-date"
                      type="date"
                      value={endParts.date}
                      onChange={(e) =>
                        updateForm({
                          endAt: combineDateTime(e.target.value, endParts.time),
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="event-end-time">Giờ kết thúc</Label>
                    <Input
                      id="event-end-time"
                      type="time"
                      value={endParts.time}
                      onChange={(e) =>
                        updateForm({
                          endAt: combineDateTime(endParts.date, e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="event-location">
                    Địa điểm tổ chức <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="event-location"
                    value={form.location}
                    onChange={(e) => updateForm({ location: e.target.value })}
                    placeholder="VD: Hội trường A..."
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="event-online-link">
                    Link tham dự trực tuyến (nếu có)
                  </Label>
                  <Input
                    id="event-online-link"
                    value={form.onlineLink}
                    onChange={(e) => updateForm({ onlineLink: e.target.value })}
                    placeholder="https://meet.google.com/..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Số lượng và Tổ chức</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="event-capacity">
                      Sức chứa đặt chỗ tối đa (Booking)
                    </Label>
                    <Input
                      id="event-capacity"
                      type="number"
                      value={form.bookingCapacity}
                      onChange={(e) =>
                        updateForm({ bookingCapacity: e.target.value })
                      }
                      placeholder="VD: 200"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="event-max-guests">
                      Số khách mời tối đa
                    </Label>
                    <Input
                      id="event-max-guests"
                      type="number"
                      value={form.maxGuests}
                      onChange={(e) =>
                        updateForm({ maxGuests: e.target.value })
                      }
                      placeholder="VD: 50"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="event-organizer">Đơn vị tổ chức</Label>
                  <Input
                    id="event-organizer"
                    value={form.organizer}
                    onChange={(e) => updateForm({ organizer: e.target.value })}
                    placeholder="VD: Ban sự kiện"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="event-contact-email">Email liên hệ</Label>
                  <Input
                    id="event-contact-email"
                    value={form.contactEmail}
                    onChange={(e) =>
                      updateForm({ contactEmail: e.target.value })
                    }
                    placeholder="events@company.com"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
