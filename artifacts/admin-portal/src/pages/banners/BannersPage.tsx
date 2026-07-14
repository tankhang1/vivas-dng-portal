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
import { deleteBanner, getBanners } from './store';
import {
  bannerPositionLabel,
  bannerStatusLabel,
  formatBannerDate,
  type BannerRecord,
} from './types';
import { Edit2, Plus, Search, Trash2 } from 'lucide-react';

const PAGE_SIZE = 5;

export default function BannersPage() {
  const [, navigate] = useLocation();
  const [banners, setBanners] = useState<BannerRecord[]>(() => getBanners());
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return banners.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [banners, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa banner này?')) return;
    deleteBanner(id);
    setBanners(getBanners());
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Banner</h1>
            <p className="mt-1 text-muted-foreground">
              Quản lý banner hiển thị trên app, gồm ảnh, liên kết điều hướng và thứ tự.
            </p>
          </div>
          <Button onClick={() => navigate('/banners/new')} className="gap-2 self-start">
            <Plus className="h-4 w-4" />
            Thêm banner
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-3 pb-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Tìm theo tiêu đề banner..."
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
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {bannerPositionLabel(item.position)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatBannerDate(item.startDate)} - {formatBannerDate(item.endDate)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'active' ? 'success' : 'secondary'}>
                        {bannerStatusLabel(item.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/banners/${item.id}/edit`)}
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Không tìm thấy banner nào.
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
