import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button, Input, Dialog, DialogHeader, DialogTitle, DialogFooter, Label } from '../components/ui';
import { mockProcedures } from '../data/mock';
import { Plus, Search, Edit2, CheckCircle2, XCircle } from 'lucide-react';

export default function Procedures() {
  const [procedures, setProcedures] = useState(mockProcedures);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProc, setCurrentProc] = useState<any>(null);

  const filtered = procedures.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleActive = (id: string) => {
    setProcedures(procedures.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const handleOpenDialog = (proc: any = null) => {
    setCurrentProc(proc || { id: '', name: '', category: 'Hộ tịch', time: '1 ngày', fee: 'Miễn phí', active: true });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (currentProc.id) {
      setProcedures(procedures.map(p => p.id === currentProc.id ? currentProc : p));
    } else {
      setProcedures([...procedures, { ...currentProc, id: Date.now().toString() }]);
    }
    setIsDialogOpen(false);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Thủ tục hành chính</h1>
            <p className="text-muted-foreground mt-1">Niêm yết thông tin các thủ tục, lệ phí, thời gian giải quyết.</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" /> Thêm thủ tục
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tra cứu tên thủ tục..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên thủ tục</TableHead>
                  <TableHead>Lĩnh vực</TableHead>
                  <TableHead>Thời gian GQ</TableHead>
                  <TableHead>Lệ phí</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((proc) => (
                  <TableRow key={proc.id}>
                    <TableCell className="font-medium max-w-[300px] truncate">{proc.name}</TableCell>
                    <TableCell>{proc.category}</TableCell>
                    <TableCell>{proc.time}</TableCell>
                    <TableCell>{proc.fee}</TableCell>
                    <TableCell>
                      {proc.active ? (
                        <Badge variant="success" className="cursor-pointer" onClick={() => toggleActive(proc.id)}>Đang niêm yết</Badge>
                      ) : (
                        <Badge variant="secondary" className="cursor-pointer" onClick={() => toggleActive(proc.id)}>Đang ẩn</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(proc)}>
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Không tìm thấy thủ tục nào.
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
          <DialogTitle>{currentProc?.id ? 'Sửa thông tin thủ tục' : 'Thêm thủ tục mới'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Tên thủ tục</Label>
            <Input 
              value={currentProc?.name || ''} 
              onChange={e => setCurrentProc({...currentProc, name: e.target.value})} 
            />
          </div>
          <div className="grid gap-2">
            <Label>Lĩnh vực</Label>
            <Input 
              value={currentProc?.category || ''} 
              onChange={e => setCurrentProc({...currentProc, category: e.target.value})} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Thời gian giải quyết</Label>
              <Input 
                value={currentProc?.time || ''} 
                onChange={e => setCurrentProc({...currentProc, time: e.target.value})} 
              />
            </div>
            <div className="grid gap-2">
              <Label>Lệ phí</Label>
              <Input 
                value={currentProc?.fee || ''} 
                onChange={e => setCurrentProc({...currentProc, fee: e.target.value})} 
              />
            </div>
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
