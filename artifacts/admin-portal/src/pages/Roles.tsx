import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button, Input, Dialog, DialogHeader, DialogTitle, DialogFooter, Label } from '../components/ui';
import { mockRoles } from '../data/mock';
import { Shield, Plus, Edit2, Trash2, CheckSquare, Square } from 'lucide-react';

const permissions = [
  'Xem tổng quan',
  'Quản lý hồ sơ',
  'Quản lý phản ánh',
  'Quản lý tin tức',
  'Quản lý cán bộ',
  'Quản lý thiết lập'
];

export default function Roles() {
  const [roles, setRoles] = useState(mockRoles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<any>(null);

  const handleOpenDialog = (role: any = null) => {
    setCurrentRole(role || { id: '', name: '', desc: '', users: 0 });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (currentRole.id) {
      setRoles(roles.map(r => r.id === currentRole.id ? currentRole : r));
    } else {
      setRoles([...roles, { ...currentRole, id: Date.now().toString() }]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if(confirm('Bạn có chắc chắn muốn xóa vai trò này?')) {
      setRoles(roles.filter(r => r.id !== id));
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vai trò & Phân quyền</h1>
            <p className="text-muted-foreground mt-1">Quản lý nhóm quyền hạn truy cập hệ thống.</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" /> Thêm vai trò
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Danh sách vai trò
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                {roles.map(role => (
                  <div key={role.id} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div>
                      <p className="font-medium">{role.name}</p>
                      <p className="text-xs text-muted-foreground">{role.users} người dùng</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(role)}>
                        <Edit2 className="h-3 w-3 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(role.id)}>
                        <Trash2 className="h-3 w-3 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ma trận phân quyền (Minh họa)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quyền hạn</TableHead>
                    {roles.map(r => <TableHead key={r.id} className="text-center">{r.name}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((perm, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{perm}</TableCell>
                      {roles.map((r, j) => (
                        <TableCell key={r.id} className="text-center">
                          {r.name === 'Super Admin' || r.name === 'Admin' || (r.name === 'Biên tập viên' && i === 3) || (r.name === 'Cán bộ xử lý' && (i === 1 || i === 2)) ? (
                            <CheckSquare className="h-4 w-4 text-primary mx-auto" />
                          ) : (
                            <Square className="h-4 w-4 text-muted-foreground mx-auto" />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle>{currentRole?.id ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Tên vai trò</Label>
            <Input 
              value={currentRole?.name || ''} 
              onChange={e => setCurrentRole({...currentRole, name: e.target.value})} 
            />
          </div>
          <div className="grid gap-2">
            <Label>Mô tả</Label>
            <Input 
              value={currentRole?.desc || ''} 
              onChange={e => setCurrentRole({...currentRole, desc: e.target.value})} 
            />
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
