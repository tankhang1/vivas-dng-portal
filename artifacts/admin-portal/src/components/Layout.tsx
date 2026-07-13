import React from 'react';
import { Link, useLocation } from 'wouter';
import { Users, Building, ShieldCheck, FileText, BookUser, Waypoints, LogOut, Menu, Landmark, LayoutDashboard } from 'lucide-react';
import { cn } from './ui';

const navItems = [
  { name: 'Tổng quan', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Vai trò', href: '/roles', icon: ShieldCheck },
  { name: 'Phòng ban', href: '/departments', icon: Building },
  { name: 'Cán bộ', href: '/staff', icon: Users },
  { name: 'Tin tức', href: '/news', icon: FileText },
  { name: 'Công dân', href: '/citizens', icon: BookUser },
  { name: 'Điều phối', href: '/routing', icon: Waypoints },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-64 flex-col bg-sidebar md:flex">
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
            <Landmark className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="font-bold text-sm text-white">Cổng Quản Trị</p>
            <p className="text-[11px] text-sidebar-foreground/70">UBND Xã Tây Hồ</p>
          </div>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <p className="px-5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            Quản lý hệ thống
          </p>
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => {
              const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}>
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm">
            <div className="h-9 w-9 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary font-bold">
              NA
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate font-medium text-white">Nguyễn Văn A</p>
              <p className="truncate text-xs text-sidebar-foreground/60">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header - Mobile & Desktop */}
        <header className="flex h-16 shrink-0 flex-col shadow-sm">
          <div className="h-1 w-full bg-gradient-to-r from-primary via-red-600 to-primary" />
          <div className="flex flex-1 items-center justify-between bg-white border-b border-border px-4 md:px-6">
            <div className="flex items-center gap-4 md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-foreground">
                <Menu className="h-6 w-6" />
              </button>
              <div className="font-bold text-primary flex items-center gap-2">
                <Landmark className="h-5 w-5" />
                <span>Cổng Quản Trị</span>
              </div>
            </div>
            <div className="hidden md:flex flex-1">
              <h1 className="text-lg font-semibold text-foreground">
                Ủy ban Nhân dân Xã Tây Hồ
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
          </div>
        </header>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-sidebar-border bg-sidebar absolute top-16 left-0 right-0 z-50 shadow-lg max-h-[80vh] overflow-auto">
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
                      isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
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
