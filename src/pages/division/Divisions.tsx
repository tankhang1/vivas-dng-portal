import { useMemo, useState } from "react";
import { Layout } from "../../shared/components/Layout";
import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../shared/components/ui";
import {
  useCreateDivisionProcessMutation,
  useDivisionsQuery,
  useEditDivisionProcessMutation,
  useRemoveDivisionProcessMutation,
} from "@/features/division/hooks/division.hook";
import type { DivisionItem } from "@/features/division/types/get-divisions.response";
import { Plus } from "lucide-react";
import { useAuth } from "@/shared/providers";
import { DivisionsTable } from "./components/DivisionsTable";
import {
  DivisionFormDialog,
  type DivisionFormValues,
} from "./components/DivisionFormDialog";

export default function Divisions() {
  const { isAdminRole: canManageDivisions } = useAuth();
  const {
    data: divisionsData,
    isLoading: isDivisionsLoading,
    refetch,
  } = useDivisionsQuery();
  const createDivisionMutation = useCreateDivisionProcessMutation();
  const editDivisionMutation = useEditDivisionProcessMutation();
  const removeDivisionMutation = useRemoveDivisionProcessMutation();
  const isSavingDivision =
    createDivisionMutation.isPending || editDivisionMutation.isPending;

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDivisionId, setEditingDivisionId] = useState<number | null>(
    null,
  );
  const [pendingSaveValues, setPendingSaveValues] =
    useState<DivisionFormValues | null>(null);
  const [pendingDeleteDivision, setPendingDeleteDivision] =
    useState<DivisionItem | null>(null);

  const divisions = divisionsData?.content ?? [];
  const filtered = useMemo(
    () =>
      divisions.filter((d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [divisions, searchTerm],
  );

  const editingDivision = editingDivisionId
    ? (divisions.find((item) => item.id === editingDivisionId) ?? null)
    : null;

  const dialogInitialValues: DivisionFormValues | null = isDialogOpen
    ? {
        name: editingDivision?.name ?? "",
        note: editingDivision?.note ?? "",
      }
    : null;

  const handleOpenDialog = (item: DivisionItem | null = null) => {
    setEditingDivisionId(item?.id ?? null);
    setIsDialogOpen(true);
  };

  const executeSave = async (values: DivisionFormValues) => {
    const name = values.name.trim();
    if (!name) return;
    const note = values.note;

    try {
      if (editingDivisionId) {
        await editDivisionMutation.mutateAsync({
          item: editingDivisionId,
          name,
          note,
        });
      } else {
        await createDivisionMutation.mutateAsync({ name, note });
      }
      setIsDialogOpen(false);
    } catch {
      window.alert("Lưu lĩnh vực thất bại. Vui lòng thử lại.");
    }
  };

  const handleSubmit = (values: DivisionFormValues) => {
    setPendingSaveValues(values);
  };

  const executeDelete = async (id: number) => {
    try {
      await removeDivisionMutation.mutateAsync({ item: id });
      refetch();
    } catch {
      window.alert("Xóa lĩnh vực thất bại. Vui lòng thử lại.");
    } finally {
      setPendingDeleteDivision(null);
    }
  };

  const handleDelete = (id: number) => {
    const division = divisions.find((item) => item.id === id);
    if (division) setPendingDeleteDivision(division);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Lĩnh vực chuyên trách
            </h1>
            <p className="mt-1 text-muted-foreground">
              Quản lý danh sách lĩnh vực chuyên trách dùng để phân công cán bộ
              xử lý.
            </p>
          </div>
          {canManageDivisions && (
            <Button
              onClick={() => handleOpenDialog()}
              className="gap-2 self-start"
            >
              <Plus className="h-4 w-4" /> Thêm lĩnh vực
            </Button>
          )}
        </div>

        <DivisionsTable
          divisions={filtered}
          isLoading={isDivisionsLoading}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onEdit={handleOpenDialog}
          onDelete={handleDelete}
          canManage={canManageDivisions}
        />
      </div>

      <DivisionFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEdit={!!editingDivisionId}
        initialValues={dialogInitialValues}
        isSaving={isSavingDivision}
        onSubmit={handleSubmit}
      />

      <Dialog
        open={pendingSaveValues !== null}
        onOpenChange={(open) => {
          if (!open && !isSavingDivision) setPendingSaveValues(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {editingDivisionId
              ? "Xác nhận lưu thay đổi?"
              : "Xác nhận thêm lĩnh vực?"}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {editingDivisionId
            ? `Bạn có chắc muốn lưu thay đổi cho lĩnh vực "${pendingSaveValues?.name ?? ""}" không?`
            : `Bạn có chắc muốn thêm lĩnh vực "${pendingSaveValues?.name ?? ""}" không?`}
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setPendingSaveValues(null)}
            disabled={isSavingDivision}
          >
            Hủy
          </Button>
          <Button
            onClick={async () => {
              if (!pendingSaveValues) return;
              const values = pendingSaveValues;
              setPendingSaveValues(null);
              await executeSave(values);
            }}
            disabled={isSavingDivision}
          >
            {isSavingDivision ? "Đang lưu..." : "Xác nhận lưu"}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={pendingDeleteDivision !== null}
        onOpenChange={(open) => {
          if (!open && !removeDivisionMutation.isPending) {
            setPendingDeleteDivision(null);
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Xác nhận xóa lĩnh vực?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn xóa lĩnh vực "{pendingDeleteDivision?.name ?? ""}"
          không?
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setPendingDeleteDivision(null)}
            disabled={removeDivisionMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              if (!pendingDeleteDivision) return;
              await executeDelete(pendingDeleteDivision.id);
            }}
            disabled={removeDivisionMutation.isPending}
          >
            {removeDivisionMutation.isPending ? "Đang xóa..." : "Xác nhận xóa"}
          </Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
}
