import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button, Input, Dialog, DialogHeader, DialogTitle, DialogFooter, Label, Select, Textarea } from '../components/ui';
import { mockNews } from '../data/mock';
import { Plus, Search, Edit2, Trash2, Globe, FileEdit } from 'lucide-react';

export default function News() {
  const [news, setNews] = useState(mockNews);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<any>(null);

  const handleOpenDialog = (article: any = null) => {
    setCurrentArticle(article || { id: '', title: '', category: 'thong-bao', status: 'draft', date: new Date().toISOString().split('T')[0] });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (currentArticle.id) {
      setNews(news.map(n => n.id === currentArticle.id ? currentArticle : n));
    } else {
      setNews([{ ...currentArticle, id: Date.now().toString() }, ...news]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if(confirm('Bạn có chắc chắn muốn xóa bản tin này?')) {
      setNews(news.filter(n => n.id !== id));
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tin tức & Thông báo</h1>
            <p className="text-muted-foreground mt-1">Quản lý bài viết, thông báo hiển thị trên Cổng thông tin điện tử.</p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" /> Đăng tin mới
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3 flex flex-row justify-between items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm tiêu đề bản tin..." className="pl-9" />
            </div>
            <div className="flex gap-2">
               <Select className="w-[150px]">
                 <option value="all">Tất cả danh mục</option>
                 <option value="thong-bao">Thông báo</option>
                 <option value="tin-tuc">Tin tức</option>
                 <option value="su-kien">Sự kiện</option>
               </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Ngày đăng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium max-w-[400px] truncate">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      {item.status === 'published' ? (
                         <Badge variant="success" className="gap-1 bg-green-100 text-green-800"><Globe className="h-3 w-3" /> Đã xuất bản</Badge>
                      ) : (
                         <Badge variant="secondary" className="gap-1"><FileEdit className="h-3 w-3" /> Bản nháp</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
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
          <DialogTitle>{currentArticle?.id ? 'Chỉnh sửa bản tin' : 'Soạn bản tin mới'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Tiêu đề bài viết</Label>
            <Input 
              value={currentArticle?.title || ''} 
              onChange={e => setCurrentArticle({...currentArticle, title: e.target.value})} 
              placeholder="Nhập tiêu đề..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Danh mục</Label>
              <Select 
                value={currentArticle?.category || 'thong-bao'} 
                onChange={e => setCurrentArticle({...currentArticle, category: e.target.value})}
              >
                <option value="thong-bao">Thông báo</option>
                <option value="tin-tuc">Tin tức</option>
                <option value="su-kien">Sự kiện</option>
                <option value="khan-cap">Khẩn cấp</option>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Ngày đăng</Label>
              <Input 
                type="date"
                value={currentArticle?.date || ''} 
                onChange={e => setCurrentArticle({...currentArticle, date: e.target.value})} 
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Tóm tắt (Trích yếu)</Label>
            <Textarea placeholder="Nhập đoạn tóm tắt bài viết..." />
          </div>
          <div className="grid gap-2">
            <Label>Trạng thái</Label>
            <Select 
              value={currentArticle?.status || 'draft'} 
              onChange={e => setCurrentArticle({...currentArticle, status: e.target.value})}
            >
              <option value="draft">Lưu nháp</option>
              <option value="published">Xuất bản ngay</option>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleSave}>Lưu bài viết</Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
}
