import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button, Input, Dialog, DialogHeader, DialogTitle, DialogFooter, Label, Select } from '../components/ui';
import { mockAppointments, mockDepartments } from '../data/mock';
import { Search, Filter, Calendar as CalIcon, Edit2, CheckCircle2, XCircle } from 'lucide-react';

export default function Appointments() {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = appointments.filter(a => 
    a.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.procedure.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'mới': return <Badge variant="warning">Mới</Badge>;
      case 'đang xác nhận': return <Badge variant="secondary">Đang xác nhận</Badge>;
      case 'đã xác nhận': return <Badge variant="success">Đã xác nhận</Badge>;
      case 'hoàn tất': return <Badge variant="outline" className="border-green-500 text-green-600">Hoàn tất</Badge>;
      case 'hủy': return <Badge variant="destructive">Đã hủy</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lịch hẹn dịch vụ công</h1>
            <p className="text-muted-foreground mt-1">Quản lý lịch hẹn người dân đặt trước qua Cổng dịch vụ công.</p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center gap-4 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm tên công dân, loại thủ tục..." 
                className="pl-9"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select className="w-40">
                <option value="all">Tất cả phòng ban</option>
                {mockDepartments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <CalIcon className="h-4 w-4 text-muted-foreground" />
              <Input type="date" className="w-40" defaultValue="2023-10-25" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày giờ</TableHead>
                  <TableHead>Công dân</TableHead>
                  <TableHead>Thủ tục</TableHead>
                  <TableHead>Phòng ban</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác nhanh</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="whitespace-nowrap font-medium">
                      {app.time}<br/><span className="text-xs font-normal text-muted-foreground">{app.date}</span>
                    </TableCell>
                    <TableCell>{app.citizenName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{app.procedure}</TableCell>
                    <TableCell>{app.department}</TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2 h-full py-4">
                      {app.status === 'mới' && (
                        <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => handleStatusChange(app.id, 'đã xác nhận')}>
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Duyệt
                        </Button>
                      )}
                      {app.status !== 'hoàn tất' && app.status !== 'hủy' && (
                        <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleStatusChange(app.id, 'hủy')}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">Chi tiết</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Không có lịch hẹn nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
