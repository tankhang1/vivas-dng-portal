import React from 'react';
import { useLocation } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useLoginMutation } from '@/features/auth/hooks/auth.hook';
import { Form } from '@/shared/components/ui/form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
} from '@/shared/components/ui';
import { BrandMark } from '@/shared/components/BrandMark';
import { FormInputField } from '@/shared/components/FormInputField';

const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const defaultValues: LoginFormValues = {
  username: 'admin',
  password: 'Viv@s@2026',
};

export default function Login() {
  const [, setLocation] = useLocation();
  const loginMutation = useLoginMutation();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });
  const { control, handleSubmit } = form;

  const handleLogin = async (values: LoginFormValues) => {
    await loginMutation.mutateAsync(values);
    setLocation('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <Card className="w-full max-w-md relative z-10 shadow-xl border-t-4 border-t-primary">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto">
            <BrandMark
              compact
              showText={false}
              className="justify-center"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Cổng Quản Trị Hệ Thống</CardTitle>
            <CardDescription className="text-base mt-1">Ủy ban Nhân dân Xã Tây Hồ</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
              <FormInputField
                control={control}
                name="username"
                label="Tên đăng nhập"
                required
                inputClassName="h-11"
                inputProps={{
                  placeholder: 'Nhập tên đăng nhập...',
                }}
              />

              <FormInputField
                control={control}
                name="password"
                label="Mật khẩu"
                required
                inputClassName="h-11"
                inputProps={{
                  type: 'password',
                  placeholder: '••••••••',
                }}
              />

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng Nhập'}
              </Button>
              {loginMutation.isError ? (
                <p className="text-sm text-red-600">{loginMutation.error.message}</p>
              ) : null}
            </form>
          </Form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Hệ thống nội bộ dành riêng cho Cán bộ, Công chức</p>
            <p className="mt-1">Vui lòng liên hệ IT nếu quên mật khẩu.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
