import { useDeferredValue, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "../../shared/components/Layout";
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
} from "../../shared/components/ui";
import { Spinner } from "../../shared/components/ui/spinner";
import {
  useDeactiveStaffProcessMutation,
  useSearchStaffQuery,
} from "@/features/staff/hooks/staff.hook";
import { useDepartmentsQuery } from "@/features/department/hooks/department.hook";
import { Edit2, Eye, Plus, Search, Trash2 } from "lucide-react";

const PAGE_SIZE = 5;

function staffStatusLabel(status: number) {
  return status === 1 ? "Hoạt động" : "Tạm khóa";
}

function staffStatusVariant(status: number) {
  return status === 1 ? "success" : "warning";
}

export default function StaffPage() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDeferredValue(searchTerm);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, refetch } = useSearchStaffQuery({
    key: debouncedSearch || undefined,
    sz: PAGE_SIZE,
    nu: page - 1,
  });
  const { data: departmentsData, isLoading: isDepartmentsLoading } =
    useDepartmentsQuery();
  const deactiveStaffMutation = useDeactiveStaffProcessMutation();

  const staffList = data?.content ?? [];
  const showInitialLoading = isLoading && staffList.length === 0;
  const showRefetchOverlay = isFetching && !showInitialLoading;
  const filteredStaff = useMemo(() => {
    return staffList.filter(
      (staff) =>
        (departmentFilter === "all" ||
          String(staff.department_item) === departmentFilter) &&
        (statusFilter === "all" || String(staff.status) === statusFilter),
    );
  }, [staffList, departmentFilter, statusFilter]);

  const totalPages = Math.max(1, data?.page.totalPages ?? 1);
  const totalItems = data?.page.totalElements ?? 0;

  const updateFilters = (fn: () => void) => {
    fn();
    setPage(1);
  };

  const handleDelete = async (id: number, phone: string | null) => {
    if (!confirm("Bạn có chắc chắn muốn xóa cán bộ này?")) return;
    try {
      await deactiveStaffMutation.mutateAsync({ id, phone: phone ?? "" });
      refetch();
    } catch {
      window.alert("Xóa cán bộ thất bại. Vui lòng thử lại.");
    }
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
                placeholder="Tìm kiếm theo tên"
                className="pl-9 pr-9"
                value={searchTerm}
                onChange={(e) =>
                  updateFilters(() => setSearchTerm(e.target.value))
                }
              />
              {showRefetchOverlay && (
                <Spinner className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={departmentFilter}
                onChange={(e) =>
                  updateFilters(() => setDepartmentFilter(e.target.value))
                }
                className="w-52"
                disabled={isDepartmentsLoading}
              >
                <option value="all">Tất cả phòng ban</option>
                {departmentsData?.content.map((department) => (
                  <option key={department.id} value={String(department.id)}>
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
                <option value="1">Hoạt động</option>
                <option value="0">Tạm khóa</option>
              </Select>
            </div>
          </CardHeader>

          <CardContent
            className={
              showRefetchOverlay
                ? "opacity-60 transition-opacity"
                : "transition-opacity"
            }
          >
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
                {showInitialLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Spinner className="h-4 w-4" />
                        Đang tải danh sách cán bộ...
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!showInitialLoading &&
                  filteredStaff.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">
                        {staff.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {staff.email || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {staff.phone || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {staff.department_name || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {staff.potition || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={staffStatusVariant(staff.status)}>
                          {staffStatusLabel(staff.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Xem chi tiết"
                            onClick={() => navigate(`/staff/${staff.id}`)}
                          >
                            <Eye className="h-4 w-4 text-emerald-600" />
                          </Button>
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
                            onClick={() => handleDelete(staff.id, staff.phone)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                {!showInitialLoading && filteredStaff.length === 0 && (
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
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
