import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button, Input, Dialog, DialogHeader, DialogTitle, DialogFooter, Label } from '../components/ui';
import { mockDepartments } from '../data/mock';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function Departments() {
  const [departments, setDepartments] = useState(mockDepartments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDept, setCurrentDept] = useState<any>(null);

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
          <CardContent className="pt-6">
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
                {departments.map((dept) => (
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
              </TableBody>
            </Table>
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
