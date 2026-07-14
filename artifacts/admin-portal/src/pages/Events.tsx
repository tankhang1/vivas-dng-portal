import React, { useMemo, useState } from 'react';
import { Layout } from '../components/Layout';
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Label,
  Select,
  Textarea,
  Pagination,
} from '../components/ui';
import { MediaUpload } from '../components/MediaUpload';
import { ScrollArea } from '../components/ui/scroll-area';
import { FormEditor } from '../components/FormEditor';
import { Plus, Search, Edit2, Trash2, Globe, FileEdit, ImageUp, CalendarDays, MapPinned, Clock3, Sparkles, UsersRound } from 'lucide-react';

type MediaItem = {
  id: string;
  name: string;
  url: string;
};

type EventItem = {
  id: string;
  category: string;
  title: string;
  startAt: string;
  endAt: string;
  location: string;
  thumbnail?: MediaItem[];
  shortDescription?: string;
  descriptionHtml?: string;
  status: string;
};

const eventCategories = [
  {
    value: 'hoi-nghi',
    label: 'Hội nghị',
    icon: CalendarDays,
    description: 'Dùng cho các hội nghị, buổi làm việc, tọa đàm hoặc họp chuyên đề.',
  },
  {
    value: 'tap-huan',
    label: 'Tập huấn',
    icon: UsersRound,
    description: 'Dùng cho chương trình đào tạo, tập huấn hoặc hướng dẫn nghiệp vụ.',
  },
  {
    value: 'le-hoat-dong',
    label: 'Lễ / Hoạt động',
    icon: Sparkles,
    description: 'Dùng cho lễ kỷ niệm, khai mạc, hoạt động cộng đồng hoặc sự kiện nổi bật.',
  },
] as const;

const defaultEvent = {
  id: '',
  category: 'hoi-nghi',
  title: '',
  startAt: '',
  endAt: '',
  location: '',
  thumbnail: [],
  shortDescription: '',
  descriptionHtml: '',
  status: 'draft',
} satisfies EventItem;

const mockEvents: EventItem[] = [
  {
    id: '1',
    category: 'hoi-nghi',
    title: 'Hội nghị tổng kết công tác năm',
    startAt: '2026-07-14T08:30',
    endAt: '2026-07-14T10:30',
    location: 'Hội trường UBND Xã Tây Hồ',
    thumbnail: [],
    shortDescription: 'Tổng kết kết quả công tác năm và triển khai nhiệm vụ trọng tâm.',
    descriptionHtml: '<p>Hội nghị tổng kết công tác năm 2026.</p>',
    status: 'published',
  },
  {
    id: '2',
    category: 'tap-huan',
    title: 'Tập huấn chuyển đổi số cho cán bộ',
    startAt: '2026-07-16T13:30',
    endAt: '2026-07-16T16:00',
    location: 'Phòng họp tầng 2',
    thumbnail: [],
    shortDescription: 'Tập huấn kỹ năng số và quy trình xử lý hồ sơ điện tử.',
    descriptionHtml: '<p>Nội dung tập huấn chuyển đổi số.</p>',
    status: 'draft',
  },
];

function formatDateTime(value: string) {
  if (!value) return 'Chưa cập nhật';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function nowAsDateTimeLocal() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<EventItem | null>(null);

  const filtered = useMemo(() => {
    return events.filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === 'all' || event.category === categoryFilter) &&
      (statusFilter === 'all' || event.status === statusFilter),
    );
  }, [events, searchTerm, categoryFilter, statusFilter]);

  const PAGE_SIZE = 5;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleOpenDialog = (event: EventItem | null = null) => {
    setCurrentEvent(event || {
      ...defaultEvent,
      startAt: nowAsDateTimeLocal(),
      endAt: nowAsDateTimeLocal(),
    });
    setIsDialogOpen(true);
  };

  const updateEvent = (patch: Partial<EventItem>) => {
    setCurrentEvent((prev) => ({
      ...(prev ?? defaultEvent),
      ...patch,
    }));
  };

  const handleSave = () => {
    if (!currentEvent) return;

    if (currentEvent.id) {
      setEvents(events.map((event) => (event.id === currentEvent.id ? currentEvent : event)));
    } else {
      setEvents([{ ...currentEvent, id: Date.now().toString() }, ...events]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  return (
    <Layout>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Sự kiện</h1>
              <p className="mt-1 text-muted-foreground">
                Quản lý lịch sự kiện, hội nghị và hoạt động nổi bật trên cổng thông tin.
              </p>
            </div>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" /> Thêm sự kiện
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
                        <div className="h-12 w-12 overflow-hidden rounded-md border bg-slate-100">
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
                      <TableCell className="font-medium max-w-[340px]">
                        <span className="truncate">{item.title}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
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
                      <TableCell className="text-muted-foreground">
                        {item.location}
                      </TableCell>
                      <TableCell>
                        {item.status === 'published' ? (
                          <Badge variant="success" className="gap-1 bg-green-100 text-green-800">
                            <Globe className="h-3 w-3" /> Đã xuất bản
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <FileEdit className="h-3 w-3" /> Bản nháp
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                          <Edit2 className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogHeader>
            <DialogTitle>{currentEvent?.id ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới'}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label>Danh mục sự kiện</Label>
                <Select
                  value={currentEvent?.category || 'hoi-nghi'}
                  onChange={(e) => updateEvent({ category: e.target.value })}
                >
                  {eventCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </Select>
                <p className="text-xs text-muted-foreground">
                  Chọn một danh mục phù hợp cho sự kiện.
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Tiêu đề sự kiện</Label>
                <Input
                  value={currentEvent?.title || ''}
                  onChange={(e) => updateEvent({ title: e.target.value })}
                  placeholder="Nhập tiêu đề sự kiện..."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Thời gian bắt đầu</Label>
                  <Input
                    type="datetime-local"
                    value={currentEvent?.startAt || ''}
                    onChange={(e) => updateEvent({ startAt: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Thời gian kết thúc</Label>
                  <Input
                    type="datetime-local"
                    value={currentEvent?.endAt || ''}
                    onChange={(e) => updateEvent({ endAt: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Địa điểm</Label>
                <Input
                  value={currentEvent?.location || ''}
                  onChange={(e) => updateEvent({ location: e.target.value })}
                  placeholder="Nhập địa điểm tổ chức..."
                />
              </div>

              <div className="grid gap-2">
                <Label>Hình ảnh thumbnail</Label>
                <MediaUpload
                  value={currentEvent?.thumbnail || []}
                  onChange={(thumbnail) => updateEvent({ thumbnail })}
                  accept="image/*"
                  multiple={false}
                  hint="Chọn 1 ảnh đại diện cho sự kiện."
                />
              </div>

              <div className="grid gap-2">
                <Label>Nội dung mô tả ngắn</Label>
                <Textarea
                  value={currentEvent?.shortDescription || ''}
                  onChange={(e) => updateEvent({ shortDescription: e.target.value })}
                  placeholder="Nhập mô tả ngắn của sự kiện..."
                  className="min-h-[96px]"
                />
              </div>

              <div className="grid gap-2">
                <Label>Mô tả</Label>
                <FormEditor
                  value={currentEvent?.descriptionHtml || ''}
                  onChange={(descriptionHtml) => updateEvent({ descriptionHtml })}
                  placeholder="Nhập nội dung mô tả sự kiện..."
                  className="min-h-[220px]"
                />
                <p className="text-xs text-muted-foreground">
                  Nội dung mô tả sẽ được lưu dưới dạng HTML.
                </p>
              </div>

              <div className="grid gap-2">
                <Label>Trạng thái</Label>
                <Select
                  value={currentEvent?.status || 'draft'}
                  onChange={(e) => updateEvent({ status: e.target.value })}
                >
                  <option value="draft">Lưu nháp</option>
                  <option value="published">Xuất bản ngay</option>
                </Select>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>Lưu sự kiện</Button>
          </DialogFooter>
        </Dialog>
      </Layout>
  );
}
