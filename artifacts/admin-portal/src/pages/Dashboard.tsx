import React, { useMemo } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '../components/ui';
import { mockStaff, mockDepartments, mockRoles, mockNews, mockCitizens, mockRoutedItems, mockRoutingRules, mockFeedback, mockAppointments } from '../data/mock';
import {
  Users, Building, FileText, BookUser, Waypoints, ArrowRight, CheckCircle2, Globe, FileEdit,
  AlertTriangle, UserX, ShieldAlert, MessageSquareWarning, CalendarClock,
} from 'lucide-react';
import { Link } from 'wouter';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const STATUS_COLORS = { published: '#16a34a', draft: '#94a3b8' };

export default function Dashboard() {
  const activeStaff = mockStaff.filter(s => s.status === 'active').length;
  const inactiveStaff = mockStaff.filter(s => s.status === 'inactive');
  const publishedNews = mockNews.filter(n => n.status === 'published').length;
  const draftNews = mockNews.filter(n => n.status === 'draft').length;
  const urgentDraftNews = mockNews.filter(n => n.category === 'khan-cap' && n.status === 'draft');
  const unmanagedDepartments = mockDepartments.filter(d => !d.manager);
  const totalInteractions = mockCitizens.reduce((sum, c) => sum + c.interactions, 0);
  const uncoveredFields = mockRoutingRules.filter(r => !r.staff);
  const pendingFeedback = mockFeedback.filter(f => f.status === 'pending');
  const pendingAppointments = mockAppointments.filter(a => a.status === 'pending');

  const alerts = [
    pendingFeedback.length > 0 && {
      title: 'Phản ánh chưa được xử lý',
      description: `${pendingFeedback.length} phản ánh của công dân đang chờ xử lý, cần phân công cán bộ tiếp nhận.`,
      icon: MessageSquareWarning,
      href: '/feedback',
      tone: 'danger' as const,
    },
    pendingAppointments.length > 0 && {
      title: 'Lịch hẹn chờ xác nhận',
      description: `${pendingAppointments.length} lịch hẹn làm việc đang chờ xác nhận từ cán bộ phụ trách.`,
      icon: CalendarClock,
      href: '/appointments',
      tone: 'warning' as const,
    },
    urgentDraftNews.length > 0 && {
      title: 'Bản tin khẩn cấp chưa xuất bản',
      description: `${urgentDraftNews.length} bản tin khẩn cấp đang ở dạng nháp, cần duyệt và đăng ngay.`,
      icon: AlertTriangle,
      href: '/news',
      tone: 'danger' as const,
    },
    inactiveStaff.length > 0 && {
      title: 'Cán bộ đang tạm khóa',
      description: `${inactiveStaff.length} tài khoản cán bộ (${inactiveStaff.map(s => s.name).join(', ')}) đang tạm khóa, cần rà soát.`,
      icon: UserX,
      href: '/staff',
      tone: 'warning' as const,
    },
    unmanagedDepartments.length > 0 && {
      title: 'Phòng ban chưa có trưởng bộ phận',
      description: `${unmanagedDepartments.length} phòng ban chưa được phân công trưởng bộ phận.`,
      icon: ShieldAlert,
      href: '/departments',
      tone: 'warning' as const,
    },
    uncoveredFields.length > 0 && {
      title: 'Lĩnh vực chưa có cán bộ tiếp nhận',
      description: `${uncoveredFields.length} lĩnh vực điều phối chưa gán cán bộ xử lý.`,
      icon: Waypoints,
      href: '/routing',
      tone: 'warning' as const,
    },
  ].filter(Boolean) as { title: string; description: string; icon: any; href: string; tone: 'danger' | 'warning' }[];

  const stats = [
    { label: 'Cán bộ đang hoạt động', value: `${activeStaff}/${mockStaff.length}`, icon: Users, href: '/staff', color: 'text-blue-600 bg-blue-50' },
    { label: 'Phản ánh chờ xử lý', value: `${pendingFeedback.length}/${mockFeedback.length}`, icon: MessageSquareWarning, href: '/feedback', color: 'text-red-600 bg-red-50' },
    { label: 'Lịch hẹn chờ xác nhận', value: `${pendingAppointments.length}/${mockAppointments.length}`, icon: CalendarClock, href: '/appointments', color: 'text-purple-600 bg-purple-50' },
    { label: 'Bản tin đã xuất bản', value: `${publishedNews}/${mockNews.length}`, icon: FileText, href: '/news', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Công dân trong danh bạ', value: mockCitizens.length, icon: BookUser, href: '/citizens', color: 'text-amber-600 bg-amber-50' },
    { label: 'Thông tin đã điều phối', value: mockRoutedItems.length, icon: Waypoints, href: '/routing', color: 'text-rose-600 bg-rose-50' },
  ];

  const secondaryStats = [
    { label: 'Phòng ban', value: mockDepartments.length, href: '/departments', icon: Building },
    { label: 'Vai trò hệ thống', value: mockRoles.length, href: '/roles', icon: ShieldAlert },
    { label: 'Lượt tương tác công dân', value: totalInteractions, href: '/citizens', icon: BookUser },
  ];

  const staffByDept = useMemo(
    () => mockDepartments.map(d => ({ name: d.name, soLuong: mockStaff.filter(s => s.department === d.name).length })),
    []
  );

  const newsByStatus = useMemo(() => ([
    { name: 'Đã xuất bản', value: publishedNews, key: 'published' },
    { name: 'Bản nháp', value: draftNews, key: 'draft' },
  ]), [publishedNews, draftNews]);

  const recentNews = [...mockNews].slice(-4).reverse();
  const recentRouted = [...mockRoutedItems].slice(0, 4);

  const toneStyles = {
    danger: 'border-red-200 bg-red-50',
    warning: 'border-amber-200 bg-amber-50',
  };
  const toneIconStyles = {
    danger: 'text-red-600 bg-red-100',
    warning: 'text-amber-600 bg-amber-100',
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
          <p className="text-muted-foreground mt-1">Tình hình hoạt động và các nội dung cần xử lý của Ủy ban Nhân dân Xã Tây Hồ.</p>
        </div>

        {alerts.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Cần xử lý</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {alerts.map((alert) => (
                <Link key={alert.title} href={alert.href}>
                  <div className={`flex items-start gap-3 rounded-lg border p-4 transition-shadow hover:shadow-sm cursor-pointer ${toneStyles[alert.tone]}`}>
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${toneIconStyles[alert.tone]}`}>
                      <alert.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">{alert.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{alert.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

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

        <div className="flex flex-wrap gap-3">
          {secondaryStats.map((s) => (
            <Link key={s.label} href={s.href}>
              <div className="flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm hover:bg-slate-50 cursor-pointer">
                <s.icon className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{s.value}</span>
                <span className="text-muted-foreground">{s.label}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Nhân sự theo phòng ban</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={staffByDept} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="soLuong" name="Số cán bộ" fill="#1d4ed8" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tin tức theo trạng thái</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={newsByStatus} dataKey="value" nameKey="name" cx="50%" cy="45%" innerRadius={45} outerRadius={70} paddingAngle={3} isAnimationActive={false}>
                    {newsByStatus.map((entry) => (
                      <Cell key={entry.key} fill={STATUS_COLORS[entry.key as keyof typeof STATUS_COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={32} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
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
      </div>
    </Layout>
  );
}
