import { MapPin } from "lucide-react";

import {
  Badge,
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui";
import type { ScheduleItem } from "@/features/schedule/types/get-schedules.response";
import { formatDateTime, formatScheduleDate, scheduleHourLabel, scheduleStatus, statusMeta } from "../types";

type ScheduleDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current: ScheduleItem | null;
  onConfirm: () => void;
  onResolve: () => void;
  isConfirming: boolean;
  isResolving: boolean;
  timeScheduleMap: Map<string, string>;
  canManage: boolean;
};

export function ScheduleDetailDialog({
  open,
  onOpenChange,
  current,
  onConfirm,
  onResolve,
  isConfirming,
  isResolving,
  timeScheduleMap,
  canManage,
}: ScheduleDetailDialogProps) {
  if (!current) return null;

  const status = scheduleStatus(current);
  const StatusIcon = status.icon;
  const canConfirm = canManage && status === statusMeta.pending;
  const canResolve =
    canManage && status !== statusMeta.completed && status !== statusMeta.cancelled;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{current.title || "Chi tiết lịch hẹn"}</DialogTitle>
        </DialogHeader>

        <div className="grid max-h-[65vh] gap-4 overflow-y-auto py-2">
          <div className="flex flex-wrap items-center gap-2">
            {current.category_name && (
              <Badge variant="outline">{current.category_name}</Badge>
            )}
            <Badge variant={status.variant} className="gap-1">
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Tạo ngày {formatDateTime(current.time_create)}
            </span>
          </div>

          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Người đặt lịch</p>
              <p className="font-medium">{current.name || "Không rõ"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Số điện thoại</p>
              <p className="font-medium">{current.phone || "Không có"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Ngày hẹn</p>
              <p className="font-medium">{formatScheduleDate(current.time_day_schedule)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Khung giờ</p>
              <p className="font-medium">
                {scheduleHourLabel(current.schedule_hour, timeScheduleMap)}
              </p>
            </div>
          </div>

          {current.address && (
            <div className="flex items-start gap-1.5 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{current.address}</span>
            </div>
          )}

          <div>
            <p className="mb-1 text-sm text-muted-foreground">Nội dung đặt lịch</p>
            <p className="text-sm leading-relaxed">{current.content || "-"}</p>
          </div>

          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Mã Zalo</p>
              <p className="break-all font-medium">{current.zalo_user_id || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Mã lịch hẹn</p>
              <p className="font-medium">{current.s_uuid || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Ngày xác nhận</p>
              <p className="font-medium">
                {current.time_verify ? formatDateTime(current.time_verify) : "-"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Ngày hoàn tất</p>
              <p className="font-medium">
                {current.time_met ? formatDateTime(current.time_met) : "-"}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          {canConfirm && (
            <Button onClick={onConfirm} disabled={isConfirming}>
              {isConfirming ? "Đang xác nhận..." : "Xác nhận lịch hẹn"}
            </Button>
          )}
          {canResolve && (
            <Button onClick={onResolve} disabled={isResolving}>
              {isResolving ? "Đang hoàn tất..." : "Hoàn tất lịch hẹn"}
            </Button>
          )}
        </DialogFooter>
      </div>
    </Dialog>
  );
}
