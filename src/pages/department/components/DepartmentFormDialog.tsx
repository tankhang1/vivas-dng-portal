import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Select,
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import type { StaffItem } from "@/features/staff/types/get-staffs.response";
import type { DepartmentRecord } from "../types";

const departmentFormSchema = z.object({
  code: z.string(),
  name: z.string().min(1, "Vui lòng nhập tên phòng ban"),
  parentId: z.string().nullable(),
  manager: z.string(),
  managerId: z.number().nullable(),
  description: z.string(),
});

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

const defaultValues = (): DepartmentFormValues => ({
  code: "",
  name: "",
  parentId: null,
  manager: "",
  managerId: null,
  description: "",
});

type DepartmentFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  initialValues: DepartmentFormValues | null;
  excludeDepartmentId?: string;
  departments: DepartmentRecord[];
  managerOptions: StaffItem[];
  isSaving: boolean;
  onSubmit: (values: DepartmentFormValues) => void;
};

export function DepartmentFormDialog({
  open,
  onOpenChange,
  isEdit,
  initialValues,
  excludeDepartmentId,
  departments,
  managerOptions,
  isSaving,
  onSubmit,
}: DepartmentFormDialogProps) {
  const [isManagerPickerOpen, setIsManagerPickerOpen] = useState(false);

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: defaultValues(),
  });
  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (open) {
      reset(initialValues ?? defaultValues());
    }
  }, [open, initialValues, reset]);

  const parentOptions = departments.filter(
    (department) => department.id !== excludeDepartmentId,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-2xl">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <DialogHeader>
            <DialogTitle>
              {isEdit ? "Chỉnh sửa phòng ban" : "Thêm phòng ban mới"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Thiết lập phòng ban cha, tên và mã trong cây tổ chức.
            </p>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <FormInputField
                control={control}
                name="code"
                label="Mã (tùy chọn)"
                inputProps={{ placeholder: "IT" }}
              />
            </div>

            <div className="md:col-span-2">
              <FormInputField
                control={control}
                name="name"
                label="Tên phòng ban"
                required
                inputProps={{ placeholder: "Phòng Công nghệ thông tin" }}
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                control={control}
                name="parentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phòng ban cha</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      >
                        <option value="">Chọn...</option>
                        {parentOptions.map((department) => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Để trống nếu là phòng ban cấp cao nhất.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                control={control}
                name="managerId"
                render={({ field }) => {
                  const managerName = form.watch("manager");
                  return (
                    <FormItem>
                      <FormLabel>Trưởng bộ phận</FormLabel>
                      <Popover
                        open={isManagerPickerOpen}
                        onOpenChange={setIsManagerPickerOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              role="combobox"
                              aria-expanded={isManagerPickerOpen}
                              className="w-full justify-between font-normal"
                            >
                              <span className="truncate">
                                {managerName || "Chọn trưởng bộ phận..."}
                              </span>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] bg-white p-0">
                          <Command>
                            <CommandInput placeholder="Tìm nhân sự..." />
                            <CommandList>
                              <CommandEmpty>Không tìm thấy nhân sự.</CommandEmpty>
                              <CommandGroup>
                                {managerOptions.map((staff) => (
                                  <CommandItem
                                    key={staff.id}
                                    value={staff.name}
                                    onSelect={() => {
                                      form.setValue("manager", staff.name);
                                      field.onChange(staff.id);
                                      setIsManagerPickerOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === staff.id
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {staff.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Mô tả phạm vi, chức năng của phòng ban..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
              {isSaving ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </Dialog>
  );
}
