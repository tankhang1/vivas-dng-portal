import { useDeferredValue, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "../../shared/components/Layout";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shared/components/ui";
import { Spinner } from "../../shared/components/ui/spinner";
import { Edit2, Eye, Search } from "lucide-react";
import { useSearchCitizensQuery } from "@/features/citizen/hooks/citizen.hook";

const PAGE_SIZE = 6;

function citizenStatusLabel(status: number) {
  return status === 1 ? "Đang hoạt động" : "Tạm ẩn";
}

function citizenStatusVariant(status: number) {
  return status === 1 ? "success" : "warning";
}

export default function CitizensPage() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDeferredValue(searchTerm);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useSearchCitizensQuery({
    key: debouncedSearch || undefined,
    sz: PAGE_SIZE,
    nu: page - 1,
  });

  const citizens = data?.content ?? [];
  const totalPages = Math.max(1, data?.page.totalPages ?? 1);
  const totalItems = data?.page.totalElements ?? 0;
  const showInitialLoading = isLoading && citizens.length === 0;
  const showRefetchOverlay = isFetching && !showInitialLoading;

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Danh bạ Công dân
            </h1>
            <p className="mt-1 text-muted-foreground">
              Xem và cập nhật hồ sơ công dân. Công dân tự đăng ký qua ứng dụng
              Zalo Mini App nên không thể tạo hoặc xóa hồ sơ tại đây.
            </p>
          </div>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên, số điện thoại..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </CardHeader>
          <CardContent
            className={showRefetchOverlay ? "p-0 opacity-60" : "p-0"}
          >
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Căn Cước</TableHead>
                  <TableHead>Điện thoại</TableHead>
                  <TableHead>Phường/Xã</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {showInitialLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <Spinner className="h-4 w-4" /> Đang tải danh sách...
                      </span>
                    </TableCell>
                  </TableRow>
                )}
                {!showInitialLoading &&
                  citizens.map((citizen) => (
                    <TableRow
                      key={citizen.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/citizens/${citizen.zalo_user_id}`)}
                    >
                      <TableCell className="font-semibold text-slate-900">
                        {citizen.name}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {citizen.citizen_number || "-"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {citizen.phone || "-"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {citizen.ward_name || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={citizenStatusVariant(citizen.status)}>
                          {citizenStatusLabel(citizen.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-100"
                            title="Xem chi tiết"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/citizens/${citizen.zalo_user_id}`);
                            }}
                          >
                            <Eye className="h-4 w-4 text-slate-700" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-slate-100"
                            title="Chỉnh sửa"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/citizens/${citizen.zalo_user_id}/edit`);
                            }}
                          >
                            <Edit2 className="h-4 w-4 text-blue-600" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                {!showInitialLoading && citizens.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Không tìm thấy công dân nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
        />
      </div>
    </Layout>
  );
}
