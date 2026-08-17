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
  Textarea,
} from "../../../shared/components/ui";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../shared/components/ui/form";
import { FormInputField } from "../../../shared/components/FormInputField";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên danh mục"),
  path: z.string().min(1, "Vui lòng nhập đường dẫn"),
  orderNumber: z.coerce
    .number({ invalid_type_error: "Vui lòng nhập thứ tự hiển thị" })
    .min(1, "Vui lòng nhập thứ tự hiển thị"),
  note: z.string().min(1, "Vui lòng nhập ghi chú"),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const defaultValues = (): CategoryFormValues => ({
  name: "",
  path: "",
  orderNumber: 0,
  note: "",
});

type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  typeLabel: string;
  initialValues: CategoryFormValues | null;
  isSaving: boolean;
  onSubmit: (values: CategoryFormValues) => void;
};

export function CategoryFormDialog({
  open,
  onOpenChange,
  isEdit,
  typeLabel,
  initialValues,
  isSaving,
  onSubmit,
}: CategoryFormDialogProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: defaultValues(),
  });
  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (open) {
      reset(initialValues ?? defaultValues());
    }
  }, [open, initialValues, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-2xl">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Chỉnh sửa danh mục" : `Tạo danh mục ${typeLabel} mới`}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Danh mục thuộc nhóm{" "}
              <span className="font-medium text-foreground">{typeLabel}</span>
              .
            </p>
          </DialogHeader>

          <div className="grid gap-4">
            <FormInputField
              control={control}
              name="name"
              label="Tên danh mục"
              required
              inputProps={{ placeholder: "Nhập tên danh mục" }}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormInputField
                control={control}
                name="path"
                label="Đường dẫn"
                required
                inputProps={{ placeholder: "Nhập đường dẫn" }}
              />
              <FormInputField
                control={control}
                name="orderNumber"
                label="Thứ tự hiển thị"
                required
                inputProps={{ type: "number" }}
              />
            </div>

            <FormField
              control={control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Ghi chú về danh mục..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
              {isSaving ? "Đang lưu..." : "Lưu danh mục"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </Dialog>
  );
}
