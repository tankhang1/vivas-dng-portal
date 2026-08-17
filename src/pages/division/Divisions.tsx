import { useMemo, useState } from "react";
import { Layout } from "../../shared/components/Layout";
import { Button } from "../../shared/components/ui";
import {
  useCreateDivisionProcessMutation,
  useDivisionsQuery,
  useEditDivisionProcessMutation,
  useRemoveDivisionProcessMutation,
} from "@/features/division/hooks/division.hook";
import type { DivisionItem } from "@/features/division/types/get-divisions.response";
import { Plus } from "lucide-react";
import { DivisionsTable } from "./components/DivisionsTable";
import {
  DivisionFormDialog,
  type DivisionFormValues,
} from "./components/DivisionFormDialog";

export default function Divisions() {
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

  const handleSubmit = async (values: DivisionFormValues) => {
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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lĩnh vực này?")) return;
    try {
      await removeDivisionMutation.mutateAsync({ item: id });
      refetch();
    } catch {
      window.alert("Xóa lĩnh vực thất bại. Vui lòng thử lại.");
    }
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
          <Button
            onClick={() => handleOpenDialog()}
            className="gap-2 self-start"
          >
            <Plus className="h-4 w-4" /> Thêm lĩnh vực
          </Button>
        </div>

        <DivisionsTable
          divisions={filtered}
          isLoading={isDivisionsLoading}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onEdit={handleOpenDialog}
          onDelete={handleDelete}
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
    </Layout>
  );
}
