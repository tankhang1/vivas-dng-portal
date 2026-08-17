import { useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "../../shared/components/Layout";
import {
  Button,
  Card,
  CardContent,
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
import { categoryTypeOptions, type CategoryType } from "./types";
import {
  useNewsCategoriesQuery,
  useRemoveCategoryNewsProcessMutation,
} from "@/features/category-news/hooks/category-news.hook";
import {
  useCommentCategoriesQuery,
  useRemoveCategoryCommentProcessMutation,
} from "@/features/category-comment/hooks/category-comment.hook";
import { Edit2, Plus, Trash2 } from "lucide-react";

const PAGE_SIZE = 8;

export default function CategoriesPage() {
  const [, navigate] = useLocation();
  const [activeType, setActiveType] = useState<CategoryType>("feedback");
  const [page, setPage] = useState(1);

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
          <Button
            onClick={() => navigate(`/categories/new?type=${activeType}`)}
            className="gap-2 self-start"
          >
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
                onEdit={(id) => navigate(`/categories/${id}/edit?type=news`)}
              />
            ) : (
              <FeedbackCategoriesTable
                page={page}
                onPageChange={setPage}
                onEdit={(id) =>
                  navigate(`/categories/${id}/edit?type=feedback`)
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

type CategoryTableProps = {
  page: number;
  onPageChange: (page: number) => void;
  onEdit: (id: string) => void;
};

function NewsCategoriesTable({ page, onPageChange, onEdit }: CategoryTableProps) {
  const { data, isLoading, refetch } = useNewsCategoriesQuery({
    sz: PAGE_SIZE,
    nu: page - 1,
  });
  const removeCategoryMutation = useRemoveCategoryNewsProcessMutation();

  const items = data?.content ?? [];
  const totalPages = Math.max(1, data?.page.totalPages ?? 1);
  const totalItems = data?.page.totalElements ?? 0;

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      await removeCategoryMutation.mutateAsync({ category_item: id });
      refetch();
    } catch {
      window.alert("Xóa danh mục thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên danh mục</TableHead>
            <TableHead>Đường dẫn</TableHead>
            <TableHead>Ghi chú</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
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
                <TableCell className="text-muted-foreground">
                  {item.note || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Chỉnh sửa"
                      onClick={() => onEdit(String(item.id))}
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
}: CategoryTableProps) {
  const { data, isLoading, refetch } = useCommentCategoriesQuery({
    sz: PAGE_SIZE,
    nu: page - 1,
  });
  const removeCategoryMutation = useRemoveCategoryCommentProcessMutation();

  const items = data?.content ?? [];
  const totalPages = Math.max(1, data?.page.totalPages ?? 1);
  const totalItems = data?.page.totalElements ?? 0;

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      await removeCategoryMutation.mutateAsync({ category_item: id });
      refetch();
    } catch {
      window.alert("Xóa danh mục thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên danh mục</TableHead>
            <TableHead>Đường dẫn</TableHead>
            <TableHead>Ghi chú</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
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
                <TableCell className="text-muted-foreground">
                  {item.note || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Chỉnh sửa"
                      onClick={() => onEdit(String(item.id))}
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
