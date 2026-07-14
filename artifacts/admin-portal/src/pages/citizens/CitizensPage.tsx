import React, { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { Layout } from '../../components/Layout';
import { Button, Card, CardContent, Pagination, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge } from '../../components/ui';
import { Edit2, Eye, Plus, Trash2 } from 'lucide-react';
import { getCitizens, deleteCitizen } from './store';
import { CitizenDetailDialog } from './CitizenDetailDialog';
import { displayCitizenValue, statusBadgeVariant, statusLabel, type CitizenRecord } from './types';

const PAGE_SIZE = 6;

export default function CitizensPage() {
  const [, navigate] = useLocation();
  const [citizens, setCitizens] = useState<CitizenRecord[]>(getCitizens());
  const [page, setPage] = useState(1);
  const [detailCitizen, setDetailCitizen] = useState<CitizenRecord | null>(null);

  const totalPages = Math.max(1, Math.ceil(citizens.length / PAGE_SIZE));
  const paginated = useMemo(
    () => citizens.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [citizens, page],
  );

  const handleDelete = (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hồ sơ công dân này?')) return;
    deleteCitizen(id);
    setCitizens(getCitizens());
    setDetailCitizen((current) => (current?.id === id ? null : current));
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Danh bạ Công dân</h1>
            <p className="mt-1 text-muted-foreground">
              Quản lý hồ sơ công dân, người dùng ZMA và thông tin hộ dân.
            </p>
          </div>
          <Button onClick={() => navigate('/citizens/new')} className="gap-2 self-start">
            <Plus className="h-4 w-4" />
            Thêm công dân
          </Button>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>CCCD/CMND</TableHead>
                  <TableHead>Điện thoại</TableHead>
                  <TableHead>Giới tính</TableHead>
                  <TableHead>Hộ dân</TableHead>
                  <TableHead>Quan hệ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((citizen) => (
                  <TableRow
                    key={citizen.id}
                    className="cursor-pointer"
                    onClick={() => setDetailCitizen(citizen)}
                  >
                    <TableCell className="font-semibold text-slate-900">{citizen.name}</TableCell>
                    <TableCell className="text-slate-600">{displayCitizenValue(citizen.cccd)}</TableCell>
                    <TableCell className="text-slate-600">{displayCitizenValue(citizen.phone)}</TableCell>
                    <TableCell className="text-slate-600">{displayCitizenValue(citizen.gender)}</TableCell>
                    <TableCell className="text-slate-600">{displayCitizenValue(citizen.household)}</TableCell>
                    <TableCell className="text-slate-600">{displayCitizenValue(citizen.relationship)}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(citizen.status)}>
                        {statusLabel(citizen.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Xem chi tiết"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDetailCitizen(citizen);
                          }}
                        >
                          <Eye className="h-4 w-4 text-slate-700" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Chỉnh sửa"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/citizens/${citizen.id}/edit`);
                          }}
                        >
                          <Edit2 className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Xóa"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(citizen.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      Không tìm thấy công dân nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {citizens.length > PAGE_SIZE && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={citizens.length}
            pageSize={PAGE_SIZE}
          />
        )}
      </div>

      <CitizenDetailDialog
        citizen={detailCitizen}
        onOpenChange={(open) => {
          if (!open) setDetailCitizen(null);
        }}
        onDelete={handleDelete}
      />
    </Layout>
  );
}
