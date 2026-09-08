import {
  CalendarCheck,
  Ban,
  CheckCircle2,
  Clock,
} from "lucide-react";

import type { ScheduleItem } from "@/features/schedule/types/get-schedules.response";

export const PAGE_SIZE = 10;

export type ScheduleListTab = "pending" | "confirmed" | "completed" | "cancelled";

export type PendingScheduleAction =
  | { type: "confirm"; item: ScheduleItem }
  | { type: "resolve"; item: ScheduleItem };

export const statusMeta = {
  pending: { label: "Chờ xác nhận", variant: "secondary" as const, icon: Clock },
  confirmed: {
    label: "Đã xác nhận",
    variant: "warning" as const,
    icon: CalendarCheck,
  },
  completed: {
    label: "Hoàn thành",
    variant: "success" as const,
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Đã huỷ",
    variant: "destructive" as const,
    icon: Ban,
  },
};

export function scheduleStatus(item: ScheduleItem) {
  if (item.status === 3) return statusMeta.cancelled;
  if (item.status === 2) return statusMeta.completed;
  if (item.status === 1) return statusMeta.confirmed;
  return statusMeta.pending;
}

export const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const formatScheduleDate = (value: number) => {
  const raw = String(value);
  if (!/^\d{8}$/.test(raw)) return raw;
  return `${raw.slice(6, 8)}/${raw.slice(4, 6)}/${raw.slice(0, 4)}`;
};

export const scheduleHourLabel = (
  value: string,
  timeScheduleMap: Map<string, string>,
) => timeScheduleMap.get(value) ?? value ?? "Chưa chọn khung giờ";
