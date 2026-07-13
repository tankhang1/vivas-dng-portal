import React from 'react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Button, Label } from '../components/ui';
import { Building } from 'lucide-react';

export default function Login() {
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login logic
    setLocation('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md relative z-10 shadow-xl border-t-4 border-t-primary">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Building className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Cổng Quản Trị Hệ Thống</CardTitle>
            <CardDescription className="text-base mt-1">UBND Phường X, Quận Y</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input id="username" placeholder="Nhập tên đăng nhập..." required className="h-11" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
              </div>
              <Input id="password" type="password" placeholder="••••••••" required className="h-11" />
            </div>
            <Button type="submit" className="w-full h-11 text-base font-semibold">
              Đăng Nhập
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Hệ thống nội bộ dành riêng cho Cán bộ, Công chức</p>
            <p className="mt-1">Vui lòng liên hệ IT nếu quên mật khẩu.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
