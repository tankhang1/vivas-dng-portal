import React, { useMemo, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button, Input, Dialog, DialogHeader, DialogTitle, DialogFooter, Label, Select, Pagination } from '../components/ui';
import { mockDepartments } from '../data/mock';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

const PAGE_SIZE = 5;

export default function Departments() {
  const [departments, setDepartments] = useState(mockDepartments);
  const [searchTerm, setSearchTerm] = useState('');
  const [managerFilter, setManagerFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDept, setCurrentDept] = useState<any>(null);

  const managers = useMemo(() => Array.from(new Set(departments.map(d => d.manager).filter(Boolean))), [departments]);

  const filtered = useMemo(() => {
    return departments.filter(d =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (managerFilter === 'all' || d.manager === managerFilter)
    );
  }, [departments, searchTerm, managerFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleOpenDialog = (dept: any = null) => {
    setCurrentDept(dept || { id: '', name: '', manager: '', staffCount: 0 });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (currentDept.id) {
      setDepartments(departments.map(d => d.id === currentDept.id ? currentDept : d));
    } else {
      setDepartments([...departments, { ...currentDept, id: Date.now().toString() }]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if(confirm('Xóa phòng ban này?')) {
      setDepartments(departments.filter(d => d.id !== id));
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Phòng ban</h1>
            <p className="text-muted-foreground mt-1">Cơ cấu tổ chức và các bộ phận chuyên môn.</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" /> Thêm phòng ban
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên phòng ban..."
                className="pl-9"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={managerFilter} onChange={e => { setManagerFilter(e.target.value); setPage(1); }} className="w-48">
                <option value="all">Tất cả trưởng bộ phận</option>
                {managers.map(m => <option key={m} value={m}>{m}</option>)}
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên phòng ban</TableHead>
                  <TableHead>Trưởng bộ phận</TableHead>
                  <TableHead>Số lượng nhân sự</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell>{dept.manager || 'Chưa phân công'}</TableCell>
                    <TableCell>{dept.staffCount} người</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(dept)}>
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(dept.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      Không tìm thấy phòng ban nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle>{currentDept?.id ? 'Chỉnh sửa phòng ban' : 'Thêm phòng ban mới'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Tên phòng ban</Label>
            <Input 
              value={currentDept?.name || ''} 
              onChange={e => setCurrentDept({...currentDept, name: e.target.value})} 
            />
          </div>
          <div className="grid gap-2">
            <Label>Trưởng bộ phận (Tên tài khoản hoặc họ tên)</Label>
            <Input 
              value={currentDept?.manager || ''} 
              onChange={e => setCurrentDept({...currentDept, manager: e.target.value})} 
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleSave}>Lưu</Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
}
