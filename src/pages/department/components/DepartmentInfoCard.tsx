import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui";
import { Edit2, Plus, Trash2 } from "lucide-react";
import type { DepartmentRecord } from "../types";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="min-w-36 text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground">{value || "-"}</span>
    </div>
  );
}

type DepartmentInfoCardProps = {
  department: DepartmentRecord | null;
  parentDepartment: DepartmentRecord | null;
  staffCount: number;
  childrenCount: number;
  onAddChild: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canManage: boolean;
};

export function DepartmentInfoCard({
  department,
  parentDepartment,
  staffCount,
  childrenCount,
  onAddChild,
  onEdit,
  onDelete,
  canManage,
}: DepartmentInfoCardProps) {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle className="text-lg">Thông tin phòng ban</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {department?.name ?? "Chưa chọn phòng ban"}
            </p>
          </div>
          {department && canManage && (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={onAddChild}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm con
              </Button>
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit2 className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
              <Button variant="destructive" size="sm" onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {department ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-white p-4">
              <div className="space-y-3 text-sm">
                <InfoRow label="Tên phòng ban" value={department.name} />
                <InfoRow label="Mã phòng ban" value={department.code} />
                <InfoRow
                  label="Phòng ban cha"
                  value={parentDepartment?.name ?? "Phòng ban cấp cao nhất"}
                />
                <InfoRow label="Trưởng bộ phận" value={department.manager} />
              </div>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="space-y-3 text-sm">
                <InfoRow
                  label="Trạng thái"
                  value={department.status === "active" ? "Hoạt động" : "Tạm khóa"}
                />
                <InfoRow label="Nhân sự" value={staffCount} />
                <InfoRow label="Phòng ban con" value={childrenCount} />
              </div>
            </div>

            <div className="md:col-span-2 rounded-xl border bg-slate-50 p-4">
              <p className="text-sm font-medium text-foreground">Mô tả</p>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                {department.description || "Chưa có mô tả."}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Chọn một phòng ban ở bên trái để xem thông tin.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
