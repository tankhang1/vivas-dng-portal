import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button, Input } from '../components/ui';
import { mockQueue } from '../data/mock';
import { Volume2, PlaySquare, CheckCircle, SkipForward } from 'lucide-react';

export default function Queue() {
  const [queue, setQueue] = useState(mockQueue);

  const handleCallNext = () => {
    const nextInLine = queue.find(q => q.status === 'đang chờ');
    if (nextInLine) {
      setQueue(queue.map(q => q.number === nextInLine.number ? { ...q, status: 'đang phục vụ' } : q));
    }
  };

  const handleUpdateStatus = (number: string, status: string) => {
    setQueue(queue.map(q => q.number === number ? { ...q, status } : q));
  };

  const activeServing = queue.filter(q => q.status === 'đang phục vụ');
  const waiting = queue.filter(q => q.status === 'đang chờ');

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hệ thống xếp hàng</h1>
            <p className="text-muted-foreground mt-1">Điều phối số thứ tự giao dịch tại một cửa.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 text-primary border-primary">
              <Volume2 className="h-4 w-4" /> Đọc lại số
            </Button>
            <Button className="gap-2" onClick={handleCallNext} disabled={waiting.length === 0}>
              <PlaySquare className="h-4 w-4" /> Gọi số tiếp theo
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {activeServing.map((serving, i) => (
            <Card key={i} className="border-primary/50 shadow-md bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>Quầy {i + 1} - {serving.service}</span>
                  <Badge variant="success" className="animate-pulse">Đang phục vụ</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-black text-primary mb-4">{serving.number}</div>
                <div className="flex gap-2">
                  <Button className="flex-1 gap-2" variant="outline" onClick={() => handleUpdateStatus(serving.number, 'hoàn tất')}>
                    <CheckCircle className="h-4 w-4 text-green-600" /> Xong
                  </Button>
                  <Button className="flex-1 gap-2" variant="outline" onClick={() => handleUpdateStatus(serving.number, 'bỏ qua')}>
                    <SkipForward className="h-4 w-4 text-red-600" /> Bỏ qua
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {activeServing.length === 0 && (
            <Card className="md:col-span-3 border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <PlaySquare className="h-10 w-10 mb-2 opacity-50" />
                <p>Chưa có quầy nào đang phục vụ.</p>
                <Button variant="link" onClick={handleCallNext} disabled={waiting.length === 0}>Bắt đầu gọi số</Button>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách chờ ({waiting.length} số)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Số thứ tự</TableHead>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Thời gian chờ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.filter(q => q.status !== 'hoàn tất' && q.status !== 'bỏ qua').map((item) => (
                  <TableRow key={item.number}>
                    <TableCell className="font-bold text-lg">{item.number}</TableCell>
                    <TableCell>{item.service}</TableCell>
                    <TableCell className={item.waitTime > '10p' ? 'text-red-500 font-medium' : ''}>{item.waitTime}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'đang chờ' ? 'warning' : 'success'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.status === 'đang chờ' && (
                        <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(item.number, 'đang phục vụ')}>Gọi ngay</Button>
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
