import React from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Textarea } from '../components/ui';
import { Save } from 'lucide-react';

export default function Settings() {
  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cài đặt Hệ thống</h1>
            <p className="text-muted-foreground mt-1">Cấu hình thông tin cơ bản của đơn vị.</p>
          </div>
          <Button className="gap-2">
            <Save className="h-4 w-4" /> Lưu thay đổi
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin Đơn vị hành chính</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label>Tên Cơ quan / Đơn vị</Label>
              <Input defaultValue="UBND Phường X, Quận Y" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Số điện thoại Hotline</Label>
                <Input defaultValue="028 1111 2222" />
              </div>
              <div className="grid gap-2">
                <Label>Email liên hệ</Label>
                <Input defaultValue="contact@phuongx.gov.vn" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Địa chỉ trụ sở</Label>
              <Textarea defaultValue="Số 123 Đường ABC, Phường X, Quận Y, TP.HCM" />
            </div>
            <div className="grid gap-2">
              <Label>Thời gian làm việc (Hiển thị cho công dân)</Label>
              <Input defaultValue="Sáng: 07:30 - 11:30 | Chiều: 13:00 - 17:00 (Từ Thứ 2 đến Thứ 6)" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cấu hình Hệ thống</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base font-semibold">Tự động duyệt lịch hẹn trống</Label>
                <p className="text-sm text-muted-foreground">Hệ thống sẽ tự động xác nhận nếu khung giờ còn trống.</p>
              </div>
              <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                <div className="h-4 w-4 bg-white rounded-full absolute right-1 top-1" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <Label className="text-base font-semibold">Bảo trì hệ thống</Label>
                <p className="text-sm text-muted-foreground">Tạm thời vô hiệu hóa Cổng dịch vụ công của người dân.</p>
              </div>
              <div className="h-6 w-11 bg-slate-300 rounded-full relative cursor-pointer">
                <div className="h-4 w-4 bg-white rounded-full absolute left-1 top-1 shadow-sm" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
