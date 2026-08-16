import React, { useEffect, useMemo, useRef, useState } from "react";
import { Layout } from "../shared/components/Layout";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "../shared/components/ui";
import { getStaff } from "./staff/store";
import {
  statusBadgeVariant,
  statusLabel,
  type StaffRecord,
} from "./staff/types";
import {
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Check,
  Edit2,
  Eye,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import {
  useCreateDepartmentProcessMutation,
  useDepartmentsQuery,
  useEditDepartmentProcessMutation,
  useRemoveDepartmentProcessMutation,
} from "@/features/department/hooks/department.hook";
import type { DepartmentItem } from "@/features/department/types/get-departments.response";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { getDepartmentSubs } from "@/features/department/api/department.api";
import type { GetDepartmentsResponse } from "@/features/department/types/get-departments.response";
import { QUERY_KEY } from "@/shared/api";

type DepartmentStatus = "active" | "inactive";

type DepartmentRecord = {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
  description: string;
  order: number;
  manager: string;
  status: DepartmentStatus;
};

type DepartmentFormState = {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
  description: string;
  order: number;
  manager: string;
  status: DepartmentStatus;
};

type StaffDetailState = StaffRecord | null;

const PAGE_TITLE = "Phòng ban";

const buildFormState = (
  department?: DepartmentRecord | null,
): DepartmentFormState => ({
  id: department?.id ?? "",
  name: department?.name ?? "",
  code: department?.code ?? "",
  parentId: department?.parentId ?? null,
  description: department?.description ?? "",
  order: department?.order ?? 0,
  manager: department?.manager ?? "",
  status: department?.status ?? "active",
});

const isSameText = (value: string, query: string) =>
  value.toLowerCase().includes(query.toLowerCase());

function departmentItemToRecord(
  item: DepartmentItem,
  parentId: string | null,
  order: number,
): DepartmentRecord {
  return {
    id: String(item.id),
    name: item.name,
    code: "",
    parentId,
    description: item.note ?? "",
    order,
    manager: item.staff_name ?? "",
    status: "active",
  };
}

/**
 * The department API only exposes two levels: root departments and, for a
 * given id, its direct subs. There is no "get whole tree" endpoint, so this
 * fetches the root list then fetches subs for every root in parallel and
 * flattens the result into the same shape the UI already works with.
 */
function useDepartmentTree() {
  const { data: rootData, isLoading: isRootLoading } = useDepartmentsQuery();
  const roots = rootData?.content ?? [];

  const subQueries = useQueries({
    queries: roots.map((root) => ({
      queryKey: QUERY_KEY.DEPARTMENTS_SUB(root.id),
      queryFn: () => getDepartmentSubs(root.id),
      enabled: root.total_department_sub > 0,
    })),
  });

  const isLoading =
    isRootLoading || subQueries.some((query) => query.isLoading);

  const records = useMemo(() => {
    const list: DepartmentRecord[] = roots.map((root, index) =>
      departmentItemToRecord(root, null, index + 1),
    );

    roots.forEach((root, index) => {
      const subs = subQueries[index]?.data?.content ?? [];
      subs.forEach((sub, subIndex) => {
        list.push(departmentItemToRecord(sub, String(root.id), subIndex + 1));
      });
    });

    return list;
  }, [roots, subQueries]);

  return { records, isLoading };
}

export default function Departments() {
  const queryClient = useQueryClient();
  const { records: departmentsFromApi, isLoading: isDepartmentsLoading } =
    useDepartmentTree();
  const createDepartmentMutation = useCreateDepartmentProcessMutation();
  const editDepartmentMutation = useEditDepartmentProcessMutation();
  const removeDepartmentMutation = useRemoveDepartmentProcessMutation();

  const [staffList, setStaffList] = useState<StaffRecord[]>(() => getStaff());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] =
    useState<DepartmentFormState>(buildFormState(null));
  const [currentStaff, setCurrentStaff] = useState<StaffDetailState>(null);
  const [isManagerPickerOpen, setIsManagerPickerOpen] = useState(false);

  const [departments, setDepartments] = useState<DepartmentRecord[]>([]);
  const hasSeededDepartments = useRef(false);

  useEffect(() => {
    if (!hasSeededDepartments.current && !isDepartmentsLoading) {
      setDepartments(departmentsFromApi);
      hasSeededDepartments.current = true;
      setSelectedDepartmentId(
        departmentsFromApi.find((item) => item.parentId === null)?.id ??
          departmentsFromApi[0]?.id ??
          "",
      );
    }
  }, [departmentsFromApi, isDepartmentsLoading]);

  const isSaving =
    createDepartmentMutation.isPending || editDepartmentMutation.isPending;

  const departmentsById = useMemo(
    () =>
      new Map(
        departments.map((department) => [department.id, department] as const),
      ),
    [departments],
  );

  const childrenByParentId = useMemo(() => {
    const map = new Map<string, DepartmentRecord[]>();
    departments.forEach((department) => {
      const key = department.parentId ?? "__root__";
      const items = map.get(key) ?? [];
      items.push(department);
      map.set(key, items);
    });

    map.forEach((items, key) => {
      items.sort(
        (left, right) =>
          left.order - right.order || left.name.localeCompare(right.name),
      );
      map.set(key, items);
    });

    return map;
  }, [departments]);

  const staffDepartmentNames = useMemo(() => {
    if (!selectedDepartmentId) return new Set<string>();

    const stack = [selectedDepartmentId];
    const names = new Set<string>();

    while (stack.length > 0) {
      const currentId = stack.pop();
      if (!currentId) continue;
      const current = departmentsById.get(currentId);
      if (!current) continue;
      names.add(current.name);

      const children = childrenByParentId.get(currentId) ?? [];
      children.forEach((child) => stack.push(child.id));
    }

    return names;
  }, [childrenByParentId, departmentsById, selectedDepartmentId]);

  const selectedDepartment = selectedDepartmentId
    ? (departmentsById.get(selectedDepartmentId) ?? null)
    : null;

  const rootDepartments = childrenByParentId.get("__root__") ?? [];

  const filteredTree = useMemo(() => {
    if (!searchTerm.trim()) return rootDepartments;

    const query = searchTerm.trim().toLowerCase();

    const matchesNode = (department: DepartmentRecord): boolean => {
      if (
        isSameText(department.name, query) ||
        isSameText(department.code, query) ||
        isSameText(department.manager, query)
      ) {
        return true;
      }

      return (childrenByParentId.get(department.id) ?? []).some(matchesNode);
    };

    return rootDepartments.filter(matchesNode);
  }, [childrenByParentId, rootDepartments, searchTerm]);

  const visibleStaff = useMemo(() => {
    if (!selectedDepartment) return [];

    return staffList.filter((staff) =>
      staffDepartmentNames.has(staff.department),
    );
  }, [selectedDepartment, staffDepartmentNames, staffList]);

  const selectedDepartmentStaffCount = visibleStaff.length;
  const selectedDepartmentChildren = selectedDepartment
    ? (childrenByParentId.get(selectedDepartment.id) ?? [])
    : [];
  const parentDepartment = selectedDepartment?.parentId
    ? (departmentsById.get(selectedDepartment.parentId) ?? null)
    : null;

  const openCreateDialog = (parentId: string | null = selectedDepartmentId) => {
    setCurrentDepartment(
      buildFormState({
        id: "",
        name: "",
        code: "",
        parentId,
        description: "",
        order: departments.length + 1,
        manager: "",
        status: "active",
      }),
    );
    setIsDialogOpen(true);
  };

  const openEditDialog = (department: DepartmentRecord) => {
    setCurrentDepartment(buildFormState(department));
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const name = (currentDepartment.name ?? "").trim();
    if (!name) return;
    const desc = currentDepartment.description ?? "";

    try {
      if (currentDepartment.id) {
        await editDepartmentMutation.mutateAsync({
          item: Number(currentDepartment.id),
          name,
          note: desc,
        });
        const nextDepartment: DepartmentRecord = {
          ...currentDepartment,
          id: currentDepartment.id,
          order: Number.isNaN(Number(currentDepartment.order))
            ? 0
            : Number(currentDepartment.order),
          name,
          description: desc,
        };
        setDepartments((current) =>
          current.map((d) => (d.id === nextDepartment.id ? nextDepartment : d)),
        );
      } else {
        await createDepartmentMutation.mutateAsync({ name, note: desc });

        // The create response doesn't reliably carry the new id, so find it
        // by diffing the freshly-invalidated root list against what we had.
        const refreshed = queryClient.getQueryData<GetDepartmentsResponse>(
          QUERY_KEY.DEPARTMENTS,
        );
        const existingIds = new Set(
          departments.filter((d) => d.parentId === null).map((d) => d.id),
        );
        const created = refreshed?.content.find(
          (department) => !existingIds.has(String(department.id)),
        );

        const nextDepartment: DepartmentRecord = {
          ...currentDepartment,
          id: created ? String(created.id) : `local-${Date.now()}`,
          parentId: null,
          order: Number.isNaN(Number(currentDepartment.order))
            ? 0
            : Number(currentDepartment.order),
          name,
          description: desc,
        };
        setDepartments((current) => {
          const next = [...current, nextDepartment];
          return next.sort(
            (left, right) =>
              left.order - right.order || left.name.localeCompare(right.name),
          );
        });
        if (!selectedDepartmentId) {
          setSelectedDepartmentId(nextDepartment.id);
        }
      }
      setIsDialogOpen(false);
    } catch {
      window.alert("Lưu phòng ban thất bại. Vui lòng thử lại.");
    }
  };

  const collectDescendantIds = (departmentId: string): string[] => {
    const stack = [departmentId];
    const ids = new Set<string>();

    while (stack.length > 0) {
      const currentId = stack.pop();
      if (!currentId) continue;
      ids.add(currentId);

      const children = childrenByParentId.get(currentId) ?? [];
      children.forEach((child) => stack.push(child.id));
    }

    return Array.from(ids);
  };

  const handleDeleteDepartment = async (department: DepartmentRecord) => {
    if (!window.confirm(`Xóa phòng ban "${department.name}"?`)) return;

    try {
      await removeDepartmentMutation.mutateAsync({ item: Number(department.id) });

      const idsToRemove = new Set(collectDescendantIds(department.id));
      const nextDepartments = departments.filter(
        (item) => !idsToRemove.has(item.id),
      );
      setDepartments(nextDepartments);

      if (idsToRemove.has(selectedDepartmentId)) {
        const fallback =
          nextDepartments.find((item) => item.parentId === null) ??
          nextDepartments[0] ??
          null;
        setSelectedDepartmentId(fallback?.id ?? "");
      }
    } catch {
      window.alert("Xóa phòng ban thất bại. Vui lòng thử lại.");
    }
  };

  const handleSelectDepartment = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
  };

  const renderDepartmentTree = (items: DepartmentRecord[], depth = 0) => {
    return items.map((department) => {
      const childItems = childrenByParentId.get(department.id) ?? [];
      const isSelected = department.id === selectedDepartmentId;
      const hasChildren = childItems.length > 0;
      const staffCount = staffList.filter((staff) => {
        if (!selectedDepartmentId) return false;
        return collectDescendantIds(department.id)
          .map((id) => departmentsById.get(id)?.name)
          .filter(Boolean)
          .includes(staff.department);
      }).length;

      return (
        <div key={department.id} className="space-y-1">
          <button
            type="button"
            onClick={() => handleSelectDepartment(department.id)}
            className={[
              "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
              isSelected
                ? "border-primary bg-primary/5 text-primary"
                : "border-transparent bg-transparent hover:border-border hover:bg-slate-50",
            ].join(" ")}
            style={{ paddingLeft: `${12 + depth * 18}px` }}
          >
            <span className="text-muted-foreground">
              {hasChildren ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </span>
            <span className="min-w-0 flex-1 truncate font-medium">
              {department.name}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-muted-foreground">
              {staffCount}
            </span>
          </button>

          {hasChildren && (
            <div className="space-y-1">
              {renderDepartmentTree(childItems, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const handleOpenStaffDetail = (staff: StaffRecord) => {
    setCurrentStaff(staff);
  };

  const departmentScopeLabel = selectedDepartment
    ? `${selectedDepartment.name} và ${Math.max(selectedDepartmentChildren.length, 0)} phòng ban con`
    : "Chưa chọn phòng ban";

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{PAGE_TITLE}</h1>
            <p className="mt-1 text-muted-foreground">
              Quản lý cơ cấu phòng ban theo dạng cây, xem chi tiết và danh sách
              nhân sự theo từng nhánh.
            </p>
          </div>
          <Button
            onClick={() => openCreateDialog(null)}
            className="gap-2 self-start"
          >
            <Plus className="h-4 w-4" />
            Thêm phòng ban
          </Button>
        </div>

        <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Card className="h-fit">
            <CardHeader className="border-b border-border pb-3">
              <div>
                <CardTitle className="text-lg">Cơ cấu phòng ban</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Chọn một phòng ban để xem chi tiết ở bên phải.
                </p>
              </div>
              <div className="relative mt-3">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, mã hoặc trưởng bộ phận..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-4">
              {filteredTree.length > 0 ? (
                renderDepartmentTree(filteredTree)
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Không tìm thấy phòng ban nào.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card>
              <CardHeader className="border-b border-border">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Thông tin phòng ban
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedDepartment?.name ?? "Chưa chọn phòng ban"}
                    </p>
                  </div>
                  {selectedDepartment && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openCreateDialog(selectedDepartment.id)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm con
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          selectedDepartment &&
                          openEditDialog(selectedDepartment)
                        }
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          selectedDepartment &&
                          handleDeleteDepartment(selectedDepartment)
                        }
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {selectedDepartment ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border bg-white p-4">
                      <div className="space-y-3 text-sm">
                        <InfoRow
                          label="Tên phòng ban"
                          value={selectedDepartment.name}
                        />
                        <InfoRow
                          label="Mã phòng ban"
                          value={selectedDepartment.code}
                        />
                        <InfoRow
                          label="Phòng ban cha"
                          value={
                            parentDepartment?.name ?? "Phòng ban cấp cao nhất"
                          }
                        />
                        <InfoRow
                          label="Trưởng bộ phận"
                          value={selectedDepartment.manager}
                        />
                      </div>
                    </div>

                    <div className="rounded-xl border bg-white p-4">
                      <div className="space-y-3 text-sm">
                        <InfoRow
                          label="Thứ tự hiển thị"
                          value={selectedDepartment.order}
                        />
                        <InfoRow
                          label="Trạng thái"
                          value={
                            selectedDepartment.status === "active"
                              ? "Hoạt động"
                              : "Tạm khóa"
                          }
                        />
                        <InfoRow
                          label="Nhân sự"
                          value={selectedDepartmentStaffCount}
                        />
                        <InfoRow
                          label="Phòng ban con"
                          value={selectedDepartmentChildren.length}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 rounded-xl border bg-slate-50 p-4">
                      <p className="text-sm font-medium text-foreground">
                        Mô tả
                      </p>
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                        {selectedDepartment.description || "Chưa có mô tả."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Chọn một phòng ban ở bên trái để xem thông tin.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b border-border">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-lg">Danh sách nhân sự</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {departmentScopeLabel}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Chức vụ</TableHead>
                      <TableHead>Điện thoại</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleStaff.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium">
                          {staff.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {staff.position || "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {staff.phone || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusBadgeVariant(staff.status)}>
                            {statusLabel(staff.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Xem chi tiết"
                            onClick={() => handleOpenStaffDetail(staff)}
                          >
                            <Eye className="h-4 w-4 text-slate-700" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {visibleStaff.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-24 text-center text-muted-foreground"
                        >
                          Không có nhân sự trong phòng ban này.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        className="max-w-2xl"
      >
        <div className="space-y-5">
          <DialogHeader>
            <DialogTitle>
              {currentDepartment.id
                ? "Chỉnh sửa phòng ban"
                : "Thêm phòng ban mới"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Thiết lập phòng ban cha, tên và mã trong cây tổ chức.
            </p>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="department-parent">Phòng ban cha</Label>
              <Select
                id="department-parent"
                value={currentDepartment.parentId ?? ""}
                onChange={(event) =>
                  setCurrentDepartment((current) => ({
                    ...current,
                    parentId: event.target.value || null,
                  }))
                }
              >
                <option value="">Chọn...</option>
                {departments
                  .filter(
                    (department) => department.id !== currentDepartment.id,
                  )
                  .map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
              </Select>
              <p className="text-xs text-muted-foreground">
                Để trống nếu là phòng ban cấp cao nhất.
              </p>
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="department-name">
                Tên phòng ban <span className="text-red-500">*</span>
              </Label>
              <Input
                id="department-name"
                value={currentDepartment.name}
                onChange={(event) =>
                  setCurrentDepartment((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Phòng Công nghệ thông tin"
              />
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="department-code">Mã (tùy chọn)</Label>
              <Input
                id="department-code"
                value={currentDepartment.code}
                onChange={(event) =>
                  setCurrentDepartment((current) => ({
                    ...current,
                    code: event.target.value,
                  }))
                }
                placeholder="IT"
              />
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="department-manager">Trưởng bộ phận</Label>
              <Popover
                open={isManagerPickerOpen}
                onOpenChange={setIsManagerPickerOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    id="department-manager"
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={isManagerPickerOpen}
                    className="w-full justify-between font-normal"
                  >
                    <span className="truncate">
                      {currentDepartment.manager || "Chọn trưởng bộ phận..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] bg-white p-0">
                  <Command>
                    <CommandInput placeholder="Tìm nhân sự..." />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy nhân sự.</CommandEmpty>
                      <CommandGroup>
                        {staffList.map((staff) => (
                          <CommandItem
                            key={staff.id}
                            value={staff.name}
                            onSelect={() => {
                              setCurrentDepartment((current) => ({
                                ...current,
                                manager: staff.name,
                              }));
                              setIsManagerPickerOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                currentDepartment.manager === staff.name
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {staff.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="department-description">Mô tả</Label>
              <Textarea
                id="department-description"
                value={currentDepartment.description}
                onChange={(event) =>
                  setCurrentDepartment((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Mô tả phạm vi, chức năng của phòng ban..."
              />
            </div>

          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </div>
      </Dialog>

      <Dialog
        open={!!currentStaff}
        onOpenChange={(open) => !open && setCurrentStaff(null)}
        className="max-w-2xl"
      >
        {currentStaff && (
          <div className="space-y-5">
            <DialogHeader>
              <DialogTitle>{currentStaff.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Thông tin chi tiết nhân sự thuộc phòng ban đã chọn.
              </p>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Họ và tên" value={currentStaff.name} />
              <InfoRow label="Tài khoản" value={currentStaff.username} />
              <InfoRow label="Phòng ban" value={currentStaff.department} />
              <InfoRow label="Chức vụ" value={currentStaff.position || "-"} />
              <InfoRow label="Email" value={currentStaff.email || "-"} />
              <InfoRow label="Điện thoại" value={currentStaff.phone || "-"} />
              <div className="md:col-span-2">
                <InfoRow
                  label="Trạng thái"
                  value={
                    currentStaff.status === "active" ? "Hoạt động" : "Tạm khóa"
                  }
                />
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

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="min-w-36 text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground">{value || "-"}</span>
    </div>
  );
}
