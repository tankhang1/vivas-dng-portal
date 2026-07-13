import React from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../components/ui';
import { PieChart, Download, TrendingUp, TrendingDown } from 'lucide-react';

export default function Reports() {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Báo cáo & Thống kê</h1>
            <p className="text-muted-foreground mt-1">Phân tích dữ liệu hoạt động của hệ thống.</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Xuất báo cáo (Excel)
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tỷ lệ hoàn tất thủ tục đúng hạn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">94.5%</div>
              <p className="text-xs text-green-600 flex items-center mt-1 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" /> +2.1% so với tháng trước
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Phản ánh đã giải quyết</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">128/150</div>
              <p className="text-xs text-muted-foreground mt-1">Trong tháng 10/2023</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Mức độ hài lòng của công dân</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">4.8/5.0</div>
              <p className="text-xs text-muted-foreground mt-1">Dựa trên 240 đánh giá</p>
            </CardContent>
          </Card>
        </div>

        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" /> 
              Biểu đồ hồ sơ theo phòng ban (Minh họa)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[300px] border-t bg-slate-50/50">
            <div className="text-center text-muted-foreground">
              <div className="w-48 h-48 rounded-full border-8 border-primary/20 border-t-primary mx-auto mb-4 animate-[spin_3s_linear_infinite]" />
              <p>Biểu đồ đang được tích hợp dữ liệu thực...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
