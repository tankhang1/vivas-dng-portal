import { useEffect, useRef } from "react";
import { Eye, User } from "lucide-react";

import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui";
import { Spinner } from "@/shared/components/ui/spinner";
import type { ScheduleItem } from "@/features/schedule/types/get-schedules.response";
import { formatScheduleDate, scheduleHourLabel, scheduleStatus } from "../types";

type ScheduleTableProps = {
  items: ScheduleItem[];
  isLoading: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  isError: boolean;
  timeScheduleMap: Map<string, string>;
  onOpenDetail: (item: ScheduleItem) => void;
  onLoadMore: () => void;
};

export function ScheduleTable({
  items,
  isLoading,
  isFetching,
  isFetchingNextPage,
  hasNextPage,
  isError,
  timeScheduleMap,
  onOpenDetail,
  onLoadMore,
}: ScheduleTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const showInitialLoading = isLoading && items.length === 0;
  const showRefetchOverlay = isFetching && !isFetchingNextPage && !showInitialLoading;

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { root: scrollContainerRef.current, rootMargin: "240px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="overflow-auto"
        style={{ maxHeight: "480px" }}
      >
        <Table className="min-w-[760px]">
          <TableHeader className="sticky top-0 z-10 bg-white">
            <TableRow>
              <TableHead>Nội dung</TableHead>
              <TableHead>Người đặt</TableHead>
              <TableHead>Ngày hẹn</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showInitialLoading && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Spinner className="h-4 w-4" /> Đang tải dữ liệu...
                  </span>
                </TableCell>
              </TableRow>
            )}
            {isError && !showInitialLoading && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-red-600">
                  Không thể tải danh sách lịch hẹn. Vui lòng thử lại.
                </TableCell>
              </TableRow>
            )}
            {!showInitialLoading &&
              !isError &&
              items.map((item) => {
                const meta = scheduleStatus(item);

                return (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => onOpenDetail(item)}
                  >
                    <TableCell className="max-w-[220px] truncate font-medium md:max-w-[280px]">
                      {item.title || item.content || "Lịch hẹn"}
                    </TableCell>
                    <TableCell className="max-w-[160px]">
                      <div className="flex items-center gap-1.5 text-sm">
                        <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">{item.name || "Không rõ"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatScheduleDate(item.time_day_schedule)} -{" "}
                      {scheduleHourLabel(item.schedule_hour, timeScheduleMap)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={meta.variant} className="gap-1">
                        <meta.icon className="h-3 w-3" /> {meta.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" onClick={() => onOpenDetail(item)}>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            {!showInitialLoading && !isError && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Không tìm thấy lịch hẹn nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div ref={loadMoreRef} className="flex min-h-10 items-center justify-center">
          {isFetchingNextPage && <Spinner className="h-4 w-4" />}
        </div>
      </div>
      {showRefetchOverlay && (
        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-white/60 backdrop-blur-[1px]">
          <Spinner className="h-6 w-6 text-primary" />
        </div>
      )}
    </div>
  );
}
