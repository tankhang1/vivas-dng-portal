import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '../components/ui';
import { Layout } from '../components/Layout';
import { Users, FileText, CalendarDays, MessageSquare, AlertTriangle } from 'lucide-react';
import { mockAppointments, mockFeedback, mockQueue } from '../data/mock';

export default function Dashboard() {
  const pendingAppointments = mockAppointments.filter(a => a.status === 'mới').length;
  const newFeedbacks = mockFeedback.filter(f => f.status === 'mới' || f.status === 'đang xử lý').length;
  const inQueue = mockQueue.filter(q => q.status === 'đang chờ').length;

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
          <p className="text-muted-foreground mt-1">Tình hình xử lý công việc và dịch vụ công hôm nay.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lịch hẹn hôm nay</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAppointments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {pendingAppointments} lịch chưa xác nhận
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Phản ánh chưa xử lý</CardTitle>
              <MessageSquare className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{newFeedbacks}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Cần phản hồi sớm
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Đang chờ phục vụ</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{inQueue}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Người dân đang lấy số tại sảnh
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Hồ sơ quá hạn</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">2</div>
              <p className="text-xs text-muted-foreground mt-1">
                Yêu cầu phòng Địa chính xử lý
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Phản ánh gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFeedback.map(fb => (
                  <div key={fb.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-sm">{fb.title}</p>
                      <p className="text-xs text-muted-foreground">{fb.citizen} • {fb.category}</p>
                    </div>
                    <Badge variant={fb.status === 'mới' ? 'destructive' : fb.status === 'đang xử lý' ? 'warning' : 'success'}>
                      {fb.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Lịch hẹn sắp tới</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAppointments.map(app => (
                  <div key={app.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex h-10 w-10 flex-col items-center justify-center rounded bg-primary/10 text-primary">
                      <span className="text-xs font-bold">{app.time}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{app.citizenName}</p>
                      <p className="text-xs text-muted-foreground">{app.procedure}</p>
                    </div>
                    <Badge variant="outline">{app.department}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
