import React, { useMemo, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button, Input, Dialog, DialogHeader, DialogTitle, DialogFooter, Label, Select, Textarea, Pagination } from '../components/ui';
import { mockFeedback, feedbackCategories, mockStaff } from '../data/mock';
import { Search, Eye, Trash2, MapPin, Clock, CheckCircle2, Loader2, EyeOff, User } from 'lucide-react';

const PAGE_SIZE = 5;

const statusMeta: Record<string, { label: string; variant: 'secondary' | 'warning' | 'success'; icon: any }> = {
  pending: { label: 'Chờ xử lý', variant: 'secondary', icon: Clock },
  processing: { label: 'Đang xử lý', variant: 'warning', icon: Loader2 },
  resolved: { label: 'Đã xử lý', variant: 'success', icon: CheckCircle2 },
};

export default function Feedback() {
  const [items, setItems] = useState(mockFeedback);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [current, setCurrent] = useState<any>(null);

  const filtered = useMemo(() => {
    return items.filter(f =>
      (f.title.toLowerCase().includes(searchTerm.toLowerCase()) || f.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === 'all' || f.category === categoryFilter) &&
      (statusFilter === 'all' || f.status === statusFilter)
    );
  }, [items, searchTerm, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const categoryLabel = (value: string) => feedbackCategories.find(c => c.value === value)?.label || value;

  const handleOpenDetail = (item: any) => {
    setCurrent({
      ...item,
      media: item.media || item.images || [],
    });
    setIsDialogOpen(true);
  };

  const handleUpdate = (updates: Partial<any>) => {
    const updated = { ...current, ...updates };
    setCurrent(updated);
    setItems(items.map(f => (f.id === updated.id ? updated : f)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa phản ánh này?')) {
      setItems(items.filter(f => f.id !== id));
      if (current?.id === id) setIsDialogOpen(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phản ánh kiến nghị</h1>
          <p className="text-muted-foreground mt-1">Tiếp nhận và xử lý phản ánh, kiến nghị của công dân gửi qua ứng dụng.</p>
        </div>

        <Card>
          <CardHeader className="pb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tiêu đề hoặc người gửi..."
                className="pl-9"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select className="w-[170px]" value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}>
                <option value="all">Tất cả danh mục</option>
                {feedbackCategories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </Select>
              <Select className="w-[150px]" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="resolved">Đã xử lý</option>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Người gửi</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Ngày gửi</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((item) => {
                  const meta = statusMeta[item.status];
                  return (
                    <TableRow key={item.id} className="cursor-pointer" onClick={() => handleOpenDetail(item)}>
                      <TableCell className="font-medium max-w-[280px] truncate">{item.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          {item.privacy === 'anonymous' ? <EyeOff className="h-3.5 w-3.5 text-muted-foreground" /> : <User className="h-3.5 w-3.5 text-muted-foreground" />}
                          {item.privacy === 'anonymous' ? 'Ẩn danh' : item.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{categoryLabel(item.category)}</Badge>
                      </TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <Badge variant={meta.variant} className="gap-1">
                          <meta.icon className="h-3 w-3" /> {meta.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDetail(item)}>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Không tìm thấy phản ánh nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {current && (
          <>
            <DialogHeader>
              <DialogTitle>{current.title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2 max-h-[65vh] overflow-y-auto">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{categoryLabel(current.category)}</Badge>
                <Badge variant={current.privacy === 'anonymous' ? 'secondary' : 'outline'} className="gap-1">
                  {current.privacy === 'anonymous' ? <EyeOff className="h-3 w-3" /> : <User className="h-3 w-3" />}
                  {current.privacy === 'anonymous' ? 'Ẩn danh' : 'Công khai'}
                </Badge>
                <span className="text-xs text-muted-foreground">Gửi ngày {current.date}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Người gửi</p>
                  <p className="font-medium">{current.privacy === 'anonymous' ? 'Ẩn danh' : current.name || 'Không rõ'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">{current.privacy === 'anonymous' ? '—' : (current.phone || 'Không có')}</p>
                </div>
              </div>

              {current.location && (
                <div className="flex items-start gap-1.5 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <span>{current.location}</span>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-1">Nội dung phản ánh</p>
                <p className="text-sm leading-relaxed">{current.content}</p>
              </div>

              {((current.media && current.media.length > 0) || (current.images && current.images.length > 0)) && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Ảnh/video người gửi đính kèm</p>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {(current.media?.length ? current.media : current.images.map((url: string, i: number) => ({ id: String(i), name: `media-${i + 1}`, url }))).map((file: any) => {
                      const isVideo = /\.(mp4|mov|webm|avi)$/i.test(file.name || file.url);
                      return isVideo ? (
                        <video key={file.id} src={file.url} className="aspect-square w-full rounded-md object-cover border border-border" controls />
                      ) : (
                        <img key={file.id} src={file.url} alt={file.name || 'media'} className="aspect-square w-full rounded-md object-cover border border-border" />
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Trạng thái xử lý</Label>
                  <Select value={current.status} onChange={e => handleUpdate({ status: e.target.value })}>
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="resolved">Đã xử lý</option>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Cán bộ phụ trách</Label>
                  <Select value={current.assignedStaff || ''} onChange={e => handleUpdate({ assignedStaff: e.target.value })}>
                    <option value="">Chưa phân công</option>
                    {mockStaff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Ghi chú xử lý (nội bộ)</Label>
                <Textarea placeholder="Ghi chú tiến độ, hướng xử lý..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Đóng</Button>
              <Button onClick={() => setIsDialogOpen(false)}>Lưu thay đổi</Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </Layout>
  );
}
