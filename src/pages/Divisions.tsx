import { useMemo, useState } from "react";
import { Layout } from "../shared/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "../shared/components/ui";
import { Spinner } from "../shared/components/ui/spinner";
import {
  useCreateDivisionProcessMutation,
  useDivisionsQuery,
  useEditDivisionProcessMutation,
  useRemoveDivisionProcessMutation,
} from "@/features/division/hooks/division.hook";
import type { DivisionItem } from "@/features/division/types/get-divisions.response";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

type DivisionFormState = {
  id: string;
  name: string;
  note: string;
};

const emptyForm: DivisionFormState = { id: "", name: "", note: "" };

export default function Divisions() {
  const { data: divisionsData, isLoading: isDivisionsLoading, refetch } =
    useDivisionsQuery();
  const createDivisionMutation = useCreateDivisionProcessMutation();
  const editDivisionMutation = useEditDivisionProcessMutation();
  const removeDivisionMutation = useRemoveDivisionProcessMutation();
  const isSavingDivision =
    createDivisionMutation.isPending || editDivisionMutation.isPending;

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDivision, setCurrentDivision] =
    useState<DivisionFormState>(emptyForm);

  const divisions = divisionsData?.content ?? [];
  const filtered = useMemo(
    () =>
      divisions.filter((d) =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [divisions, searchTerm],
  );

  const handleOpenDialog = (item: DivisionItem | null = null) => {
    setCurrentDivision(
      item
        ? { id: String(item.id), name: item.name, note: item.note ?? "" }
        : emptyForm,
    );
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const name = currentDivision.name.trim();
    if (!name) return;
    const note = currentDivision.note;

    try {
      if (currentDivision.id) {
        await editDivisionMutation.mutateAsync({
          item: Number(currentDivision.id),
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

        <Card>
          <CardHeader className="border-b border-border">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm lĩnh vực..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên lĩnh vực</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isDivisionsLoading && (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <Spinner className="h-4 w-4" /> Đang tải lĩnh vực...
                      </span>
                    </TableCell>
                  </TableRow>
                )}
                {!isDivisionsLoading &&
                  filtered.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.note || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Chỉnh sửa"
                            onClick={() => handleOpenDialog(item)}
                          >
                            <Edit2 className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Xóa"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                {!isDivisionsLoading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Không tìm thấy lĩnh vực nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle>
            {currentDivision.id ? "Chỉnh sửa lĩnh vực" : "Thêm lĩnh vực mới"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Tên lĩnh vực</Label>
            <Input
              value={currentDivision.name}
              onChange={(e) =>
                setCurrentDivision((current) => ({
                  ...current,
                  name: e.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Mô tả</Label>
            <Textarea
              value={currentDivision.note}
              onChange={(e) =>
                setCurrentDivision((current) => ({
                  ...current,
                  note: e.target.value,
                }))
              }
              rows={4}
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
    </Layout>
  );
}
