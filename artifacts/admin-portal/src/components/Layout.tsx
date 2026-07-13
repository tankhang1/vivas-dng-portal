import React from 'react';
import { Link, useLocation } from 'wouter';
import { LayoutDashboard, Users, Building, ShieldCheck, FileText, FileCheck2, CalendarDays, Ticket, MessageSquare, BookUser, PhoneCall, Bell, PieChart, Settings, LogOut, Menu } from 'lucide-react';
import { cn } from './ui';

const navItems = [
  { name: 'Tổng quan', href: '/', icon: LayoutDashboard },
  { name: 'Cán bộ', href: '/staff', icon: Users },
  { name: 'Phòng ban', href: '/departments', icon: Building },
  { name: 'Vai trò', href: '/roles', icon: ShieldCheck },
  { name: 'Tin tức', href: '/news', icon: FileText },
  { name: 'Thủ tục hành chính', href: '/procedures', icon: FileCheck2 },
  { name: 'Lịch hẹn', href: '/appointments', icon: CalendarDays },
  { name: 'Xếp hàng', href: '/queue', icon: Ticket },
  { name: 'Phản ánh', href: '/feedback', icon: MessageSquare },
  { name: 'Công dân', href: '/citizens', icon: BookUser },
  { name: 'Liên hệ khẩn', href: '/emergency-contacts', icon: PhoneCall },
  { name: 'Thông báo', href: '/notifications', icon: Bell },
  { name: 'Báo cáo', href: '/reports', icon: PieChart },
  { name: 'Cài đặt', href: '/settings', icon: Settings },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 flex-col border-r bg-sidebar md:flex">
        <div className="flex h-16 shrink-0 items-center border-b px-6">
          <div className="flex items-center gap-2 font-bold text-lg text-primary">
            <Building className="h-6 w-6" />
            <span>Cổng Quản Trị</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}>
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              NA
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-medium">Nguyễn Văn A</p>
              <p className="truncate text-xs text-muted-foreground">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header - Mobile & Desktop */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-4 md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-foreground">
              <Menu className="h-6 w-6" />
            </button>
            <div className="font-bold text-primary flex items-center gap-2">
              <Building className="h-5 w-5" />
              <span>Cổng Quản Trị</span>
            </div>
          </div>
          <div className="hidden md:flex flex-1">
            <h1 className="text-lg font-semibold text-foreground">
              UBND Phường X, Quận Y
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline-flex text-sm text-muted-foreground">
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline-block">Đăng xuất</span>
            </Link>
          </div>
        </header>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b bg-sidebar absolute top-16 left-0 right-0 z-50 shadow-lg max-h-[80vh] overflow-auto">
            <nav className="grid gap-1 p-4">
              {navItems.map((item) => {
                const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
                return (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                      isActive ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
