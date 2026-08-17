import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/components/ui";
import type { StaffItem } from "@/features/staff/types/get-staffs.response";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="min-w-36 text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground">{value || "-"}</span>
    </div>
  );
}

type StaffDetailDialogProps = {
  staff: StaffItem | null;
  onOpenChange: (open: boolean) => void;
};

export function StaffDetailDialog({ staff, onOpenChange }: StaffDetailDialogProps) {
  return (
    <Dialog
      open={!!staff}
      onOpenChange={onOpenChange}
      className="max-w-2xl"
    >
      {staff && (
        <div className="space-y-5">
          <DialogHeader>
            <DialogTitle>{staff.name}</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Thông tin chi tiết nhân sự thuộc phòng ban đã chọn.
            </p>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoRow label="Họ và tên" value={staff.name} />
            <InfoRow label="Phòng ban" value={staff.department_name} />
            <InfoRow label="Lĩnh vực" value={staff.division_name || "-"} />
            <InfoRow label="Chức vụ" value={staff.potition || "-"} />
            <InfoRow label="Email" value={staff.email || "-"} />
            <InfoRow label="Điện thoại" value={staff.phone || "-"} />
            <div className="md:col-span-2">
              <InfoRow
                label="Trạng thái"
                value={staff.status === 1 ? "Hoạt động" : "Tạm khóa"}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </div>
      )}
    </Dialog>
  );
}
