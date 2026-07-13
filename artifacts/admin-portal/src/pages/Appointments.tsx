import React, { useMemo, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button, Input, Dialog, DialogHeader, DialogTitle, DialogFooter, Label, Select, Pagination } from '../components/ui';
import { mockAppointments, appointmentServices, mockStaff } from '../data/mock';
import { Search, Eye, Trash2, CalendarClock, CheckCircle2, Clock, Ban, CalendarCheck } from 'lucide-react';

const PAGE_SIZE = 5;

const statusMeta: Record<string, { label: string; variant: 'secondary' | 'warning' | 'success' | 'destructive'; icon: any }> = {
  pending: { label: 'Chờ xác nhận', variant: 'secondary', icon: Clock },
  confirmed: { label: 'Đã xác nhận', variant: 'warning', icon: CalendarCheck },
  completed: { label: 'Hoàn thành', variant: 'success', icon: CheckCircle2 },
  cancelled: { label: 'Đã hủy', variant: 'destructive', icon: Ban },
};

export default function Appointments() {
  const [items, setItems] = useState(mockAppointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [current, setCurrent] = useState<any>(null);

  const filtered = useMemo(() => {
    return items.filter(a =>
      (a.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) || a.phone.includes(searchTerm)) &&
      (serviceFilter === 'all' || a.service === serviceFilter) &&
      (statusFilter === 'all' || a.status === statusFilter)
    );
  }, [items, searchTerm, serviceFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleOpenDetail = (item: any) => {
    setCurrent(item);
    setIsDialogOpen(true);
  };

  const handleUpdate = (updates: Partial<any>) => {
    const updated = { ...current, ...updates };
    setCurrent(updated);
    setItems(items.map(a => (a.id === updated.id ? updated : a)));
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) {
      setItems(items.filter(a => a.id !== id));
      if (current?.id === id) setIsDialogOpen(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Đặt lịch hẹn</h1>
          <p className="text-muted-foreground mt-1">Quản lý lịch hẹn làm việc do công dân đặt qua ứng dụng.</p>
        </div>

        <Card>
          <CardHeader className="pb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên hoặc số điện thoại..."
                className="pl-9"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select className="w-[220px]" value={serviceFilter} onChange={e => { setServiceFilter(e.target.value); setPage(1); }}>
                <option value="all">Tất cả dịch vụ</option>
                {appointmentServices.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
              <Select className="w-[160px]" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Người đặt</TableHead>
                  <TableHead>Ngày hẹn</TableHead>
                  <TableHead>Giờ hẹn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((item) => {
                  const meta = statusMeta[item.status];
                  return (
                    <TableRow key={item.id} className="cursor-pointer" onClick={() => handleOpenDetail(item)}>
                      <TableCell className="font-medium max-w-[220px] truncate">{item.service}</TableCell>
                      <TableCell>
                        <div>
                          <p>{item.citizenName}</p>
                          <p className="text-xs text-muted-foreground">{item.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" /> {item.time}
                        </div>
                      </TableCell>
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
                      Không tìm thấy lịch hẹn nào.
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
              <DialogTitle>{current.service}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Người đặt lịch</p>
                  <p className="font-medium">{current.citizenName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">{current.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Ngày hẹn</p>
                  <p className="font-medium">{current.date}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Giờ hẹn</p>
                  <p className="font-medium">{current.time}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Nội dung cần hỗ trợ</p>
                <p className="text-sm leading-relaxed">{current.content || 'Không có mô tả.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Trạng thái</Label>
                  <Select value={current.status} onChange={e => handleUpdate({ status: e.target.value })}>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Cán bộ tiếp nhận</Label>
                  <Select value={current.assignedStaff || ''} onChange={e => handleUpdate({ assignedStaff: e.target.value })}>
                    <option value="">Chưa phân công</option>
                    {mockStaff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </Select>
                </div>
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
