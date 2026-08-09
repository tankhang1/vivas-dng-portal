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
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui';
import { deleteEvent, getEvents } from './store';
import {
  categoryLabel,
  formatDateTime,
  statusLabel,
  statusVariant,
  type EventItem,
} from './types';
import { Edit2, Globe, FileEdit, ImageUp, Plus, Search, Trash2, Clock3 } from 'lucide-react';

const PAGE_SIZE = 5;

export default function EventsPage() {
  const [, navigate] = useLocation();
  const [events, setEvents] = useState<EventItem[]>(() => getEvents());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoryFilter === 'all' || event.category === categoryFilter) &&
        (statusFilter === 'all' || event.status === statusFilter),
    );
  }, [events, searchTerm, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) return;
    deleteEvent(id);
    setEvents(getEvents());
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sự kiện</h1>
            <p className="mt-1 text-muted-foreground">
              Quản lý lịch sự kiện, hội nghị và hoạt động nổi bật trên cổng thông tin.
            </p>
          </div>
          <Button onClick={() => navigate('/events/new')} className="gap-2 self-start">
            <Plus className="h-4 w-4" />
            Thêm sự kiện
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-3 pb-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm tiêu đề sự kiện..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                className="w-[160px]"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">Tất cả danh mục</option>
                <option value="hoi-nghi">Hội nghị</option>
                <option value="tap-huan">Tập huấn</option>
                <option value="le-hoat-dong">Lễ / Hoạt động</option>
              </Select>
              <Select
                className="w-[160px]"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ảnh</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Địa điểm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex h-12 w-12 overflow-hidden rounded-md border bg-slate-100">
                        {item.thumbnail?.[0]?.url ? (
                          <img
                            src={item.thumbnail[0].url}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <ImageUp className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[400px] font-medium">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{item.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{categoryLabel(item.category)}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5" />
                          <span>{formatDateTime(item.startAt)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5" />
                          <span>{formatDateTime(item.endAt)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.location}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(item.status)} className="gap-1">
                        {item.status === 'published' ? (
                          <Globe className="h-3 w-3" />
                        ) : (
                          <FileEdit className="h-3 w-3" />
                        )}
                        {statusLabel(item.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Chỉnh sửa"
                          onClick={() => navigate(`/events/${item.id}/edit`)}
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
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Không tìm thấy sự kiện nào.
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
