import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "../../shared/components/Layout";
import { Button } from "../../shared/components/ui";
import { Plus } from "lucide-react";
import {
  useCreateDepartmentProcessMutation,
  useDepartmentsQuery,
  useEditDepartmentProcessMutation,
  useRemoveDepartmentProcessMutation,
} from "@/features/department/hooks/department.hook";
import {
  useSearchStaffQuery,
  useStaffByDepartmentQuery,
} from "@/features/staff/hooks/staff.hook";
import type { DepartmentItem } from "@/features/department/types/get-departments.response";
import type { GetDepartmentsResponse } from "@/features/department/types/get-departments.response";
import type { StaffItem } from "@/features/staff/types/get-staffs.response";
import { QUERY_KEY } from "@/shared/api";
import { DepartmentTreeSidebar } from "./components/DepartmentTreeSidebar";
import { DepartmentInfoCard } from "./components/DepartmentInfoCard";
import { DepartmentStaffTable } from "./components/DepartmentStaffTable";
import {
  DepartmentFormDialog,
  type DepartmentFormValues,
} from "./components/DepartmentFormDialog";
import { StaffDetailDialog } from "./components/StaffDetailDialog";
import type { DepartmentRecord } from "./types";

const PAGE_TITLE = "Phòng ban";

function departmentItemToRecord(item: DepartmentItem): DepartmentRecord {
  return {
    id: String(item.id),
    name: item.name,
    code: "",
    parentId: item.department_root_item
      ? String(item.department_root_item)
      : null,
    description: item.note ?? "",
    order: item.id,
    manager: item.staff_name ?? "",
    managerId: item.staff_item || null,
    status: "active",
  };
}

/**
 * The department API returns a single flat, paginated list of every
 * department (root and sub alike), each carrying its own
 * department_root_item as the parent reference — there is no separate
 * "roots only" vs "subs of X" split, so the whole tree is built client-side
 * from that one list.
 */
function useDepartmentTree() {
  const { data, isLoading } = useDepartmentsQuery();
  const items = data?.content ?? [];

  const records = useMemo(
    () => items.map((item) => departmentItemToRecord(item)),
    [items],
  );

  return { records, isLoading };
}

export default function Departments() {
  const queryClient = useQueryClient();
  const { records: departmentsFromApi, isLoading: isDepartmentsLoading } =
    useDepartmentTree();
  const createDepartmentMutation = useCreateDepartmentProcessMutation();
  const editDepartmentMutation = useEditDepartmentProcessMutation();
  const removeDepartmentMutation = useRemoveDepartmentProcessMutation();

  const { data: staffData } = useSearchStaffQuery({ sz: 200, nu: 0 });
  const managerOptions = staffData?.content ?? [];

  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState<string | null>(
    null,
  );
  const [dialogParentId, setDialogParentId] = useState<string | null>(null);
  const [currentStaff, setCurrentStaff] = useState<StaffItem | null>(null);

  const [departments, setDepartments] = useState<DepartmentRecord[]>([]);
  const hasSeededDepartments = useRef(false);
  const { data: selectedDepartmentStaffData } = useStaffByDepartmentQuery({
    department: selectedDepartmentId || "",
    sz: 200,
    nu: 0,
  });

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

  const selectedDepartment = selectedDepartmentId
    ? (departmentsById.get(selectedDepartmentId) ?? null)
    : null;

  const visibleStaff = selectedDepartmentStaffData?.content ?? [];
  const selectedDepartmentChildren = selectedDepartment
    ? (childrenByParentId.get(selectedDepartment.id) ?? [])
    : [];
  const parentDepartment = selectedDepartment?.parentId
    ? (departmentsById.get(selectedDepartment.parentId) ?? null)
    : null;

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

  const openCreateDialog = (parentId: string | null = selectedDepartmentId) => {
    setEditingDepartmentId(null);
    setDialogParentId(parentId);
    setIsDialogOpen(true);
  };

  const openEditDialog = (department: DepartmentRecord) => {
    setEditingDepartmentId(department.id);
    setDialogParentId(department.parentId);
    setIsDialogOpen(true);
  };

  const editingDepartment = editingDepartmentId
    ? (departmentsById.get(editingDepartmentId) ?? null)
    : null;

  const dialogInitialValues: DepartmentFormValues | null = isDialogOpen
    ? {
        code: editingDepartment?.code ?? "",
        name: editingDepartment?.name ?? "",
        parentId: dialogParentId,
        manager: editingDepartment?.manager ?? "",
        managerId: editingDepartment?.managerId ?? null,
        description: editingDepartment?.description ?? "",
      }
    : null;

  const handleSubmit = async (values: DepartmentFormValues) => {
    const name = values.name.trim();
    const desc = values.description ?? "";
    const parent = values.parentId
      ? departmentsById.get(values.parentId)
      : null;
    const staffItem = values.managerId ?? 0;
    const staffName = values.managerId ? values.manager : "";
    const departmentRootItem = parent ? Number(parent.id) : 0;
    const departmentRootName = parent ? parent.name : "";

    try {
      if (editingDepartmentId) {
        await editDepartmentMutation.mutateAsync({
          item: Number(editingDepartmentId),
          name,
          note: desc,
          staff_item: staffItem,
          staff_name: staffName,
          department_root_item: departmentRootItem,
          department_root_name: departmentRootName,
        });
        const nextDepartment: DepartmentRecord = {
          id: editingDepartmentId,
          code: values.code,
          name,
          parentId: values.parentId,
          description: desc,
          order:
            departmentsById.get(editingDepartmentId)?.order ??
            departments.length + 1,
          manager: values.manager,
          managerId: values.managerId,
          status: departmentsById.get(editingDepartmentId)?.status ?? "active",
        };
        setDepartments((current) =>
          current.map((d) => (d.id === nextDepartment.id ? nextDepartment : d)),
        );
      } else {
        await createDepartmentMutation.mutateAsync({
          name,
          note: desc,
          staff_item: staffItem,
          staff_name: staffName,
          department_root_item: departmentRootItem,
          department_root_name: departmentRootName,
        });

        // The create response doesn't reliably carry the new id, so find it
        // by diffing the freshly-invalidated flat list against what we had
        // for this same parent before the call.
        const existingIds = new Set(
          departments
            .filter((d) => d.parentId === values.parentId)
            .map((d) => d.id),
        );
        const parentIdNumber = values.parentId ? Number(values.parentId) : 0;
        const refreshed = queryClient.getQueryData<GetDepartmentsResponse>(
          QUERY_KEY.DEPARTMENTS,
        );
        const created = refreshed?.content.find(
          (department) =>
            (department.department_root_item || 0) === parentIdNumber &&
            !existingIds.has(String(department.id)),
        );

        const nextDepartment: DepartmentRecord = {
          id: created ? String(created.id) : `local-${Date.now()}`,
          code: values.code,
          name,
          parentId: values.parentId,
          description: desc,
          order: departments.length + 1,
          manager: values.manager,
          managerId: values.managerId,
          status: "active",
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

  const handleDeleteDepartment = async (department: DepartmentRecord) => {
    if (!window.confirm(`Xóa phòng ban "${department.name}"?`)) return;

    try {
      await removeDepartmentMutation.mutateAsync({
        item: Number(department.id),
      });

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
          <DepartmentTreeSidebar
            childrenByParentId={childrenByParentId}
            selectedDepartmentId={selectedDepartmentId}
            onSelect={setSelectedDepartmentId}
          />

          <div className="space-y-5">
            <DepartmentInfoCard
              department={selectedDepartment}
              parentDepartment={parentDepartment}
              staffCount={visibleStaff.length}
              childrenCount={selectedDepartmentChildren.length}
              onAddChild={() =>
                selectedDepartment && openCreateDialog(selectedDepartment.id)
              }
              onEdit={() => selectedDepartment && openEditDialog(selectedDepartment)}
              onDelete={() =>
                selectedDepartment && handleDeleteDepartment(selectedDepartment)
              }
            />

            <DepartmentStaffTable
              staff={visibleStaff}
              scopeLabel={departmentScopeLabel}
              onViewStaff={setCurrentStaff}
            />
          </div>
        </div>
      </div>

      <DepartmentFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEdit={!!editingDepartmentId}
        initialValues={dialogInitialValues}
        excludeDepartmentId={editingDepartmentId ?? undefined}
        departments={departments}
        managerOptions={managerOptions}
        isSaving={isSaving}
        onSubmit={handleSubmit}
      />

      <StaffDetailDialog
        staff={currentStaff}
        onOpenChange={(open) => !open && setCurrentStaff(null)}
      />
    </Layout>
  );
}
