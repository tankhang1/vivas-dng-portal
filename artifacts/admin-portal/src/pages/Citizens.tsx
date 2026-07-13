import React, { useMemo, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button, Input, Badge, Dialog, DialogHeader, DialogTitle, DialogFooter, Label, Select, Pagination } from '../components/ui';
import { mockCitizens } from '../data/mock';
import { Search, Eye, MapPin, Phone, Plus, Edit2, Trash2 } from 'lucide-react';

const PAGE_SIZE = 5;

export default function Citizens() {
  const [citizens, setCitizens] = useState(mockCitizens);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCitizen, setCurrentCitizen] = useState<any>(null);

  const areas = useMemo(() => Array.from(new Set(citizens.map(c => c.address.split(',')[0].trim()))), [citizens]);

  const filtered = useMemo(() => {
    return citizens.filter(c =>
      (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm)) &&
      (areaFilter === 'all' || c.address.startsWith(areaFilter))
    );
  }, [citizens, searchTerm, areaFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleOpenDialog = (citizen: any = null) => {
    setCurrentCitizen(citizen || { id: '', name: '', phone: '', address: '', interactions: 0 });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (currentCitizen.id) {
      setCitizens(citizens.map(c => (c.id === currentCitizen.id ? currentCitizen : c)));
    } else {
      setCitizens([...citizens, { ...currentCitizen, id: Date.now().toString(), interactions: 0 }]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa hồ sơ công dân này?')) {
      setCitizens(citizens.filter(c => c.id !== id));
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Danh bạ Công dân</h1>
            <p className="text-muted-foreground mt-1">Quản lý hồ sơ và lịch sử tương tác của người dân trên địa bàn.</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" /> Thêm công dân
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm tên hoặc số điện thoại..."
                className="pl-9"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={areaFilter} onChange={e => { setAreaFilter(e.target.value); setPage(1); }} className="w-48">
                <option value="all">Tất cả khu vực</option>
                {areas.map(a => <option key={a} value={a}>{a}</option>)}
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Địa chỉ (Thường trú)</TableHead>
                  <TableHead>Số lần tương tác</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((citizen) => (
                  <TableRow key={citizen.id}>
                    <TableCell className="font-medium text-primary">{citizen.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" /> {citizen.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {citizen.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{citizen.interactions} lần</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(citizen)}>
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(citizen.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Không tìm thấy công dân nào.
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
          <DialogTitle>{currentCitizen?.id ? 'Chỉnh sửa hồ sơ công dân' : 'Thêm công dân mới'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Họ và tên</Label>
            <Input
              value={currentCitizen?.name || ''}
              onChange={e => setCurrentCitizen({ ...currentCitizen, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Số điện thoại</Label>
            <Input
              value={currentCitizen?.phone || ''}
              onChange={e => setCurrentCitizen({ ...currentCitizen, phone: e.target.value })}
              placeholder="Định danh qua số điện thoại chia sẻ từ OA"
            />
          </div>
          <div className="grid gap-2">
            <Label>Địa chỉ thường trú</Label>
            <Input
              value={currentCitizen?.address || ''}
              onChange={e => setCurrentCitizen({ ...currentCitizen, address: e.target.value })}
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
