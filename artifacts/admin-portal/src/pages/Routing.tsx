import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button, Input, Dialog, DialogHeader, DialogTitle, DialogFooter, Label, Select } from '../components/ui';
import { mockRoutingRules, mockRoutedItems, mockDepartments, mockStaff } from '../data/mock';
import { Waypoints, Plus, Edit2, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Routing() {
  const [rules, setRules] = useState(mockRoutingRules);
  const [items] = useState(mockRoutedItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState<any>(null);

  const handleOpenDialog = (rule: any = null) => {
    setCurrentRule(rule || { id: '', field: '', department: mockDepartments[0].name, staff: mockStaff[0].name });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (currentRule.id) {
      setRules(rules.map(r => (r.id === currentRule.id ? currentRule : r)));
    } else {
      setRules([...rules, { ...currentRule, id: Date.now().toString() }]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Xóa quy tắc điều phối này?')) {
      setRules(rules.filter(r => r.id !== id));
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Điều phối tiếp nhận thông tin</h1>
            <p className="text-muted-foreground mt-1">
              Thông tin tiếp nhận được tự động điều phối cho cán bộ phụ trách theo lĩnh vực liên quan.
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" /> Thêm quy tắc
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waypoints className="h-5 w-5 text-primary" />
              Quy tắc điều phối theo lĩnh vực phụ trách
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lĩnh vực</TableHead>
                  <TableHead>Phòng ban phụ trách</TableHead>
                  <TableHead>Cán bộ tiếp nhận</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.field}</TableCell>
                    <TableCell>{rule.department}</TableCell>
                    <TableCell>{rule.staff}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(rule)}>
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(rule.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin tiếp nhận gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Người gửi</TableHead>
                  <TableHead>Lĩnh vực</TableHead>
                  <TableHead>Điều phối tới</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap">{item.date}</TableCell>
                    <TableCell className="font-medium">{item.sender}</TableCell>
                    <TableCell>{item.field}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <span>{item.routedDepartment}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{item.routedStaff}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success" className="gap-1 bg-green-100 text-green-800">
                        <CheckCircle2 className="h-3 w-3" /> Đã điều phối
                      </Badge>
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
          <DialogTitle>{currentRule?.id ? 'Chỉnh sửa quy tắc' : 'Thêm quy tắc điều phối'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Lĩnh vực</Label>
            <Input
              value={currentRule?.field || ''}
              onChange={e => setCurrentRule({ ...currentRule, field: e.target.value })}
              placeholder="Ví dụ: Môi trường, Trật tự, An ninh..."
            />
          </div>
          <div className="grid gap-2">
            <Label>Phòng ban phụ trách</Label>
            <Select
              value={currentRule?.department || ''}
              onChange={e => setCurrentRule({ ...currentRule, department: e.target.value })}
            >
              {mockDepartments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Cán bộ tiếp nhận</Label>
            <Select
              value={currentRule?.staff || ''}
              onChange={e => setCurrentRule({ ...currentRule, staff: e.target.value })}
            >
              {mockStaff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleSave}>Lưu quy tắc</Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
}
