import React, { useMemo, useState } from "react";
import { Layout } from "../components/Layout";
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
} from "../components/ui";
import { getStaff } from "./staff/store";
import {
  statusBadgeVariant,
  statusLabel,
  type StaffRecord,
} from "./staff/types";
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  Eye,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

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

const initialDepartments: DepartmentRecord[] = [
  {
    id: "dept-1",
    name: "Văn phòng UBND",
    code: "VPUBND",
    parentId: null,
    description:
      "Đầu mối tham mưu, tổng hợp và điều phối công việc chung của xã.",
    order: 1,
    manager: "Nguyễn Văn A",
    status: "active",
  },
  {
    id: "dept-2",
    name: "Tư pháp",
    code: "TP",
    parentId: "dept-1",
    description: "Hộ tịch, chứng thực, tiếp nhận và xử lý thủ tục pháp lý.",
    order: 2,
    manager: "Trần Thị B",
    status: "active",
  },
  {
    id: "dept-3",
    name: "Tài chính - Kế toán",
    code: "TCKT",
    parentId: "dept-1",
    description:
      "Theo dõi ngân sách, thanh toán, quyết toán và báo cáo tài chính.",
    order: 3,
    manager: "Đặng Văn G",
    status: "active",
  },
  {
    id: "dept-4",
    name: "Địa chính",
    code: "DC",
    parentId: null,
    description: "Quản lý đất đai, xây dựng, hạ tầng và hồ sơ địa giới.",
    order: 4,
    manager: "Lê Văn C",
    status: "active",
  },
  {
    id: "dept-5",
    name: "Văn hóa - Xã hội",
    code: "VHXH",
    parentId: "dept-4",
    description: "Văn hóa, giáo dục, y tế, an sinh và hoạt động cộng đồng.",
    order: 5,
    manager: "Hoàng Thị E",
    status: "active",
  },
  {
    id: "dept-6",
    name: "Công an",
    code: "CA",
    parentId: null,
    description:
      "An ninh trật tự, tiếp dân và xử lý sự vụ hành chính liên quan.",
    order: 6,
    manager: "Phạm Văn E",
    status: "active",
  },
  {
    id: "dept-7",
    name: "Quân sự",
    code: "QS",
    parentId: "dept-6",
    description:
      "Quốc phòng, dân quân tự vệ và phối hợp đảm bảo an ninh địa bàn.",
    order: 7,
    manager: "Vũ Văn F",
    status: "inactive",
  },
];

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

export default function Departments() {
  const [departments, setDepartments] = useState<DepartmentRecord[]>(
    () => initialDepartments,
  );
  const [staffList, setStaffList] = useState<StaffRecord[]>(() => getStaff());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(
    initialDepartments.find((item) => item.parentId === null)?.id ??
      initialDepartments[0]?.id ??
      "",
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] =
    useState<DepartmentFormState>(buildFormState(null));
  const [currentStaff, setCurrentStaff] = useState<StaffDetailState>(null);

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

  const handleSave = () => {
    const nextDepartment: DepartmentRecord = {
      ...currentDepartment,
      id: currentDepartment.id || Date.now().toString(),
      order: Number.isNaN(Number(currentDepartment.order))
        ? 0
        : Number(currentDepartment.order),
    };

    setDepartments((current) => {
      const exists = current.some((item) => item.id === nextDepartment.id);
      const next = exists
        ? current.map((item) =>
            item.id === nextDepartment.id ? nextDepartment : item,
          )
        : [...current, nextDepartment];

      return next.sort(
        (left, right) =>
          left.order - right.order || left.name.localeCompare(right.name),
      );
    });

    if (!selectedDepartmentId) {
      setSelectedDepartmentId(nextDepartment.id);
    }

    setIsDialogOpen(false);
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

  const handleDeleteDepartment = (department: DepartmentRecord) => {
    if (!window.confirm(`Xóa phòng ban "${department.name}"?`)) return;

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
              Thiết lập phòng ban cha, tên, mã và thứ tự hiển thị trong cây tổ
              chức.
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

            <div className="grid gap-2">
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
              <p className="text-xs text-transparent select-none" aria-hidden="true">
                .
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department-order">Thứ tự hiển thị</Label>
              <Input
                id="department-order"
                type="number"
                value={currentDepartment.order}
                onChange={(event) =>
                  setCurrentDepartment((current) => ({
                    ...current,
                    order: Number(event.target.value),
                  }))
                }
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Số nhỏ hơn hiển thị trước trong danh sách chọn phòng ban.
              </p>
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="department-manager">Trưởng bộ phận</Label>
              <Input
                id="department-manager"
                value={currentDepartment.manager}
                onChange={(event) =>
                  setCurrentDepartment((current) => ({
                    ...current,
                    manager: event.target.value,
                  }))
                }
                placeholder="Nguyễn Văn A"
              />
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

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="department-status">Trạng thái</Label>
              <Select
                id="department-status"
                value={currentDepartment.status}
                onChange={(event) =>
                  setCurrentDepartment((current) => ({
                    ...current,
                    status: event.target.value as DepartmentStatus,
                  }))
                }
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm khóa</option>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>Lưu</Button>
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
