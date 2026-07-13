import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button, Input, Select } from '../components/ui';
import { mockFeedback, mockDepartments } from '../data/mock';
import { Search, Eye, Filter } from 'lucide-react';

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState(mockFeedback);
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = feedbacks.filter(f => filterStatus === 'all' || f.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mới': return 'destructive';
      case 'đang xử lý': return 'warning';
      case 'hoàn tất': return 'success';
      default: return 'secondary';
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, status: newStatus } : f));
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Phản ánh kiến nghị</h1>
            <p className="text-muted-foreground mt-1">Quản lý phản ánh, kiến nghị từ người dân.</p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm theo tiêu đề hoặc người gửi..." className="pl-9" />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-40">
                <option value="all">Tất cả trạng thái</option>
                <option value="mới">Mới</option>
                <option value="đang xử lý">Đang xử lý</option>
                <option value="hoàn tất">Hoàn tất</option>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày gửi</TableHead>
                  <TableHead>Người phản ánh</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Lĩnh vực</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((fb) => (
                  <TableRow key={fb.id}>
                    <TableCell className="whitespace-nowrap">{fb.date}</TableCell>
                    <TableCell className="font-medium">{fb.citizen}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{fb.title}</TableCell>
                    <TableCell>{fb.category}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(fb.status) as any}>{fb.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-2">
                      <Select 
                        value={fb.status} 
                        onChange={(e) => handleStatusChange(fb.id, e.target.value)}
                        className="w-32 h-8 text-xs"
                      >
                        <option value="mới">Mới</option>
                        <option value="đang tiếp nhận">Tiếp nhận</option>
                        <option value="đang xử lý">Đang xử lý</option>
                        <option value="hoàn tất">Hoàn tất</option>
                        <option value="từ chối">Từ chối</option>
                      </Select>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Không có dữ liệu.
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
