import React from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '../components/ui';
import { mockStaff, mockDepartments, mockRoles, mockNews, mockCitizens, mockRoutedItems } from '../data/mock';
import { Users, Building, ShieldCheck, FileText, BookUser, Waypoints, ArrowRight, CheckCircle2, Globe, FileEdit } from 'lucide-react';
import { Link } from 'wouter';

export default function Dashboard() {
  const activeStaff = mockStaff.filter(s => s.status === 'active').length;
  const publishedNews = mockNews.filter(n => n.status === 'published').length;
  const draftNews = mockNews.filter(n => n.status === 'draft').length;
  const totalInteractions = mockCitizens.reduce((sum, c) => sum + c.interactions, 0);

  const stats = [
    { label: 'Cán bộ đang hoạt động', value: `${activeStaff}/${mockStaff.length}`, icon: Users, href: '/staff', color: 'text-blue-600 bg-blue-50' },
    { label: 'Phòng ban', value: mockDepartments.length, icon: Building, href: '/departments', color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Vai trò hệ thống', value: mockRoles.length, icon: ShieldCheck, href: '/roles', color: 'text-violet-600 bg-violet-50' },
    { label: 'Bản tin đã xuất bản', value: publishedNews, icon: FileText, href: '/news', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Công dân trong danh bạ', value: mockCitizens.length, icon: BookUser, href: '/citizens', color: 'text-amber-600 bg-amber-50' },
    { label: 'Thông tin đã điều phối', value: mockRoutedItems.length, icon: Waypoints, href: '/routing', color: 'text-rose-600 bg-rose-50' },
  ];

  const recentNews = [...mockNews].slice(-4).reverse();
  const recentRouted = [...mockRoutedItems].slice(0, 4);

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
          <p className="text-muted-foreground mt-1">Số liệu hoạt động chung của Ủy ban Nhân dân Xã Tây Hồ.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold leading-tight">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Bản tin gần đây</CardTitle>
              <Link href="/news" className="text-sm text-primary hover:underline">Xem tất cả</Link>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {recentNews.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.source} · {item.date}</p>
                  </div>
                  {item.status === 'published' ? (
                    <Badge variant="success" className="shrink-0 gap-1 bg-green-100 text-green-800"><Globe className="h-3 w-3" /> Xuất bản</Badge>
                  ) : (
                    <Badge variant="secondary" className="shrink-0 gap-1"><FileEdit className="h-3 w-3" /> Nháp</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Thông tin điều phối gần đây</CardTitle>
              <Link href="/routing" className="text-sm text-primary hover:underline">Xem tất cả</Link>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {recentRouted.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.sender} — {item.field}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{item.routedDepartment}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span>{item.routedStaff}</span>
                    </div>
                  </div>
                  <Badge variant="success" className="shrink-0 gap-1 bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3" /> Đã điều phối
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tương tác với công dân</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Tổng cộng <span className="font-semibold text-foreground">{totalInteractions}</span> lượt tương tác được ghi nhận từ{' '}
              <span className="font-semibold text-foreground">{mockCitizens.length}</span> công dân trong danh bạ.
              Hiện có <span className="font-semibold text-foreground">{draftNews}</span> bản tin đang ở dạng bản nháp chưa xuất bản.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
