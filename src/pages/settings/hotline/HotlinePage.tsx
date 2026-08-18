import { useState } from "react";
import { Layout } from "../../../shared/components/Layout";
import {
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/components/ui";
import { Spinner } from "../../../shared/components/ui/spinner";
import { Plus, Trash2 } from "lucide-react";
import {
  useCreateHotlineProcessMutation,
  useHotlineQuery,
  useRemoveHotlineProcessMutation,
} from "@/features/hotline/hooks/hotline.hook";
import {
  HotlineFormDialog,
  type HotlineFormValues,
} from "./components/HotlineFormDialog";

export default function HotlinePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, refetch } = useHotlineQuery();
  const createHotlineMutation = useCreateHotlineProcessMutation();
  const removeHotlineMutation = useRemoveHotlineProcessMutation();

  const items = data ?? [];

  const handleSubmit = async (values: HotlineFormValues) => {
    try {
      await createHotlineMutation.mutateAsync({
        ...values,
        phone_zalo: values.phone,
      });
      setIsDialogOpen(false);
    } catch {
      window.alert("Thêm hotline thất bại. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa số hotline này?")) return;
    try {
      await removeHotlineMutation.mutateAsync({ id });
      refetch();
    } catch {
      window.alert("Xóa hotline thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hotline</h1>
            <p className="mt-1 text-muted-foreground">
              Quản lý danh sách số điện thoại hotline hiển thị trên mini app.
            </p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="gap-2 self-start"
          >
            <Plus className="h-4 w-4" />
            Thêm hotline
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Chức vụ</TableHead>
                  <TableHead>Đơn vị</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <Spinner className="h-4 w-4" /> Đang tải danh sách hotline...
                      </span>
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading &&
                  items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.potition || "-"}</TableCell>
                      <TableCell>{item.department || "-"}</TableCell>
                      <TableCell>{item.phone}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.email || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Xóa"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {!isLoading && items.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Chưa có số hotline nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <HotlineFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isSaving={createHotlineMutation.isPending}
        onSubmit={handleSubmit}
      />
    </Layout>
  );
}
