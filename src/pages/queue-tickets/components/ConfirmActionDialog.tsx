import { Button, Dialog, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui";
import type { PendingScheduleAction } from "../types";

type ConfirmActionDialogProps = {
  pendingAction: PendingScheduleAction | null;
  isProcessing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmActionDialog({
  pendingAction,
  isProcessing,
  onCancel,
  onConfirm,
}: ConfirmActionDialogProps) {
  return (
    <Dialog
      open={pendingAction !== null}
      onOpenChange={(open) => {
        if (!open && !isProcessing) onCancel();
      }}
    >
      <DialogHeader>
        <DialogTitle>
          {pendingAction?.type === "confirm" ? "Xác nhận lịch hẹn?" : "Hoàn tất lịch hẹn?"}
        </DialogTitle>
      </DialogHeader>
      <p className="text-sm text-muted-foreground">
        {pendingAction?.type === "confirm"
          ? `Bạn có chắc muốn xác nhận lịch hẹn "${pendingAction.item.title || "Lịch hẹn"}" không?`
          : `Bạn có chắc muốn hoàn tất lịch hẹn "${pendingAction?.item.title || "Lịch hẹn"}" không?`}
      </p>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
          Hủy
        </Button>
        <Button onClick={onConfirm} disabled={isProcessing}>
          {isProcessing ? "Đang xử lý..." : "Xác nhận"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
