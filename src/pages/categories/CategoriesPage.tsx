import { useState } from "react";
import { Layout } from "../../shared/components/Layout";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shared/components/ui";
import { Spinner } from "../../shared/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { categoryTypeLabel, categoryTypeOptions, type CategoryType } from "./types";
import {
  useCreateCategoryNewsProcessMutation,
  useEditCategoryNewsProcessMutation,
  useNewsCategoriesQuery,
  useRemoveCategoryNewsProcessMutation,
} from "@/features/category-news/hooks/category-news.hook";
import {
  useCommentCategoriesQuery,
  useCreateCategoryCommentProcessMutation,
  useEditCategoryCommentProcessMutation,
  useRemoveCategoryCommentProcessMutation,
} from "@/features/category-comment/hooks/category-comment.hook";
import type { CategoryItem } from "@/features/category-news/types/get-categories.response";
import { Edit2, Plus, Trash2 } from "lucide-react";
import {
  CategoryFormDialog,
  type CategoryFormValues,
} from "./components/CategoryFormDialog";

const PAGE_SIZE = 8;

export default function CategoriesPage() {
  const [activeType, setActiveType] = useState<CategoryType>("feedback");
  const [page, setPage] = useState(1);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryItem | null>(null);
  const [pendingSaveValues, setPendingSaveValues] =
    useState<CategoryFormValues | null>(null);
  const [pendingDeleteItem, setPendingDeleteItem] =
    useState<CategoryItem | null>(null);

  const createNewsMutation = useCreateCategoryNewsProcessMutation();
  const editNewsMutation = useEditCategoryNewsProcessMutation();
  const createCommentMutation = useCreateCategoryCommentProcessMutation();
  const editCommentMutation = useEditCategoryCommentProcessMutation();
  const removeNewsMutation = useRemoveCategoryNewsProcessMutation();
  const removeCommentMutation = useRemoveCategoryCommentProcessMutation();

  const isSaving =
    createNewsMutation.isPending ||
    editNewsMutation.isPending ||
    createCommentMutation.isPending ||
    editCommentMutation.isPending;

  const openCreateDialog = () => {
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: CategoryItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const dialogInitialValues: CategoryFormValues | null = isDialogOpen
    ? {
        name: editingItem?.name ?? "",
        path: editingItem?.path ?? "",
        orderNumber: editingItem?.order_number ?? 0,
      }
    : null;

  const executeSave = async (values: CategoryFormValues) => {
    try {
      if (activeType === "news") {
        if (editingItem) {
          await editNewsMutation.mutateAsync({
            category_item: editingItem.id,
            name: values.name,
            path: values.path,
            note: "",
            order_number: values.orderNumber,
          });
        } else {
          await createNewsMutation.mutateAsync({
            name: values.name,
            path: values.path,
            note: "",
            order_number: values.orderNumber,
          });
        }
      } else {
        if (editingItem) {
          await editCommentMutation.mutateAsync({
            category_item: editingItem.id,
            name: values.name,
            path: values.path,
            note: "",
            order_number: values.orderNumber,
          });
        } else {
          // No parent-category picker in this UI yet, so new categories are
          // always created at the top level.
          await createCommentMutation.mutateAsync({
            category_item: 0,
            name: values.name,
            path: values.path,
            note: "",
            order_number: values.orderNumber,
          });
        }
      }
      setIsDialogOpen(false);
    } catch {
      window.alert("Lưu danh mục thất bại. Vui lòng thử lại.");
    }
  };

  const handleSubmit = (values: CategoryFormValues) => {
    setPendingSaveValues(values);
  };

  const isDeleting =
    removeNewsMutation.isPending || removeCommentMutation.isPending;

  const executeDelete = async (item: CategoryItem) => {
    try {
      if (activeType === "news") {
        await removeNewsMutation.mutateAsync({ category_item: item.id });
      } else {
        await removeCommentMutation.mutateAsync({ category_item: item.id });
      }
    } catch {
      window.alert("Xóa danh mục thất bại. Vui lòng thử lại.");
    } finally {
      setPendingDeleteItem(null);
    }
  };

  const handleDelete = (item: CategoryItem) => {
    setPendingDeleteItem(item);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Danh mục</h1>
            <p className="mt-1 text-muted-foreground">
              Quản lý danh mục dùng cho phản ánh và tin tức.
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2 self-start">
            <Plus className="h-4 w-4" />
            Thêm danh mục
          </Button>
        </div>

        <Tabs
          value={activeType}
          onValueChange={(value) => {
            setActiveType(value as CategoryType);
            setPage(1);
          }}
        >
          <TabsList>
            {categoryTypeOptions.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Card>
          <CardContent className="pt-6">
            {activeType === "news" ? (
              <NewsCategoriesTable
                page={page}
                onPageChange={setPage}
                onEdit={openEditDialog}
                onDelete={handleDelete}
              />
            ) : (
              <FeedbackCategoriesTable
                page={page}
                onPageChange={setPage}
                onEdit={openEditDialog}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <CategoryFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        isEdit={!!editingItem}
        typeLabel={categoryTypeLabel(activeType)}
        initialValues={dialogInitialValues}
        isSaving={isSaving}
        onSubmit={handleSubmit}
      />

      <Dialog
        open={pendingSaveValues !== null}
        onOpenChange={(open) => {
          if (!open && !isSaving) setPendingSaveValues(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {editingItem
              ? "Xác nhận lưu thay đổi?"
              : "Xác nhận thêm danh mục?"}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {editingItem
            ? `Bạn có chắc muốn lưu thay đổi cho danh mục "${pendingSaveValues?.name ?? ""}" không?`
            : `Bạn có chắc muốn thêm danh mục "${pendingSaveValues?.name ?? ""}" không?`}
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setPendingSaveValues(null)}
            disabled={isSaving}
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
            disabled={isSaving}
          >
            {isSaving ? "Đang lưu..." : "Xác nhận lưu"}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={pendingDeleteItem !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setPendingDeleteItem(null);
        }}
      >
        <DialogHeader>
          <DialogTitle>Xác nhận xóa danh mục?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Bạn có chắc muốn xóa danh mục "{pendingDeleteItem?.name ?? ""}" không?
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setPendingDeleteItem(null)}
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              if (!pendingDeleteItem) return;
              await executeDelete(pendingDeleteItem);
            }}
            disabled={isDeleting}
          >
            {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
          </Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
}

type CategoryTableProps = {
  page: number;
  onPageChange: (page: number) => void;
  onEdit: (item: CategoryItem) => void;
  onDelete: (item: CategoryItem) => void;
};

function NewsCategoriesTable({ page, onPageChange, onEdit, onDelete }: CategoryTableProps) {
  const { data, isLoading } = useNewsCategoriesQuery({
    sz: PAGE_SIZE,
    nu: page - 1,
  });

  const items = data?.content ?? [];
  const totalPages = Math.max(1, data?.page.totalPages ?? 1);
  const totalItems = data?.page.totalElements ?? 0;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên danh mục</TableHead>
            <TableHead>Đường dẫn</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Spinner className="h-4 w-4" /> Đang tải danh mục...
                </span>
              </TableCell>
            </TableRow>
          )}
          {!isLoading &&
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {item.path || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Chỉnh sửa"
                      onClick={() => onEdit(item)}
                    >
                      <Edit2 className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Xóa"
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          {!isLoading && items.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-muted-foreground"
              >
                Không tìm thấy danh mục nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
      />
    </>
  );
}

function FeedbackCategoriesTable({
  page,
  onPageChange,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const { data, isLoading } = useCommentCategoriesQuery({
    sz: PAGE_SIZE,
    nu: page - 1,
  });

  const items = data?.content ?? [];
  const totalPages = Math.max(1, data?.page.totalPages ?? 1);
  const totalItems = data?.page.totalElements ?? 0;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên danh mục</TableHead>
            <TableHead>Đường dẫn</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Spinner className="h-4 w-4" /> Đang tải danh mục...
                </span>
              </TableCell>
            </TableRow>
          )}
          {!isLoading &&
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {item.path || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Chỉnh sửa"
                      onClick={() => onEdit(item)}
                    >
                      <Edit2 className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Xóa"
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          {!isLoading && items.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-muted-foreground"
              >
                Không tìm thấy danh mục nào.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
      />
    </>
  );
}
