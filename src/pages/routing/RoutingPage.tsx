import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "../../shared/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "../../shared/components/ui";
import { Spinner } from "../../shared/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useInfiniteCommentCategoriesQuery } from "@/features/category-comment/hooks/category-comment.hook";
import {
  useSearchStaffQuery,
  useStaffCoordinateCommentsByCategoryApproveQuery,
  useStaffCoordinateCommentsByCategoryNoneApproveQuery,
  useCreateStaffCoordinateCommentProcessMutation,
  useEditStaffCoordinateCommentProcessMutation,
  useRemoveStaffCoordinateCommentProcessMutation,
} from "@/features/staff/hooks/staff.hook";
import type { StaffCoordinateCommentItem } from "@/features/staff/types/get-staff-coordinate-comment.response";
import { RoutingStaffDialog } from "./components/RoutingStaffDialog";
import {
  Edit2,
  Phone,
  Plus,
  Search,
  Shield,
  Trash2,
  Waypoints,
} from "lucide-react";

const CATEGORY_LIST_SIZE = 10;
const STAFF_LIST_SIZE = 200;

export default function RoutingPage() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [activeTab, setActiveTab] = useState<"approved" | "pending">("approved");
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [editingStaffLink, setEditingStaffLink] =
    useState<StaffCoordinateCommentItem | null>(null);
  const [pendingStaffSave, setPendingStaffSave] = useState<{
    staffId: string;
    approval: boolean;
    editingItem: StaffCoordinateCommentItem | null;
    categoryId: number;
    categoryName: string;
    staffName: string;
  } | null>(null);
  const [pendingStaffDelete, setPendingStaffDelete] =
    useState<StaffCoordinateCommentItem | null>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const categoryLoadMoreRef = useRef<HTMLDivElement>(null);

  const categoriesQuery = useInfiniteCommentCategoriesQuery({
    sz: CATEGORY_LIST_SIZE,
  });
  const categories = useMemo(
    () => categoriesQuery.data?.pages.flatMap((page) => page.content) ?? [],
    [categoriesQuery.data?.pages],
  );

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const query = searchTerm.trim().toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(query));
  }, [categories, searchTerm]);

  useEffect(() => {
    const target = categoryLoadMoreRef.current;
    if (!target || !categoriesQuery.hasNextPage || categoriesQuery.isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void categoriesQuery.fetchNextPage();
        }
      },
      { root: categoryScrollRef.current, rootMargin: "160px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [categoriesQuery.fetchNextPage, categoriesQuery.hasNextPage, categoriesQuery.isFetchingNextPage]);

  const activeCategoryId =
    selectedCategoryId !== "" ? selectedCategoryId : (categories[0]?.id ?? "");
  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  const { data: staffData } = useSearchStaffQuery({
    sz: STAFF_LIST_SIZE,
    nu: 0,
  });
  const staffList = staffData?.content ?? [];
  const staffById = useMemo(() => {
    const map = new Map<number, (typeof staffList)[number]>();
    staffList.forEach((staff) => map.set(staff.id, staff));
    return map;
  }, [staffList]);

  const approveQuery = useStaffCoordinateCommentsByCategoryApproveQuery({
    categoryId: activeCategoryId,
    sz: 200,
    nu: 0,
  });
  const pendingQuery = useStaffCoordinateCommentsByCategoryNoneApproveQuery({
    categoryId: activeCategoryId,
    sz: 200,
    nu: 0,
  });

  const approvedRows = approveQuery.data?.content ?? [];
  const pendingRows = pendingQuery.data?.content ?? [];
  const isLoadingRows = approveQuery.isLoading || pendingQuery.isLoading;

  const assignedStaffIds = useMemo(
    () => new Set([...approvedRows, ...pendingRows].map((r) => r.staff_item)),
    [approvedRows, pendingRows],
  );
  const assignableStaff = staffList.filter(
    (staff) => !assignedStaffIds.has(staff.id),
  );

  const createMutation = useCreateStaffCoordinateCommentProcessMutation();
  const editMutation = useEditStaffCoordinateCommentProcessMutation();
  const removeMutation = useRemoveStaffCoordinateCommentProcessMutation();
  const isToggling =
    createMutation.isPending ||
    editMutation.isPending ||
    removeMutation.isPending;

  const handleSelectCategory = (id: number) => {
    setSelectedCategoryId(id);
  };

  const handleOpenEditStaff = (item: StaffCoordinateCommentItem) => {
    setEditingStaffLink(item);
    setIsAddStaffDialogOpen(true);
  };

  const executeDeleteStaffLink = async (item: StaffCoordinateCommentItem) => {
    try {
      await removeMutation.mutateAsync({
        id: item.id,
        staff_item: item.staff_item,
      });
      if (editingStaffLink?.id === item.id) {
        setEditingStaffLink(null);
      }
    } catch {
      window.alert("Xoá cán bộ điều phối thất bại. Vui lòng thử lại.");
    } finally {
      setPendingStaffDelete(null);
    }
  };

  const handleDeleteStaffLink = (item: StaffCoordinateCommentItem) => {
    setPendingStaffDelete(item);
  };

  const handleOpenAddStaffDialog = () => {
    setEditingStaffLink(null);
    setIsAddStaffDialogOpen(true);
  };

  const executeAddStaff = async (pending: {
    staffId: string;
    approval: boolean;
    editingItem: StaffCoordinateCommentItem | null;
    categoryId: number;
    categoryName: string;
  }) => {
    const staff = staffById.get(Number(pending.staffId));
    if (!staff) return;

    try {
      if (pending.editingItem) {
        await editMutation.mutateAsync({
          id: pending.editingItem.id,
          staff_item: staff.id,
          staff_name: staff.name,
          approval: pending.approval ? 1 : 0,
          comments_category_item: pending.categoryId,
          comments_category_name: pending.categoryName,
        });
      } else {
        await createMutation.mutateAsync({
          id: 0,
          staff_item: staff.id,
          staff_name: staff.name,
          approval: pending.approval ? 1 : 0,
          comments_category_item: pending.categoryId,
          comments_category_name: pending.categoryName,
        });
      }
      setIsAddStaffDialogOpen(false);
      setEditingStaffLink(null);
      setActiveTab(pending.approval ? "approved" : "pending");
    } catch {
      window.alert("Thêm cán bộ thất bại. Vui lòng thử lại.");
    } finally {
      setPendingStaffSave(null);
    }
  };

  const handleAddStaff = async (values: {
    staffId: string;
    approval: boolean;
  }) => {
    if (!activeCategory || values.staffId === "") return;
    const staff = staffById.get(Number(values.staffId));
    if (!staff) return;
    setPendingStaffSave({
      ...values,
      editingItem: editingStaffLink,
      categoryId: activeCategory.id,
      categoryName: activeCategory.name,
      staffName: staff.name,
    });
  };

  const renderStaffRow = (item: StaffCoordinateCommentItem) => {
    const staff = staffById.get(item.staff_item);
    return (
      <div
        key={item.id}
        className="flex flex-col gap-2 border-t border-border px-4 py-3 first:border-t-0 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-foreground">
            {item.staff_name}
          </span>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {staff?.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> {staff.phone}
              </span>
            )}
            {staff?.potition && (
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" /> {staff.potition}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={isToggling}
            onClick={() => handleOpenEditStaff(item)}
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Sửa
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
            disabled={isToggling}
            onClick={() => handleDeleteStaffLink(item)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xoá
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Điều phối chuyên trách
            </h1>
            <p className="mt-1 text-muted-foreground">
              Chọn một điều phối chuyên trách để xem và điều phối cán bộ xử lý
              tương ứng.
            </p>
          </div>
          <Button
            onClick={() => navigate("/categories/new?type=feedback")}
            className="gap-2 self-start"
          >
            <Plus className="h-4 w-4" />
            Thêm điều phối
          </Button>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,7fr)]">
          <Card className="h-fit order-first">
            <CardHeader className="border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Waypoints className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">
                  Danh mục phản ánh kiến nghị
                </CardTitle>
              </div>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm danh mục..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div ref={categoryScrollRef} className="max-h-[620px] space-y-2 overflow-y-auto">
                {categoriesQuery.isLoading && (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                )}
                {!categoriesQuery.isLoading && filteredCategories.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Không tìm thấy danh mục nào.
                  </p>
                )}
                {filteredCategories.map((category) => {
                  const isSelected = category.id === activeCategoryId;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleSelectCategory(category.id)}
                      className={[
                        "w-full rounded-lg border px-3 py-3 text-left text-sm transition-colors",
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-transparent hover:border-border hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <span className="font-medium">{category.name}</span>
                    </button>
                  );
                })}
                <div ref={categoryLoadMoreRef} className="flex min-h-10 items-center justify-center">
                  {categoriesQuery.isFetchingNextPage && <Spinner className="h-4 w-4" />}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="order-last space-y-5">
            <Card>
              <CardHeader className="flex flex-col gap-3 border-b border-border sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Danh sách cán bộ điều phối
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Mỗi nhóm có thể mở ra để xem cán bộ được gán, kèm số điện
                    thoại, chức vụ và thao tác phê duyệt nhanh.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={handleOpenAddStaffDialog}
                  disabled={!activeCategory}
                  className="gap-2 self-start"
                >
                  <Plus className="h-4 w-4" /> Thêm cán bộ
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {!activeCategory && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Chọn một điều phối ở bên phải để xem cán bộ phụ trách.
                  </p>
                )}
                {activeCategory && isLoadingRows && (
                  <div className="flex justify-center py-8">
                    <Spinner />
                  </div>
                )}
                {activeCategory && !isLoadingRows && (
                  <Tabs
                    value={activeTab}
                    onValueChange={(value) => setActiveTab(value as "approved" | "pending")}
                  >
                    <TabsList className="w-full">
                      <TabsTrigger value="approved" className="flex-1">
                        Quyền phê duyệt ({approvedRows.length})
                      </TabsTrigger>
                      <TabsTrigger value="pending" className="flex-1">
                        Quyền xem ({pendingRows.length})
                      </TabsTrigger>
                    </TabsList>
                    <div className="mt-3 overflow-hidden rounded-lg border border-border">
                      {activeTab === "approved" ? (
                        approvedRows.length === 0 ? (
                          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                            Chưa có cán bộ nào được quyền phê duyệt.
                          </p>
                        ) : (
                          approvedRows.map(renderStaffRow)
                        )
                      ) : pendingRows.length === 0 ? (
                        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                          Chưa có cán bộ được quyền xem.
                        </p>
                      ) : (
                        pendingRows.map(renderStaffRow)
                      )}
                    </div>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      <RoutingStaffDialog
        open={isAddStaffDialogOpen}
        onOpenChange={(open) => {
          setIsAddStaffDialogOpen(open);
          if (!open) {
            setEditingStaffLink(null);
          }
        }}
        categoryName={activeCategory?.name ?? ""}
        staffOptions={assignableStaff}
        isSaving={createMutation.isPending || editMutation.isPending}
        mode={editingStaffLink ? "edit" : "create"}
        editingItem={editingStaffLink}
        onSubmit={handleAddStaff}
      />

      <Dialog
        open={pendingStaffSave !== null}
        onOpenChange={(open) => {
          if (!open && !isToggling) setPendingStaffSave(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {pendingStaffSave?.editingItem
              ? "Xác nhận cập nhật phân công?"
              : "Xác nhận thêm cán bộ?"}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {pendingStaffSave?.editingItem
            ? `Bạn có chắc muốn cập nhật quyền của cán bộ "${pendingStaffSave?.staffName ?? ""}" không?`
            : `Bạn có chắc muốn thêm cán bộ "${pendingStaffSave?.staffName ?? ""}" vào điều phối này không?`}
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setPendingStaffSave(null)}
            disabled={isToggling}
          >
            Hủy
          </Button>
          <Button
            onClick={async () => {
              if (!pendingStaffSave) return;
              await executeAddStaff(pendingStaffSave);
            }}
            disabled={isToggling}
          >
            {isToggling ? "Đang lưu..." : "Xác nhận lưu"}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={pendingStaffDelete !== null}
        onOpenChange={(open) => {
          if (!open && !removeMutation.isPending) setPendingStaffDelete(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>Xác nhận xóa phân công?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn xóa cán bộ "{pendingStaffDelete?.staff_name ?? ""}"
          khỏi điều phối này không?
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setPendingStaffDelete(null)}
            disabled={removeMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              if (!pendingStaffDelete) return;
              await executeDeleteStaffLink(pendingStaffDelete);
            }}
            disabled={removeMutation.isPending}
          >
            {removeMutation.isPending ? "Đang xóa..." : "Xác nhận xóa"}
          </Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
}
