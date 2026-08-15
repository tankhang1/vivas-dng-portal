import React, { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { Layout } from '../../shared/components/Layout';
import {
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
} from '../../shared/components/ui';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { deleteCategory, getCategories } from './store';
import { categoryTypeOptions, type CategoryRecord, type CategoryType } from './types';
import { Edit2, Plus, Search, Trash2 } from 'lucide-react';

const PAGE_SIZE = 8;

export default function CategoriesPage() {
  const [, navigate] = useLocation();
  const [categories, setCategories] = useState<CategoryRecord[]>(() => getCategories());
  const [activeType, setActiveType] = useState<CategoryType>('feedback');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return categories.filter(
      (item) =>
        item.type === activeType &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [categories, activeType, searchTerm]);

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
          <CardHeader className="flex flex-col gap-3 pb-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Tìm theo tên danh mục..."
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
                  <TableHead>Ghi chú</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.note || '-'}
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
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
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
