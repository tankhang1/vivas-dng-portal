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

const divisionFormSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên lĩnh vực"),
  note: z.string().min(1, "Vui lòng nhập mô tả"),
});

export type DivisionFormValues = z.infer<typeof divisionFormSchema>;

const defaultValues = (): DivisionFormValues => ({
  name: "",
  note: "",
});

type DivisionFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  initialValues: DivisionFormValues | null;
  isSaving: boolean;
  onSubmit: (values: DivisionFormValues) => void;
};

export function DivisionFormDialog({
  open,
  onOpenChange,
  isEdit,
  initialValues,
  isSaving,
  onSubmit,
}: DivisionFormDialogProps) {
  const form = useForm<DivisionFormValues>({
    resolver: zodResolver(divisionFormSchema),
    defaultValues: defaultValues(),
  });
  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (open) {
      reset(initialValues ?? defaultValues());
    }
  }, [open, initialValues, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Chỉnh sửa lĩnh vực" : "Thêm lĩnh vực mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FormInputField control={control} name="name" label="Tên lĩnh vực" required />

            <FormField
              control={control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
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
              {isSaving ? "Đang lưu..." : "Lưu thông tin"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </Dialog>
  );
}
