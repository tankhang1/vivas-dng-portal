import React, { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { Layout } from '../../components/Layout';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui';
import { deleteCategory, getCategories } from './store';
import { type CategoryRecord } from './types';
import { Edit2, Pin, Plus, Search, Trash2, CheckCircle2, ImageOff } from 'lucide-react';

const PAGE_SIZE = 8;

export default function CategoriesPage() {
  const [, navigate] = useLocation();
  const [categories, setCategories] = useState<CategoryRecord[]>(() => getCategories());
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return categories.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [categories, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
    deleteCategory(id);
    setCategories(getCategories());
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Danh mục</h1>
            <p className="mt-1 text-muted-foreground">
              Quản lý danh mục nội dung, ghim danh mục và sắp xếp thứ tự hiển thị.
            </p>
          </div>
          <Button onClick={() => navigate('/categories/new')} className="gap-2 self-start">
            <Plus className="h-4 w-4" />
            Thêm danh mục
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-3 pb-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Tìm theo tên hoặc đường dẫn..."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setPage(1);
                }}
              />
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Đường dẫn</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Thứ tự</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ghim</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {item.isPinned ? (
                          <Pin className="h-4 w-4 text-red-500" />
                        ) : (
                          <span className="h-4 w-4" />
                        )}
                        {item.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md border bg-slate-100">
                        {item.icon[0]?.url ? (
                          <img
                            src={item.icon[0].url}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-red-500">
                      <div className="flex flex-col">
                        <span className="text-xs uppercase text-muted-foreground">
                          {item.routeType === 'link' ? 'Link' : 'Path'}
                        </span>
                        <span>{item.slug}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.description || '-'}
                    </TableCell>
                    <TableCell>{item.order}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'visible' ? 'success' : 'secondary'}>
                        {item.status === 'visible' ? 'Hiện' : 'Ẩn'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.isPinned ? (
                        <Badge variant="success" className="gap-1 bg-green-100 text-green-800">
                          <CheckCircle2 className="h-3 w-3" />
                          Đã ghim
                        </Badge>
                      ) : (
                        <Badge variant="secondary">-</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Chỉnh sửa"
                          onClick={() => navigate(`/categories/${item.id}/edit`)}
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
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      Không tìm thấy danh mục nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
