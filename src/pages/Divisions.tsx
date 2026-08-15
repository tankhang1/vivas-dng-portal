import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "../shared/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Label,
  Badge,
  Select,
  cn,
} from "../shared/components/ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../shared/components/ui/accordion";
import { feedbackCategories, mockStaff } from "../shared/data/mock";
import {
  useCreateDivisionProcessMutation,
  useDivisionsQuery,
  useEditDivisionProcessMutation,
  useRemoveDivisionProcessMutation,
} from "@/features/division/hooks/division.hook";
import type { GetDivisionsResponse } from "@/features/division/types/get-divisions.response";
import { QUERY_KEY } from "@/shared/api";
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Search,
  Users,
  UserPlus,
  X,
  MessageSquareWarning,
  Eye,
} from "lucide-react";

type ApprovalLevel = 0 | 1 | 2;

const APPROVAL_META: Record<ApprovalLevel, { label: string; badge: string }> = {
  0: { label: "Xem", badge: "bg-slate-100 text-slate-700" },
  1: { label: "Duyệt", badge: "bg-emerald-100 text-emerald-700" },
  2: { label: "Từ chối", badge: "bg-red-100 text-red-700" },
};

type CategoryAssignment = {
  id: string;
  categoryValue: string;
  staffId: string;
  staffName: string;
  approval: ApprovalLevel;
};

type DivisionRecord = {
  id: string;
  name: string;
  desc: string;
  users: number;
  categoryAssignments: CategoryAssignment[];
};

type StaffCard = (typeof mockStaff)[number];

export default function Divisions() {
  const queryClient = useQueryClient();
  const { data: divisionsData, isLoading: isDivisionsLoading } =
    useDivisionsQuery();
  const createDivisionMutation = useCreateDivisionProcessMutation();
  const editDivisionMutation = useEditDivisionProcessMutation();
  const removeDivisionMutation = useRemoveDivisionProcessMutation();
  const isSavingDivision =
    createDivisionMutation.isPending || editDivisionMutation.isPending;
  const [divisions, setDivisions] = useState<DivisionRecord[]>([]);
  const hasSeededDivisions = useRef(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDivision, setCurrentDivision] = useState<any>(null);
  const [currentStaff, setCurrentStaff] = useState<StaffCard | null>(null);

  useEffect(() => {
    if (!hasSeededDivisions.current && divisionsData?.content) {
      setDivisions(
        divisionsData.content.map((division) => ({
          id: String(division.id),
          name: division.name,
          desc: division.note ?? "",
          users: 0,
          categoryAssignments: [],
        })),
      );
      hasSeededDivisions.current = true;
    }
  }, [divisionsData]);

  const filtered = useMemo(
    () =>
      divisions.filter((d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [divisions, searchTerm],
  );

  const selectedDivision =
    divisions.find((d) => d.id === selectedDivisionId) || divisions[0];
  const totalAssignments = selectedDivision?.categoryAssignments.length ?? 0;

  useEffect(() => {
    // Keep a valid selection whenever the visible/filtered list changes.
    if (
      !filtered.some((d) => d.id === selectedDivisionId) &&
      filtered.length > 0
    ) {
      setSelectedDivisionId(filtered[0].id);
    }
  }, [filtered, selectedDivisionId]);

  const handleOpenDialog = (item: any = null) => {
    setCurrentDivision(
      item || {
        id: "",
        name: "",
        desc: "",
        users: 0,
        permissions: [],
        categoryAssignments: [],
      },
    );
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const name = (currentDivision?.name ?? "").trim();
    if (!name) return;
    const desc = currentDivision?.desc ?? "";

    try {
      if (currentDivision.id) {
        await editDivisionMutation.mutateAsync({
          item: Number(currentDivision.id),
          name,
          note: desc,
        });
        setDivisions(
          divisions.map((d) =>
            d.id === currentDivision.id ? { ...d, name, desc } : d,
          ),
        );
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.DIVISIONS });
      } else {
        await createDivisionMutation.mutateAsync({ name, note: desc });
        await queryClient.invalidateQueries({ queryKey: QUERY_KEY.DIVISIONS });
        const refreshed = queryClient.getQueryData<GetDivisionsResponse>(
          QUERY_KEY.DIVISIONS,
        );
        const existingIds = new Set(divisions.map((d) => d.id));
        const created = refreshed?.content.find(
          (division) => !existingIds.has(String(division.id)),
        );
        if (created) {
          const newDivision: DivisionRecord = {
            id: String(created.id),
            name: created.name,
            desc: created.note ?? "",
            users: 0,
            categoryAssignments: [],
          };
          setDivisions([...divisions, newDivision]);
          setSelectedDivisionId(newDivision.id);
        }
      }
      setIsDialogOpen(false);
    } catch {
      window.alert("Lưu lĩnh vực thất bại. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lĩnh vực này?")) return;
    try {
      await removeDivisionMutation.mutateAsync({ item: Number(id) });
      const remaining = divisions.filter((d) => d.id !== id);
      setDivisions(remaining);
      if (selectedDivisionId === id)
        setSelectedDivisionId(remaining[0]?.id ?? "");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.DIVISIONS });
    } catch {
      window.alert("Xóa lĩnh vực thất bại. Vui lòng thử lại.");
    }
  };

  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assignCategoryValue, setAssignCategoryValue] = useState("");
  const [assignStaffId, setAssignStaffId] = useState("");
  const [assignApproval, setAssignApproval] = useState<ApprovalLevel>(0);

  const openAssignDialog = (categoryValue: string) => {
    setAssignCategoryValue(categoryValue);
    setAssignStaffId("");
    setAssignApproval(0);
    setIsAssignDialogOpen(true);
  };

  const handleAssignStaff = () => {
    if (!selectedDivision || !assignStaffId) return;
    const staff = mockStaff.find((s) => s.id === assignStaffId);
    if (!staff) return;

    const assignment: CategoryAssignment = {
      id: `${assignCategoryValue}-${staff.id}-${Date.now()}`,
      categoryValue: assignCategoryValue,
      staffId: staff.id,
      staffName: staff.name,
      approval: assignApproval,
    };
    const updated = {
      ...selectedDivision,
      categoryAssignments: [
        ...selectedDivision.categoryAssignments,
        assignment,
      ],
    };
    setDivisions((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d)),
    );
    setIsAssignDialogOpen(false);
  };

  const handleRemoveAssignment = (assignmentId: string) => {
    if (!selectedDivision) return;
    const updated = {
      ...selectedDivision,
      categoryAssignments: selectedDivision.categoryAssignments.filter(
        (a) => a.id !== assignmentId,
      ),
    };
    setDivisions((prev) =>
      prev.map((d) => (d.id === updated.id ? updated : d)),
    );
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Lĩnh vực chuyên trách
            </h1>
            <p className="text-muted-foreground mt-1">
              Chọn một lĩnh vực chuyên trách để xem và chỉnh sửa quyền hạn tương
              ứng.
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" /> Thêm lĩnh vực
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-[6fr_4fr]">
          <Card>
            {selectedDivision ? (
              <>
                <CardHeader className="space-y-4">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Shield className="h-5 w-5 text-primary" />
                      {selectedDivision.name}
                      <Badge variant="outline">{totalAssignments} cán bộ</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedDivision.desc || "Chưa có mô tả"}
                    </p>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> {selectedDivision.users}{" "}
                      người dùng đang giữ lĩnh vực này
                    </div>
                  </div>
                </CardHeader>

                <CardHeader className="border-t pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <MessageSquareWarning className="h-4 w-4 text-primary" />
                        Danh sách nhóm phản ánh
                      </CardTitle>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Mỗi nhóm phản ánh có thể mở ra để xem staff được gán,
                        kèm số điện thoại, chức vụ và action xử lý nhanh.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-4"
                  >
                    {feedbackCategories.map((category) => {
                      const assignments =
                        selectedDivision.categoryAssignments.filter(
                          (a) => a.categoryValue === category.value,
                        );
                      return (
                        <AccordionItem
                          key={category.value}
                          value={category.value}
                          className="rounded-xl border border-border bg-white px-4 first:mt-0"
                        >
                          <AccordionTrigger className="py-4 hover:no-underline">
                            <div className="flex w-full items-center justify-between gap-3 pr-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">
                                  {category.label}
                                </h3>
                                <Badge variant="outline">
                                  {assignments.length} cán bộ
                                </Badge>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4">
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                              <p className="text-xs text-muted-foreground">
                                Nhấn để xem danh sách staff đang phụ trách nhóm
                                này.
                              </p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => openAssignDialog(category.value)}
                              >
                                <UserPlus className="h-4 w-4" />
                                Thêm cán bộ
                              </Button>
                            </div>

                            {assignments.length > 0 ? (
                              <div className="grid gap-3">
                                {assignments.map((assignment) => {
                                  const staff = mockStaff.find(
                                    (item) => item.id === assignment.staffId,
                                  );

                                  return (
                                    <div
                                      key={assignment.id}
                                      className="flex flex-col gap-3 rounded-xl border bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
                                    >
                                      <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <p className="font-semibold text-foreground">
                                            {staff?.name ??
                                              assignment.staffName}
                                          </p>
                                          <Badge variant="outline">
                                            {
                                              APPROVAL_META[assignment.approval]
                                                .label
                                            }
                                          </Badge>
                                        </div>
                                        <div className="mt-2 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                                          <p>
                                            <span className="font-medium text-foreground">
                                              SĐT:
                                            </span>{" "}
                                            {staff?.phone || "-"}
                                          </p>
                                          <p>
                                            <span className="font-medium text-foreground">
                                              Chức vụ:
                                            </span>{" "}
                                            {staff?.role || "-"}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 self-start md:self-center">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="gap-2"
                                          onClick={() =>
                                            staff && setCurrentStaff(staff)
                                          }
                                          disabled={!staff}
                                          title="Xem"
                                        >
                                          <Eye className="h-4 w-4" />
                                          Xem
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-9 w-9 text-red-600 hover:text-red-700"
                                          onClick={() =>
                                            handleRemoveAssignment(
                                              assignment.id,
                                            )
                                          }
                                          title="Xóa"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="rounded-xl border border-dashed border-border bg-slate-50 px-4 py-6 text-sm text-muted-foreground">
                                Chưa có cán bộ nào được gán cho nhóm này.
                              </p>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </CardContent>
              </>
            ) : (
              <CardContent className="py-16 text-center text-muted-foreground">
                Chọn một lĩnh vực ở danh sách bên phải để xem chi tiết.
              </CardContent>
            )}
          </Card>

          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Danh sách lĩnh vực chuyên trách
              </CardTitle>
              <div className="relative pt-2">
                <Search className="absolute left-2.5 top-5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm lĩnh vực..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex max-h-[420px] flex-col overflow-y-auto">
                {filtered.map((item) => {
                  const isSelected = item.id === selectedDivision?.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedDivisionId(item.id)}
                      className={cn(
                        "flex items-center justify-between p-4 border-b last:border-0 cursor-pointer transition-colors",
                        isSelected
                          ? "bg-primary/10 border-l-4 border-l-primary"
                          : "hover:bg-slate-50 border-l-4 border-l-transparent",
                      )}
                    >
                      <div>
                        <p
                          className={cn(
                            "font-medium",
                            isSelected && "text-primary",
                          )}
                        >
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.users} người dùng
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDialog(item);
                          }}
                        >
                          <Edit2 className="h-3 w-3 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {filtered.length === 0 && (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    {isDivisionsLoading
                      ? "Đang tải danh sách lĩnh vực..."
                      : "Không tìm thấy lĩnh vực nào."}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle>
            {currentDivision?.id ? "Chỉnh sửa lĩnh vực" : "Thêm lĩnh vực mới"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Tên lĩnh vực</Label>
            <Input
              value={currentDivision?.name || ""}
              onChange={(e) =>
                setCurrentDivision({
                  ...currentDivision,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Mô tả</Label>
            <Input
              value={currentDivision?.desc || ""}
              onChange={(e) =>
                setCurrentDivision({
                  ...currentDivision,
                  desc: e.target.value,
                })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={isSavingDivision}>
            {isSavingDivision ? "Đang lưu..." : "Lưu thông tin"}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogHeader>
          <DialogTitle>Thêm cán bộ vào nhóm phản ánh</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Nhóm phản ánh</Label>
            <Input
              disabled
              value={
                feedbackCategories.find((c) => c.value === assignCategoryValue)
                  ?.label ?? ""
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Cán bộ</Label>
            <Select
              value={assignStaffId}
              onChange={(e) => setAssignStaffId(e.target.value)}
            >
              <option value="">Chọn cán bộ...</option>
              {mockStaff.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name} — {staff.department}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Quyền xử lý</Label>
            <Select
              value={String(assignApproval)}
              onChange={(e) =>
                setAssignApproval(Number(e.target.value) as ApprovalLevel)
              }
            >
              <option value="0">Xem</option>
              <option value="1">Duyệt</option>
              <option value="2">Từ chối</option>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsAssignDialogOpen(false)}
          >
            Hủy
          </Button>
          <Button onClick={handleAssignStaff} disabled={!assignStaffId}>
            Thêm cán bộ
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={!!currentStaff}
        onOpenChange={(open) => !open && setCurrentStaff(null)}
        className="max-w-lg"
      >
        {currentStaff && (
          <div className="space-y-5">
            <DialogHeader>
              <DialogTitle>{currentStaff.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Thông tin nhanh của cán bộ đang được gán trong nhóm phản ánh.
              </p>
            </DialogHeader>

            <div className="grid gap-3 rounded-xl border bg-slate-50 p-4 text-sm">
              <div className="flex items-start justify-between gap-4">
                <span className="text-muted-foreground">Số điện thoại</span>
                <span className="font-medium text-foreground">
                  {currentStaff.phone || "-"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-muted-foreground">Chức vụ</span>
                <span className="font-medium text-foreground">
                  {currentStaff.role || "-"}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-muted-foreground">Phòng ban</span>
                <span className="font-medium text-foreground">
                  {currentStaff.department || "-"}
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCurrentStaff(null)}>
                Đóng
              </Button>
            </DialogFooter>
          </div>
        )}
      </Dialog>
    </Layout>
  );
}
