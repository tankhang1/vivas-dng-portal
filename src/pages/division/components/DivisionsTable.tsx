import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../shared/components/ui";
import { Spinner } from "../../../shared/components/ui/spinner";
import { Edit2, Trash2, Search } from "lucide-react";
import type { DivisionItem } from "@/features/division/types/get-divisions.response";

type DivisionsTableProps = {
  divisions: DivisionItem[];
  isLoading: boolean;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onEdit: (item: DivisionItem) => void;
  onDelete: (id: number) => void;
  canManage: boolean;
};

export function DivisionsTable({
  divisions,
  isLoading,
  searchTerm,
  onSearchTermChange,
  onEdit,
  onDelete,
  canManage,
}: DivisionsTableProps) {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm lĩnh vực..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên lĩnh vực</TableHead>
              <TableHead>Mô tả</TableHead>
              {canManage && <TableHead className="text-right">Thao tác</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Spinner className="h-4 w-4" /> Đang tải lĩnh vực...
                  </span>
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              divisions.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {item.note || "-"}
                  </TableCell>
                  {canManage && (
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Chỉnh sửa"
                        onClick={() => onEdit(item)}
                      >
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Xóa"
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            {!isLoading && divisions.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-24 text-center text-muted-foreground"
                >
                  Không tìm thấy lĩnh vực nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
