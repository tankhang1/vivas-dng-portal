import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "../../../shared/components/ui";
import { Switch } from "../../../shared/components/ui/switch";
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
import type { StaffCoordinateCommentItem } from "@/features/staff/types/get-staff-coordinate-comment.response";

const routingStaffSchema = z.object({
  staffId: z.string().min(1, "Vui lòng chọn cán bộ xử lý"),
  approval: z.boolean().default(false),
});

type RoutingStaffFormValues = z.infer<typeof routingStaffSchema>;

type RoutingStaffDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryName: string;
  staffOptions: StaffItem[];
  isSaving: boolean;
  mode?: "create" | "edit";
  editingItem?: StaffCoordinateCommentItem | null;
  onSubmit: (values: RoutingStaffFormValues) => Promise<void>;
};

const defaultValues: RoutingStaffFormValues = {
  staffId: "",
  approval: false,
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-red-600">{message}</p>;
}

export function RoutingStaffDialog({
  open,
  onOpenChange,
  categoryName,
  staffOptions,
  isSaving,
  mode = "create",
  editingItem,
  onSubmit,
}: RoutingStaffDialogProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const form = useForm<RoutingStaffFormValues>({
    resolver: zodResolver(routingStaffSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (open) {
      reset(
        editingItem
          ? {
              staffId: String(editingItem.staff_item),
              approval: editingItem.approval === 1,
            }
          : defaultValues,
      );
      setIsPickerOpen(false);
    }
  }, [editingItem, open, reset]);

  const selectedStaffId = watch("staffId");
  const selectedStaff = useMemo(
    () =>
      staffOptions.find((staff) => String(staff.id) === selectedStaffId) ??
      null,
    [selectedStaffId, staffOptions],
  );

  const saveDisabled = isSaving || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Cập nhật cán bộ điều phối" : "Thêm cán bộ vào điều phối"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label required>Điều phối</Label>
            <Input value={categoryName} disabled readOnly />
          </div>

          <div className="grid gap-2">
            <Label required>Cán bộ xử lý</Label>
            <Controller
              control={control}
              name="staffId"
              render={({ field }) => (
                <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={isPickerOpen}
                      className="w-full justify-between font-normal"
                    >
                      <span className="truncate">
                        {selectedStaff?.name ?? "Chọn cán bộ..."}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] bg-white p-0">
                    <Command>
                      <CommandInput placeholder="Tìm theo tên, điện thoại hoặc chức vụ..." />
                      <CommandList>
                        <CommandEmpty>Không tìm thấy cán bộ.</CommandEmpty>
                        <CommandGroup>
                          {staffOptions.map((staff) => (
                            <CommandItem
                              key={staff.id}
                              value={`${staff.name} ${staff.phone ?? ""} ${staff.potition ?? ""}`}
                              onSelect={() => {
                                field.onChange(String(staff.id));
                                setIsPickerOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedStaffId === String(staff.id)
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              <div className="flex min-w-0 flex-col">
                                <span className="truncate">{staff.name}</span>
                                <span className="truncate text-xs text-muted-foreground">
                                  {[staff.phone, staff.potition]
                                    .filter(Boolean)
                                    .join(" • ") || "Không có thông tin bổ sung"}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
            <FieldError message={errors.staffId?.message} />
            {staffOptions.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Không còn cán bộ khả dụng để thêm vào điều phối này.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-3 py-2.5">
            <div>
              <Label htmlFor="new-staff-approval" required>
                Cho phép duyệt
              </Label>
              <p className="text-xs text-muted-foreground">
                Bật để phê duyệt cán bộ ngay khi thêm, thay vì chờ xử lý sau.
              </p>
            </div>
            <Controller
              control={control}
              name="approval"
              render={({ field }) => (
                <Switch
                  id="new-staff-approval"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" disabled={saveDisabled}>
            {saveDisabled
              ? "Đang lưu..."
              : mode === "edit"
                ? "Cập nhật"
                : "Thêm cán bộ"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
