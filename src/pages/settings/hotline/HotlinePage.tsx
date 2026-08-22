import { useState } from "react";
import { Layout } from "../../../shared/components/Layout";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/components/ui";
import { Spinner } from "../../../shared/components/ui/spinner";
import { Info, Plus, Trash2 } from "lucide-react";
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
  const [pendingValues, setPendingValues] =
    useState<HotlineFormValues | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { data, isLoading, refetch } = useHotlineQuery();
  const createHotlineMutation = useCreateHotlineProcessMutation();
  const removeHotlineMutation = useRemoveHotlineProcessMutation();

  const items = data ?? [];

  const executeCreate = async (values: HotlineFormValues) => {
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

  const handleSubmit = (values: HotlineFormValues) => {
    setPendingValues(values);
  };

  const executeDelete = async (id: number) => {
    try {
      await removeHotlineMutation.mutateAsync({ id });
      refetch();
    } catch {
      window.alert("Xóa hotline thất bại. Vui lòng thử lại.");
    } finally {
      setPendingDelete(null);
    }
  };

  const handleDelete = (id: number, name: string) => {
    setPendingDelete({ id, name });
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

        <Card className="border-primary/15 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="h-5 w-5 text-primary" />
              Hướng dẫn nhanh
            </CardTitle>
            <CardDescription>
              Mỗi dòng hotline là một cán bộ hoặc đầu mối liên hệ sẽ được hiển thị
              trên mini app.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Thêm đầy đủ họ tên, số điện thoại, chức vụ và đơn vị trước khi lưu.</li>
              <li>Email là trường không bắt buộc, có thể để trống nếu chưa có.</li>
              <li>Xóa hotline là thao tác ngay lập tức, hệ thống sẽ hỏi xác nhận trước khi thực hiện.</li>
            </ul>
          </CardContent>
        </Card>

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
                          onClick={() => handleDelete(item.id, item.name)}
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

      <Dialog
        open={pendingValues !== null}
        onOpenChange={(open) => {
          if (!open && !createHotlineMutation.isPending) {
            setPendingValues(null);
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Xác nhận thêm hotline?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn thêm hotline cho "{pendingValues?.name ?? ""}" không?
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setPendingValues(null)}
            disabled={createHotlineMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            onClick={async () => {
              if (!pendingValues) return;
              const values = pendingValues;
              setPendingValues(null);
              await executeCreate(values);
            }}
            disabled={createHotlineMutation.isPending}
          >
            {createHotlineMutation.isPending ? "Đang lưu..." : "Xác nhận lưu"}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !removeHotlineMutation.isPending) {
            setPendingDelete(null);
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Xác nhận xóa hotline?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn xóa số hotline của "{pendingDelete?.name ?? ""}" không?
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setPendingDelete(null)}
            disabled={removeHotlineMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              if (!pendingDelete) return;
              await executeDelete(pendingDelete.id);
            }}
            disabled={removeHotlineMutation.isPending}
          >
            {removeHotlineMutation.isPending ? "Đang xóa..." : "Xác nhận xóa"}
          </Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
}
