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
  deleteRoutingRule,
  getRoutingRules,
  saveRoutingRule,
  type RoutingRule,
} from "./store";
import { Waypoints, Plus, Edit2, Trash2, Search } from "lucide-react";

const PAGE_SIZE = 5;

export default function RoutingSetupPage() {
  const [rules, setRules] = useState<RoutingRule[]>(() => getRoutingRules());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState<RoutingRule | null>(null);

  const [ruleSearch, setRuleSearch] = useState("");
  const [ruleDeptFilter, setRuleDeptFilter] = useState("all");
  const [rulePage, setRulePage] = useState(1);

  const filteredRules = useMemo(() => {
    return rules.filter(
      (r) =>
        r.field.toLowerCase().includes(ruleSearch.toLowerCase()) &&
        (ruleDeptFilter === "all" || r.department === ruleDeptFilter),
    );
  }, [rules, ruleSearch, ruleDeptFilter]);
  const ruleTotalPages = Math.max(
    1,
    Math.ceil(filteredRules.length / PAGE_SIZE),
  );
  const paginatedRules = filteredRules.slice(
    (rulePage - 1) * PAGE_SIZE,
    rulePage * PAGE_SIZE,
  );

  const handleOpenDialog = (rule: RoutingRule | null = null) => {
    setCurrentRule(
      rule || {
        id: "",
        field: "",
        department: mockDepartments[0].name,
        staff: mockStaff[0].name,
      },
    );
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!currentRule) return;
    saveRoutingRule(currentRule);
    setRules(getRoutingRules());
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Xóa quy tắc điều phối này?")) return;
    deleteRoutingRule(id);
    setRules(getRoutingRules());
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Thiết lập điều phối
            </h1>
            <p className="text-muted-foreground mt-1">
              Thông tin tiếp nhận được tự động điều phối cho cán bộ phụ trách
              theo lĩnh vực liên quan.
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" /> Thêm quy tắc
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Waypoints className="h-5 w-5 text-primary" />
              Quy tắc điều phối theo lĩnh vực phụ trách
            </CardTitle>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo lĩnh vực..."
                  className="pl-9"
                  value={ruleSearch}
                  onChange={(e) => {
                    setRuleSearch(e.target.value);
                    setRulePage(1);
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={ruleDeptFilter}
                  onChange={(e) => {
                    setRuleDeptFilter(e.target.value);
                    setRulePage(1);
                  }}
                  className="w-48"
                >
                  <option value="all">Tất cả phòng ban</option>
                  {mockDepartments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
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
                  <TableHead>Lĩnh vực</TableHead>
                  <TableHead>Phòng ban phụ trách</TableHead>
                  <TableHead>Cán bộ tiếp nhận</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.field}</TableCell>
                    <TableCell>{rule.department}</TableCell>
                    <TableCell>{rule.staff}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(rule)}
                      >
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(rule.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedRules.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Không tìm thấy quy tắc nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Pagination
              page={rulePage}
              totalPages={ruleTotalPages}
              onPageChange={setRulePage}
              totalItems={filteredRules.length}
              pageSize={PAGE_SIZE}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle>
            {currentRule?.id ? "Chỉnh sửa quy tắc" : "Thêm quy tắc điều phối"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Lĩnh vực</Label>
            <Input
              value={currentRule?.field || ""}
              onChange={(e) =>
                setCurrentRule(
                  currentRule && { ...currentRule, field: e.target.value },
                )
              }
              placeholder="Ví dụ: Môi trường, Trật tự, An ninh..."
            />
          </div>
          <div className="grid gap-2">
            <Label>Phòng ban phụ trách</Label>
            <Select
              value={currentRule?.department || ""}
              onChange={(e) =>
                setCurrentRule(
                  currentRule && {
                    ...currentRule,
                    department: e.target.value,
                  },
                )
              }
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
              value={currentRule?.staff || ""}
              onChange={(e) =>
                setCurrentRule(
                  currentRule && { ...currentRule, staff: e.target.value },
                )
              }
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
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave}>Lưu quy tắc</Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
}
