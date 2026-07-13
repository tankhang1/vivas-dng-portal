import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button, Input, Dialog, DialogHeader, DialogTitle, DialogFooter, Label, Select } from '../components/ui';
import { mockEmergencyContacts } from '../data/mock';
import { Plus, Edit2, Trash2, PhoneCall } from 'lucide-react';

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState(mockEmergencyContacts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<any>(null);

  const handleOpenDialog = (contact: any = null) => {
    setCurrentContact(contact || { id: '', name: '', phone: '', category: 'Hỗ trợ', active: true });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (currentContact.id) {
      setContacts(contacts.map(c => c.id === currentContact.id ? currentContact : c));
    } else {
      setContacts([...contacts, { ...currentContact, id: Date.now().toString() }]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if(confirm('Xóa liên hệ này?')) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Liên hệ Khẩn cấp</h1>
            <p className="text-muted-foreground mt-1">Quản lý danh bạ đường dây nóng hiển thị cho người dân.</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" /> Thêm số liên hệ
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên cơ quan / Đơn vị</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Phân loại</TableHead>
                  <TableHead>Trạng thái hiển thị</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <PhoneCall className="h-4 w-4 text-primary" /> {contact.name}
                    </TableCell>
                    <TableCell className="font-bold tracking-wide">{contact.phone}</TableCell>
                    <TableCell>
                      <Badge variant={contact.category === 'Khẩn cấp' ? 'destructive' : 'secondary'}>
                        {contact.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {contact.active ? (
                        <Badge variant="success">Hiển thị</Badge>
                      ) : (
                        <Badge variant="outline">Đang ẩn</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(contact)}>
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(contact.id)}>
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
          <DialogTitle>{currentContact?.id ? 'Sửa liên hệ' : 'Thêm liên hệ mới'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Tên cơ quan / Đơn vị</Label>
            <Input 
              value={currentContact?.name || ''} 
              onChange={e => setCurrentContact({...currentContact, name: e.target.value})} 
            />
          </div>
          <div className="grid gap-2">
            <Label>Số điện thoại</Label>
            <Input 
              value={currentContact?.phone || ''} 
              onChange={e => setCurrentContact({...currentContact, phone: e.target.value})} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Phân loại</Label>
              <Select 
                value={currentContact?.category || 'Hỗ trợ'} 
                onChange={e => setCurrentContact({...currentContact, category: e.target.value})}
              >
                <option value="Khẩn cấp">Khẩn cấp</option>
                <option value="Y tế">Y tế</option>
                <option value="Hành chính">Hành chính</option>
                <option value="Hỗ trợ">Hỗ trợ khác</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Trạng thái</Label>
              <Select 
                value={currentContact?.active ? 'true' : 'false'} 
                onChange={e => setCurrentContact({...currentContact, active: e.target.value === 'true'})}
              >
                <option value="true">Hiển thị</option>
                <option value="false">Ẩn</option>
              </Select>
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
