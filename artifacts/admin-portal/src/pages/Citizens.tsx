import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button, Input, Badge } from '../components/ui';
import { mockCitizens } from '../data/mock';
import { Search, Eye, MapPin, Phone } from 'lucide-react';

export default function Citizens() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockCitizens.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Danh bạ Công dân</h1>
            <p className="text-muted-foreground mt-1">Quản lý hồ sơ và lịch sử tương tác của người dân trên địa bàn.</p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm tên hoặc số điện thoại..." 
                className="pl-9"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
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
                  <TableHead className="text-right">Hồ sơ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((citizen) => (
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
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="h-4 w-4" /> Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
