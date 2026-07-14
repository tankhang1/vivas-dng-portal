import { useLocation } from 'wouter';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogTitle,
} from '../../components/ui';
import { Pencil, Trash2, X } from 'lucide-react';
import {
  displayCitizenValue,
  statusBadgeVariant,
  statusLabel,
  type CitizenRecord,
} from './types';

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | undefined;
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="min-w-40 text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground">{displayCitizenValue(value)}</span>
    </div>
  );
}

type CitizenDetailDialogProps = {
  citizen: CitizenRecord | null;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
};

export function CitizenDetailDialog({
  citizen,
  onOpenChange,
  onDelete,
}: CitizenDetailDialogProps) {
  const [, navigate] = useLocation();

  return (
    <Dialog
      open={!!citizen}
      onOpenChange={onOpenChange}
      className="max-w-3xl overflow-hidden p-0"
    >
      {citizen && (
        <div className="max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
            <div>
              <DialogTitle className="text-2xl">{citizen.name}</DialogTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Thông tin chi tiết công dân
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(citizen.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/citizens/${citizen.id}/edit`)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 pt-6 md:grid-cols-2">
                <InfoItem label="Họ tên" value={citizen.name} />
                <InfoItem label="Ngày sinh" value={citizen.birthday} />
                <InfoItem label="Giới tính" value={citizen.gender} />
                <InfoItem label="CCCD/CMND" value={citizen.cccd} />
                <InfoItem label="Điện thoại" value={citizen.phone} />
                <InfoItem label="Email" value={citizen.email} />
                <InfoItem label="Nghề nghiệp" value={citizen.occupation} />
                <InfoItem label="Học vấn" value={citizen.education} />
                <InfoItem label="Dân tộc" value={citizen.ethnicity} />
                <InfoItem label="Tôn giáo" value={citizen.religion} />
                <InfoItem label="Khu vực" value={citizen.area} />
                <div className="flex items-start gap-2 text-sm">
                  <span className="min-w-40 text-muted-foreground">Trạng thái:</span>
                  <Badge variant={statusBadgeVariant(citizen.status)}>
                    {statusLabel(citizen.status)}
                  </Badge>
                </div>
                <InfoItem label="Địa chỉ" value={citizen.address} />
                <InfoItem label="Ghi chú" value={citizen.notes} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Người dùng ZMA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                <p className="text-sm text-muted-foreground">
                  {citizen.zmaUser && citizen.zmaUser !== '-'
                    ? 'Đã liên kết người dùng ZMA.'
                    : 'Chưa liên kết người dùng ZMA.'}
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <InfoItem label="Người dùng ZMA" value={citizen.zmaUser} />
                  <InfoItem label="Đồng bộ từ ZMA" value={citizen.syncFromZma} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Hộ dân</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 pt-6 md:grid-cols-2">
                <InfoItem label="Mã hộ" value={citizen.householdCode} />
                <InfoItem label="Số hộ khẩu" value={citizen.householdCode} />
                <InfoItem label="Quan hệ với chủ hộ" value={citizen.householdHeadRelation} />
                <InfoItem label="Số thành viên" value={citizen.householdSize} />
                <InfoItem label="Địa chỉ hộ" value={citizen.householdAddress} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </Dialog>
  );
}
