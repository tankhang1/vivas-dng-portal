import React, { useMemo, useState } from "react";
import { Layout } from "../../shared/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Label,
  Select,
  Pagination,
} from "../../shared/components/ui";
import { mockDepartments, mockStaff } from "../../shared/data/mock";
import {
  getRoutedItems,
  updateRoutedItemAssignment,
  type RoutedItem,
} from "./store";
import { ArrowRight, CheckCircle2, Edit2, MapPin, Search } from "lucide-react";

const PAGE_SIZE = 5;

export default function RoutingListPage() {
  const [items, setItems] = useState<RoutedItem[]>(() => getRoutedItems());
  const [itemSearch, setItemSearch] = useState("");
  const [itemFieldFilter, setItemFieldFilter] = useState("all");
  const [itemPage, setItemPage] = useState(1);

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<RoutedItem | null>(null);
  const [assignDepartment, setAssignDepartment] = useState("");
  const [assignStaff, setAssignStaff] = useState("");

  const [requestDetail, setRequestDetail] = useState<RoutedItem | null>(null);

  const itemFields = useMemo(
    () => Array.from(new Set(items.map((i) => i.field))),
    [items],
  );
  const filteredItems = useMemo(() => {
    return items.filter(
      (i) =>
        i.sender.toLowerCase().includes(itemSearch.toLowerCase()) &&
        (itemFieldFilter === "all" || i.field === itemFieldFilter),
    );
  }, [items, itemSearch, itemFieldFilter]);
  const itemTotalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / PAGE_SIZE),
  );
  const paginatedItems = filteredItems.slice(
    (itemPage - 1) * PAGE_SIZE,
    itemPage * PAGE_SIZE,
  );

  const handleOpenAssign = (item: RoutedItem) => {
    setCurrentItem(item);
    setAssignDepartment(item.routedDepartment);
    setAssignStaff(item.routedStaff);
    setIsAssignOpen(true);
  };

  const handleSaveAssign = () => {
    if (!currentItem) return;
    updateRoutedItemAssignment(currentItem.id, assignDepartment, assignStaff);
    setItems(getRoutedItems());
    setIsAssignOpen(false);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Danh sách điều phối
          </h1>
          <p className="text-muted-foreground mt-1">
            Thông tin tiếp nhận đã được điều phối cho cán bộ phụ trách, có thể
            điều chỉnh lại cán bộ tiếp nhận khi cần.
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>Thông tin tiếp nhận gần đây</CardTitle>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo người gửi..."
                  className="pl-9"
                  value={itemSearch}
                  onChange={(e) => {
                    setItemSearch(e.target.value);
                    setItemPage(1);
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={itemFieldFilter}
                  onChange={(e) => {
                    setItemFieldFilter(e.target.value);
                    setItemPage(1);
                  }}
                  className="w-44"
                >
                  <option value="all">Tất cả lĩnh vực</option>
                  {itemFields.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Người gửi</TableHead>
                  <TableHead>Lĩnh vực</TableHead>
                  <TableHead>Thông tin yêu cầu</TableHead>
                  <TableHead>Điều phối tới</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => setRequestDetail(item)}
                  >
                    <TableCell className="whitespace-nowrap">
                      {item.date}
                    </TableCell>
                    <TableCell className="font-medium">{item.sender}</TableCell>
                    <TableCell>{item.field}</TableCell>
                    <TableCell className="max-w-[220px]">
                      <div className="truncate font-medium">{item.title}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {item.content}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <span>{item.routedDepartment}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {item.routedStaff}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="success"
                        className="gap-1 bg-green-100 text-green-800"
                      >
                        <CheckCircle2 className="h-3 w-3" /> Đã điều phối
                      </Badge>
                    </TableCell>
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Điều chỉnh cán bộ"
                        onClick={() => handleOpenAssign(item)}
                      >
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedItems.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Không tìm thấy kết quả nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Pagination
              page={itemPage}
              totalPages={itemTotalPages}
              onPageChange={setItemPage}
              totalItems={filteredItems.length}
              pageSize={PAGE_SIZE}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogHeader>
          <DialogTitle>Điều chỉnh cán bộ tiếp nhận</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Phòng ban phụ trách</Label>
            <Select
              value={assignDepartment}
              onChange={(e) => setAssignDepartment(e.target.value)}
            >
              {mockDepartments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Cán bộ tiếp nhận</Label>
            <Select
              value={assignStaff}
              onChange={(e) => setAssignStaff(e.target.value)}
            >
              {mockStaff.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAssignOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleSaveAssign}>Lưu thay đổi</Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={!!requestDetail}
        onOpenChange={(open) => !open && setRequestDetail(null)}
      >
        {requestDetail && (
          <>
            <DialogHeader>
              <DialogTitle>{requestDetail.title}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{requestDetail.field}</Badge>
                <span className="text-xs text-muted-foreground">
                  Gửi ngày {requestDetail.date}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Người gửi</p>
                  <p className="font-medium">{requestDetail.sender}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">{requestDetail.phone}</p>
                </div>
              </div>

              {requestDetail.address && (
                <div className="flex items-start gap-1.5 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>{requestDetail.address}</span>
                </div>
              )}

              <div>
                <p className="mb-1 text-sm text-muted-foreground">
                  Nội dung yêu cầu
                </p>
                <p className="text-sm leading-relaxed">
                  {requestDetail.content}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-muted-foreground">Điều phối tới:</span>
                <span>{requestDetail.routedDepartment}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span className="font-medium">{requestDetail.routedStaff}</span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRequestDetail(null)}>
                Đóng
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </Layout>
  );
}
