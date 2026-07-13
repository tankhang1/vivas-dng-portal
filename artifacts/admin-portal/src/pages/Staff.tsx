import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button, Input, Badge, Dialog, DialogHeader, DialogTitle, DialogFooter, Label, Select } from '../components/ui';
import { mockStaff, mockDepartments, mockRoles } from '../data/mock';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';

export default function Staff() {
  const [staffList, setStaffList] = useState(mockStaff);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<any>(null);

  const filteredStaff = staffList.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.username.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenDialog = (staff: any = null) => {
    setCurrentStaff(staff || { id: '', name: '', username: '', department: mockDepartments[0].name, role: mockRoles[0].name, status: 'active' });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (currentStaff.id) {
      setStaffList(staffList.map(s => s.id === currentStaff.id ? currentStaff : s));
    } else {
      setStaffList([...staffList, { ...currentStaff, id: Date.now().toString() }]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if(confirm('Bạn có chắc chắn muốn xóa cán bộ này?')) {
      setStaffList(staffList.filter(s => s.id !== id));
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cán bộ</h1>
            <p className="text-muted-foreground mt-1">Quản lý tài khoản và phân quyền cho cán bộ, công chức.</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" /> Thêm cán bộ
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc tài khoản..."
                className="pl-9 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Tài khoản</TableHead>
                  <TableHead>Phòng ban</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">{staff.name}</TableCell>
                    <TableCell>{staff.username}</TableCell>
                    <TableCell>{staff.department}</TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>
                      <Badge variant={staff.status === 'active' ? 'success' : 'secondary'}>
                        {staff.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(staff)}>
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(staff.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredStaff.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Không tìm thấy cán bộ nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle>{currentStaff?.id ? 'Chỉnh sửa cán bộ' : 'Thêm cán bộ mới'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Họ tên</Label>
            <Input 
              value={currentStaff?.name || ''} 
              onChange={e => setCurrentStaff({...currentStaff, name: e.target.value})} 
            />
          </div>
          <div className="grid gap-2">
            <Label>Tài khoản đăng nhập</Label>
            <Input 
              value={currentStaff?.username || ''} 
              onChange={e => setCurrentStaff({...currentStaff, username: e.target.value})} 
              disabled={!!currentStaff?.id}
            />
          </div>
          <div className="grid gap-2">
            <Label>Phòng ban</Label>
            <Select 
              value={currentStaff?.department || ''} 
              onChange={e => setCurrentStaff({...currentStaff, department: e.target.value})}
            >
              {mockDepartments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Vai trò</Label>
            <Select 
              value={currentStaff?.role || ''} 
              onChange={e => setCurrentStaff({...currentStaff, role: e.target.value})}
            >
              {mockRoles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Trạng thái</Label>
            <Select 
              value={currentStaff?.status || 'active'} 
              onChange={e => setCurrentStaff({...currentStaff, status: e.target.value})}
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm khóa</option>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleSave}>Lưu thông tin</Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
}
