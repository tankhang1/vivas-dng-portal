import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useQueries } from "@tanstack/react-query";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
  useCommentCategoriesQuery,
} from "@/features/category-comment/hooks/category-comment.hook";
import {
  useSearchStaffQuery,
  useStaffCoordinateCommentsByCategoryApproveQuery,
  useStaffCoordinateCommentsByCategoryNoneApproveQuery,
  useCreateStaffCoordinateCommentProcessMutation,
  useEditStaffCoordinateCommentProcessMutation,
  useRemoveStaffCoordinateCommentProcessMutation,
} from "@/features/staff/hooks/staff.hook";
import { getStaffCoordinateCommentsByCategoryApprove } from "@/features/staff/api/staff.api";
import { QUERY_KEY } from "@/shared/api";
import type { StaffCoordinateCommentItem } from "@/features/staff/types/get-staff-coordinate-comment.response";
import { RoutingStaffDialog } from "./components/RoutingStaffDialog";
import {
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  Edit2,
  Phone,
  Plus,
  Search,
  Shield,
  Trash2,
  Users,
  Waypoints,
} from "lucide-react";

const CATEGORY_LIST_SIZE = 100;
const STAFF_LIST_SIZE = 200;

export default function RoutingPage() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | "">("");
  const [expandedGroup, setExpandedGroup] = useState<
    "approved" | "pending" | null
  >("approved");
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

  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCommentCategoriesQuery({ sz: CATEGORY_LIST_SIZE, nu: 0 });
  const categories = categoriesData?.content ?? [];

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const query = searchTerm.trim().toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(query));
  }, [categories, searchTerm]);

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

  const countQueries = useQueries({
    queries: categories.map((category) => ({
      queryKey: QUERY_KEY.STAFF_COORDINATE_COMMENTS_CATEGORY_APPROVE(
        category.id,
        { sz: 200, nu: 0 },
      ),
      queryFn: () =>
        getStaffCoordinateCommentsByCategoryApprove({
          categoryId: category.id,
          sz: 200,
          nu: 0,
        }),
    })),
  });

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
      setExpandedGroup(pending.approval ? "approved" : "pending");
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

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b border-border">
                {activeCategory ? (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <CardTitle className="text-lg">
                            {activeCategory.name}
                          </CardTitle>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {activeCategory.note || "Chưa có mô tả."}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <CardTitle className="text-lg">Chưa chọn điều phối</CardTitle>
                )}
              </CardHeader>
              {activeCategory && (
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {approveQuery.data?.page.totalElements ?? 0} người dùng đang
                    giữ điều phối này
                  </div>
                </CardContent>
              )}
            </Card>

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
                  <>
                    <Collapsible
                      open={expandedGroup === "approved"}
                      onOpenChange={(open) =>
                        setExpandedGroup(open ? "approved" : null)
                      }
                      className="overflow-hidden rounded-lg border border-border"
                    >
                      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-slate-50">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          Được quyền phê duyệt
                          <Badge variant="warning">
                            {approvedRows.length} cán bộ
                          </Badge>
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${expandedGroup === "approved" ? "rotate-180" : ""}`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        {approvedRows.length === 0 ? (
                          <p className="border-t border-border px-4 py-6 text-center text-sm text-muted-foreground">
                            Chưa có cán bộ nào được quyền phê duyệt.
                          </p>
                        ) : (
                          approvedRows.map(renderStaffRow)
                        )}
                      </CollapsibleContent>
                    </Collapsible>

                    <Collapsible
                      open={expandedGroup === "pending"}
                      onOpenChange={(open) =>
                        setExpandedGroup(open ? "pending" : null)
                      }
                      className="overflow-hidden rounded-lg border border-border"
                    >
                      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-slate-50">
                        <span className="flex items-center gap-2">
                          <CircleDashed className="h-4 w-4 text-muted-foreground" />
                          Quyền xử lý
                          <Badge variant="outline">
                            {pendingRows.length} cán bộ
                          </Badge>
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${expandedGroup === "pending" ? "rotate-180" : ""}`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        {pendingRows.length === 0 ? (
                          <p className="border-t border-border px-4 py-6 text-center text-sm text-muted-foreground">
                            Không có cán bộ được quyền xử lý.
                          </p>
                        ) : (
                          pendingRows.map(renderStaffRow)
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="h-fit">
            <CardHeader className="border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Waypoints className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">
                  Danh sách điều phối chuyên trách
                </CardTitle>
              </div>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm điều phối..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-4">
              {isCategoriesLoading && (
                <div className="flex justify-center py-8">
                  <Spinner />
                </div>
              )}
              {!isCategoriesLoading && filteredCategories.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Không tìm thấy điều phối nào.
                </p>
              )}
              {filteredCategories.map((category) => {
                const isSelected = category.id === activeCategoryId;
                return (
                  <div
                    key={category.id}
                    onClick={() => handleSelectCategory(category.id)}
                    className={[
                      "flex cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:border-border hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <div className="min-w-0 flex-1">
                      <p
                        className={[
                          "truncate font-medium",
                          isSelected ? "text-primary" : "text-foreground",
                        ].join(" ")}
                      >
                        {category.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
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
