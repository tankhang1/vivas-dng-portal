import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../shared/components/ui";
import { Form } from "../../../../shared/components/ui/form";
import { FormInputField } from "../../../../shared/components/FormInputField";

const hotlineFormSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ").or(z.literal("")),
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
  potition: z.string().min(1, "Vui lòng nhập chức vụ"),
  department: z.string().min(1, "Vui lòng nhập đơn vị"),
});

export type HotlineFormValues = z.infer<typeof hotlineFormSchema>;

const defaultValues = (): HotlineFormValues => ({
  name: "",
  email: "",
  phone: "",
  potition: "",
  department: "",
});

type HotlineFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSaving: boolean;
  onSubmit: (values: HotlineFormValues) => void;
};

export function HotlineFormDialog({
  open,
  onOpenChange,
  isSaving,
  onSubmit,
}: HotlineFormDialogProps) {
  const form = useForm<HotlineFormValues>({
    resolver: zodResolver(hotlineFormSchema),
    defaultValues: defaultValues(),
  });
  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (open) {
      reset(defaultValues());
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-2xl">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Thêm số hotline</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField
                control={control}
                name="name"
                label="Họ tên"
                required
                inputProps={{ placeholder: "Nhập họ tên" }}
              />
              <FormInputField
                control={control}
                name="email"
                label="Email"
                inputProps={{ placeholder: "Nhập email" }}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField
                control={control}
                name="phone"
                label="Số điện thoại"
                required
                inputProps={{ placeholder: "Nhập số điện thoại" }}
              />
              <FormInputField
                control={control}
                name="potition"
                label="Chức vụ"
                required
                inputProps={{ placeholder: "Nhập chức vụ" }}
              />
            </div>

            <FormInputField
              control={control}
              name="department"
              label="Đơn vị"
              required
              inputProps={{ placeholder: "Nhập đơn vị" }}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Đang lưu..." : "Lưu hotline"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </Dialog>
  );
}
