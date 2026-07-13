import React from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button } from '../components/ui';
import { mockNotifications } from '../data/mock';
import { BellRing, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Notifications() {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hệ thống thông báo</h1>
            <p className="text-muted-foreground mt-1">Lịch sử gửi thông báo SMS, Zalo, App cho công dân.</p>
          </div>
          <Button className="gap-2">
            <BellRing className="h-4 w-4" /> Gửi thông báo thủ công
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lịch sử gửi tự động</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thời gian gửi</TableHead>
                  <TableHead>Nội dung thông báo</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockNotifications.map((noti) => (
                  <TableRow key={noti.id}>
                    <TableCell className="whitespace-nowrap">{noti.sentAt}</TableCell>
                    <TableCell className="font-medium max-w-[400px] truncate">{noti.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{noti.type === 'appointment' ? 'Lịch hẹn' : 'Tin tức'}</Badge>
                    </TableCell>
                    <TableCell>
                      {noti.status === 'success' ? (
                        <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                          <CheckCircle2 className="h-4 w-4" /> Thành công
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                          <AlertCircle className="h-4 w-4" /> Thất bại
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
