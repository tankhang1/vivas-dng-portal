import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "@/shared/components/ui";

const passwordFormSchema = z
  .object({
    username: z.string().trim().min(1, "Vui lòng nhập tên đăng nhập"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    password_update: z.string().min(1, "Vui lòng nhập mật khẩu mới"),
  })
  .refine((values) => values.password !== values.password_update, {
    message: "Mật khẩu mới phải khác mật khẩu hiện tại",
    path: ["password_update"],
  });

export type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const emptyPasswordForm: PasswordFormValues = {
  username: "",
  password: "",
  password_update: "",
};

type ChangePasswordDialogProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  onContinue: (values: PasswordFormValues) => void;
};

export function ChangePasswordDialog({
  open,
  title = "Đổi mật khẩu",
  onClose,
  onContinue,
}: ChangePasswordDialogProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: emptyPasswordForm,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(emptyPasswordForm);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
  }, [form, open]);

  const handleSubmit = (values: PasswordFormValues) => {
    onContinue({ ...values, username: values.username.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Nhập thông tin tài khoản cần đổi mật khẩu.
        </p>
        <label className="flex flex-col gap-2 text-sm font-medium">
          <span>
            Tên đăng nhập <span className="text-destructive">*</span>
          </span>
          <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <>
                <Input {...field} autoComplete="username" aria-invalid={fieldState.invalid} />
                {fieldState.error && (
                  <span className="text-sm font-normal text-destructive">
                    {fieldState.error.message}
                  </span>
                )}
              </>
            )}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          <span>
            Mật khẩu hiện tại <span className="text-destructive">*</span>
          </span>
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <>
                <div className="relative">
                  <Input
                    {...field}
                    type={showCurrentPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="pr-10"
                    aria-invalid={fieldState.invalid}
                  />
                  <PasswordVisibilityButton
                    isVisible={showCurrentPassword}
                    onClick={() => setShowCurrentPassword((show) => !show)}
                  />
                </div>
                {fieldState.error && <FieldError message={fieldState.error.message} />}
              </>
            )}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          <span>
            Mật khẩu mới <span className="text-destructive">*</span>
          </span>
          <Controller
            control={form.control}
            name="password_update"
            render={({ field, fieldState }) => (
              <>
                <div className="relative">
                  <Input
                    {...field}
                    type={showNewPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="pr-10"
                    aria-invalid={fieldState.invalid}
                  />
                  <PasswordVisibilityButton
                    isVisible={showNewPassword}
                    onClick={() => setShowNewPassword((show) => !show)}
                  />
                </div>
                {fieldState.error && <FieldError message={fieldState.error.message} />}
              </>
            )}
          />
        </label>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit">Tiếp tục</Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

function FieldError({ message }: { message?: string }) {
  return <span className="text-sm font-normal text-destructive">{message}</span>;
}

function PasswordVisibilityButton({
  isVisible,
  onClick,
}: {
  isVisible: boolean;
  onClick: () => void;
}) {
  const label = isVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
      onClick={onClick}
      title={label}
    >
      {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      <span className="sr-only">{label}</span>
    </Button>
  );
}
