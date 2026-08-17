import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/components/ui";
import { Eye } from "lucide-react";
import type { StaffItem } from "@/features/staff/types/get-staffs.response";

function staffStatusLabel(status: number) {
  return status === 1 ? "Hoạt động" : "Tạm khóa";
}

function staffStatusVariant(status: number) {
  return status === 1 ? "success" : "warning";
}

type DepartmentStaffTableProps = {
  staff: StaffItem[];
  scopeLabel: string;
  onViewStaff: (staff: StaffItem) => void;
};

export function DepartmentStaffTable({
  staff,
  scopeLabel,
  onViewStaff,
}: DepartmentStaffTableProps) {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg">Danh sách nhân sự</CardTitle>
          <p className="text-sm text-muted-foreground">{scopeLabel}</p>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>Chức vụ</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {item.potition || "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.phone || "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={staffStatusVariant(item.status)}>
                    {staffStatusLabel(item.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Xem chi tiết"
                    onClick={() => onViewStaff(item)}
                  >
                    <Eye className="h-4 w-4 text-slate-700" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {staff.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Không có nhân sự trong phòng ban này.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
