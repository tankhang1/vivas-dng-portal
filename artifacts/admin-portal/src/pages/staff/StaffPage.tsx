import React, { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "../../components/Layout";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Input,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui";
import { deleteStaff, getStaff } from "./store";
import { statusBadgeVariant, statusLabel, type StaffRecord } from "./types";
import { Edit2, Plus, Search, Trash2 } from "lucide-react";
import { mockDepartments } from "../../data/mock";

const PAGE_SIZE = 5;

export default function StaffPage() {
  const [, navigate] = useLocation();
  const [staffList, setStaffList] = useState<StaffRecord[]>(() => getStaff());
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      const search = searchTerm.toLowerCase();
      return (
        (staff.name.toLowerCase().includes(search) ||
          staff.username.toLowerCase().includes(search) ||
          staff.email.toLowerCase().includes(search) ||
          staff.phone.toLowerCase().includes(search)) &&
        (departmentFilter === "all" || staff.department === departmentFilter) &&
        (statusFilter === "all" || staff.status === statusFilter)
      );
    });
  }, [staffList, searchTerm, departmentFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredStaff.length / PAGE_SIZE));
  const paginated = filteredStaff.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const updateFilters = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa cán bộ này?")) return;
    deleteStaff(id);
    setStaffList(getStaff());
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cán bộ</h1>
            <p className="mt-1 text-muted-foreground">
              Quản lý tài khoản và thông tin hiển thị của cán bộ, công chức.
            </p>
          </div>
          <Button
            onClick={() => navigate("/staff/new")}
            className="gap-2 self-start"
          >
            <Plus className="h-4 w-4" />
            Thêm cán bộ
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-3 pb-3 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên, email hoặc điện thoại..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) =>
                    updateFilters(() => setSearchTerm(e.target.value))
                  }
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={departmentFilter}
                  onChange={(e) =>
                    updateFilters(() => setDepartmentFilter(e.target.value))
                  }
                  className="w-52"
                >
                  <option value="all">Tất cả phòng ban</option>
                  {mockDepartments.map((department) => (
                    <option key={department.id} value={department.name}>
                      {department.name}
                    </option>
                  ))}
                </Select>
                <Select
                  value={statusFilter}
                  onChange={(e) =>
                    updateFilters(() => setStatusFilter(e.target.value))
                  }
                  className="w-40"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm khóa</option>
                  </Select>
              </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Điện thoại</TableHead>
                  <TableHead>Phòng ban</TableHead>
                  <TableHead>Chức vụ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {staff.email || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {staff.phone || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {staff.department || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {staff.position || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(staff.status)}>
                        {statusLabel(staff.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Chỉnh sửa"
                          onClick={() => navigate(`/staff/${staff.id}/edit`)}
                        >
                          <Edit2 className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Xóa"
                          onClick={() => handleDelete(staff.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Không tìm thấy cán bộ nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={filteredStaff.length}
              pageSize={PAGE_SIZE}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
