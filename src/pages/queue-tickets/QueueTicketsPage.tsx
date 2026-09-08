import { useEffect, useMemo, useState } from "react";

import { Layout } from "@/shared/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useInfiniteScheduleCategoriesQuery } from "@/features/category-schedule/hooks/category-schedule.hook";
import {
  useConfirmScheduleMeetProcessMutation,
  useInfiniteSchedulesByCategoryQuery,
  useResolveScheduleMeetProcessMutation,
  useTimeScheduleQuery,
} from "@/features/schedule/hooks/schedule.hook";
import { useInfiniteStaffCoordinateSchedulesByStaffQuery } from "@/features/staff/hooks/staff.hook";
import type { CategoryItem } from "@/features/category-news/types/get-categories.response";
import type { ScheduleItem } from "@/features/schedule/types/get-schedules.response";
import { CURRENT_STAFF } from "@/pages/news/types";
import { useAuth } from "@/shared/providers";

import { CategorySidebar } from "./components/CategorySidebar";
import { ScheduleTable } from "./components/ScheduleTable";
import { ScheduleDetailDialog } from "./components/ScheduleDetailDialog";
import { ConfirmActionDialog } from "./components/ConfirmActionDialog";
import {
  PAGE_SIZE,
  scheduleStatus,
  statusMeta,
  type PendingScheduleAction,
  type ScheduleListTab,
} from "./types";

export default function QueueTicketsPage() {
  const { isAdminRole } = useAuth();
  const [activeTab, setActiveTab] = useState<ScheduleListTab>("pending");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [current, setCurrent] = useState<ScheduleItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingScheduleAction | null>(null);
  const timeScheduleQuery = useTimeScheduleQuery();
  const timeScheduleMap = useMemo(
    () =>
      new Map(
        (timeScheduleQuery.data ?? []).map((item) => [item.code, item.range_time]),
      ),
    [timeScheduleQuery.data],
  );

  const adminCategoriesQuery = useInfiniteScheduleCategoriesQuery(
    { sz: PAGE_SIZE },
    isAdminRole,
  );
  const staffCategoriesQuery = useInfiniteStaffCoordinateSchedulesByStaffQuery(
    { staffId: CURRENT_STAFF.id, sz: PAGE_SIZE },
    !isAdminRole,
  );
  const categoriesQuery = isAdminRole ? adminCategoriesQuery : staffCategoriesQuery;
  const categories = useMemo(() => {
    const unique = new Map<number, Pick<CategoryItem, "id" | "name">>();

    if (isAdminRole) {
      adminCategoriesQuery.data?.pages.forEach((pageData) => {
        pageData.content.forEach((item) => {
          unique.set(item.id, { id: item.id, name: item.name });
        });
      });
    } else {
      staffCategoriesQuery.data?.pages.forEach((pageData) => {
        pageData.content.forEach((item) => {
          unique.set(item.schedule_category_item, {
            id: item.schedule_category_item,
            name: item.schedule_category_name ?? "Không rõ danh mục",
          });
        });
      });
    }

    return Array.from(unique.values());
  }, [adminCategoriesQuery.data?.pages, isAdminRole, staffCategoriesQuery.data?.pages]);

  useEffect(() => {
    if (categories.length > 0 && !categories.some((item) => item.id === selectedCategoryId)) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const selectedCategoryName = useMemo(() => {
    if (selectedCategoryId === "") return "";
    return categories.find((item) => item.id === selectedCategoryId)?.name ?? "";
  }, [categories, selectedCategoryId]);

  const viewQuery = useInfiniteSchedulesByCategoryQuery(
    { categoryId: selectedCategoryId, sz: PAGE_SIZE },
    selectedCategoryId !== "",
  );
  const allItems = useMemo(
    () => viewQuery.data?.pages.flatMap((pageData) => pageData.content) ?? [],
    [viewQuery.data?.pages],
  );
  const items = useMemo(() => {
    const filtered = allItems.filter((item) => {
      const status = scheduleStatus(item);
      if (activeTab === "pending") return status === statusMeta.pending;
      if (activeTab === "confirmed") return status === statusMeta.confirmed;
      if (activeTab === "cancelled") return status === statusMeta.cancelled;
      return status === statusMeta.completed;
    });

    return filtered.sort((a, b) => b.time_create_number - a.time_create_number);
  }, [activeTab, allItems]);
  const showInitialLoading = viewQuery.isLoading && items.length === 0;
  const showRefetchOverlay =
    viewQuery.isFetching && !viewQuery.isFetchingNextPage && !showInitialLoading;

  const confirmMutation = useConfirmScheduleMeetProcessMutation();
  const resolveMutation = useResolveScheduleMeetProcessMutation();

  const handleOpenDetail = (item: ScheduleItem) => {
    setCurrent(item);
    setIsDialogOpen(true);
  };

  const buildActionPayload = (item: ScheduleItem) => ({
    zalo_user_id: item.zalo_user_id,
    category_item: item.category_item,
    schedule_hour: item.schedule_hour,
    time_day_schedule: item.time_day_schedule,
  });

  const executeAction = async (action: PendingScheduleAction) => {
    try {
      if (action.type === "confirm") {
        await confirmMutation.mutateAsync(buildActionPayload(action.item));
        setCurrent((value) =>
          value && value.id === action.item.id ? { ...value, status: 1 } : value,
        );
      } else {
        await resolveMutation.mutateAsync(buildActionPayload(action.item));
        setCurrent((value) =>
          value && value.id === action.item.id ? { ...value, status: 2 } : value,
        );
      }
    } catch {
      window.alert(
        action.type === "confirm"
          ? "Xác nhận lịch hẹn thất bại. Vui lòng thử lại."
          : "Hoàn tất lịch hẹn thất bại. Vui lòng thử lại.",
      );
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Đặt lịch hẹn</h1>
          <p className="mt-1 text-muted-foreground">
            Quản lý lịch hẹn theo danh mục và trạng thái xử lý.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,7fr)]">
          <CategorySidebar
            categories={categories}
            isLoading={categoriesQuery.isLoading}
            isFetchingNextPage={categoriesQuery.isFetchingNextPage}
            hasNextPage={!!categoriesQuery.hasNextPage}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            onLoadMore={() => {
              void categoriesQuery.fetchNextPage();
            }}
          />

          <Card className="min-w-0 overflow-hidden">
            <CardHeader className="flex min-w-0 flex-col gap-3 pb-3 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <CardTitle className="text-lg">Danh sách lịch hẹn</CardTitle>
                <div className="break-words text-sm text-muted-foreground">
                  {selectedCategoryName
                    ? `Danh mục: ${selectedCategoryName}`
                    : "Chọn một danh mục để tải danh sách lịch hẹn."}
                </div>
              </div>
              <div className="w-full min-w-0 overflow-x-auto pb-1 md:w-auto">
                <Tabs
                  value={activeTab}
                  onValueChange={(value) => {
                    setActiveTab(value as ScheduleListTab);
                    setIsDialogOpen(false);
                    setCurrent(null);
                  }}
                >
                  <TabsList className="inline-flex w-max min-w-max">
                    <TabsTrigger value="pending" className="whitespace-nowrap">
                      Chờ xác nhận
                    </TabsTrigger>
                    <TabsTrigger value="confirmed" className="whitespace-nowrap">
                      Đã xác nhận
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="whitespace-nowrap">
                      Hoàn thành
                    </TabsTrigger>
                    <TabsTrigger value="cancelled" className="whitespace-nowrap">
                      Đã huỷ
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <ScheduleTable
                items={items}
                isLoading={showInitialLoading}
                isFetching={showRefetchOverlay}
                isFetchingNextPage={viewQuery.isFetchingNextPage}
                hasNextPage={!!viewQuery.hasNextPage}
                isError={viewQuery.isError}
                timeScheduleMap={timeScheduleMap}
                onOpenDetail={handleOpenDetail}
                onLoadMore={() => {
                  void viewQuery.fetchNextPage();
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <ScheduleDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        current={current}
        onConfirm={() => current && setPendingAction({ type: "confirm", item: current })}
        onResolve={() => current && setPendingAction({ type: "resolve", item: current })}
        isConfirming={confirmMutation.isPending}
        isResolving={resolveMutation.isPending}
        timeScheduleMap={timeScheduleMap}
        canManage={!isAdminRole}
      />

      <ConfirmActionDialog
        pendingAction={pendingAction}
        isProcessing={confirmMutation.isPending || resolveMutation.isPending}
        onCancel={() => setPendingAction(null)}
        onConfirm={async () => {
          if (pendingAction) await executeAction(pendingAction);
        }}
      />
    </Layout>
  );
}
