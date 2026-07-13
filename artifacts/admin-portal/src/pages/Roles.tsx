import React, { useEffect, useMemo, useState } from "react";
import { Layout } from "../components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Label,
  Badge,
  Pagination,
  cn,
} from "../components/ui";
import { mockRoles, allPermissions } from "../data/mock";
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckSquare,
  Square,
  Users,
} from "lucide-react";

const PAGE_SIZE = 5;

export default function Roles() {
  const [roles, setRoles] = useState(mockRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRoleId, setSelectedRoleId] = useState(mockRoles[0]?.id ?? "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<any>(null);

  const filtered = useMemo(
    () =>
      roles.filter((r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [roles, searchTerm],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  useEffect(() => {
    // Keep a valid selection whenever the visible/filtered list changes.
    if (
      !paginated.some((r) => r.id === selectedRoleId) &&
      paginated.length > 0
    ) {
      setSelectedRoleId(paginated[0].id);
    }
  }, [paginated, selectedRoleId]);

  const handleOpenDialog = (role: any = null) => {
    setCurrentRole(
      role || { id: "", name: "", desc: "", users: 0, permissions: [] },
    );
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (currentRole.id) {
      setRoles(roles.map((r) => (r.id === currentRole.id ? currentRole : r)));
    } else {
      const newRole = {
        ...currentRole,
        id: Date.now().toString(),
        permissions: currentRole.permissions || [],
      };
      setRoles([...roles, newRole]);
      setSelectedRoleId(newRole.id);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa vai trò này?")) {
      const remaining = roles.filter((r) => r.id !== id);
      setRoles(remaining);
      if (selectedRoleId === id) setSelectedRoleId(remaining[0]?.id ?? "");
    }
  };

  const togglePermission = (perm: string) => {
    if (!selectedRole) return;
    const has = selectedRole.permissions.includes(perm);
    const updated = {
      ...selectedRole,
      permissions: has
        ? selectedRole.permissions.filter((p: string) => p !== perm)
        : [...selectedRole.permissions, perm],
    };
    setRoles(roles.map((r) => (r.id === updated.id ? updated : r)));
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Vai trò & Phân quyền
            </h1>
            <p className="text-muted-foreground mt-1">
              Chọn một vai trò để xem và chỉnh sửa quyền hạn tương ứng.
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="h-4 w-4" /> Thêm vai trò
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-[340px_1fr]">
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Danh sách vai trò
              </CardTitle>
              <div className="relative pt-2">
                <Search className="absolute left-2.5 top-5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm vai trò..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                {paginated.map((role) => {
                  const isSelected = role.id === selectedRole?.id;
                  return (
                    <div
                      key={role.id}
                      onClick={() => setSelectedRoleId(role.id)}
                      className={cn(
                        "flex items-center justify-between p-4 border-b last:border-0 cursor-pointer transition-colors",
                        isSelected
                          ? "bg-primary/10 border-l-4 border-l-primary"
                          : "hover:bg-slate-50 border-l-4 border-l-transparent",
                      )}
                    >
                      <div>
                        <p
                          className={cn(
                            "font-medium",
                            isSelected && "text-primary",
                          )}
                        >
                          {role.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {role.users} người dùng
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDialog(role);
                          }}
                        >
                          <Edit2 className="h-3 w-3 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(role.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {paginated.length === 0 && (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    Không tìm thấy vai trò nào.
                  </div>
                )}
              </div>
              <div className="px-4 pb-4">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  totalItems={filtered.length}
                  pageSize={PAGE_SIZE}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            {selectedRole ? (
              <>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      {selectedRole.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedRole.desc || "Chưa có mô tả"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5" /> {selectedRole.users}{" "}
                      người dùng đang giữ vai trò này
                    </div>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {selectedRole.permissions.length}/{allPermissions.length}{" "}
                    quyền
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium mb-3">Quyền hạn được cấp</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {allPermissions.map((perm) => {
                      const granted = selectedRole.permissions.includes(perm);
                      return (
                        <button
                          key={perm}
                          type="button"
                          onClick={() => togglePermission(perm)}
                          className={cn(
                            "flex items-center gap-2 rounded-md border px-3 py-2.5 text-sm text-left transition-colors",
                            granted
                              ? "border-primary/30 bg-primary/5 text-foreground"
                              : "border-input text-muted-foreground hover:bg-slate-50",
                          )}
                        >
                          {granted ? (
                            <CheckSquare className="h-4 w-4 text-primary shrink-0" />
                          ) : (
                            <Square className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                          {perm}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Nhấn vào một quyền để cấp hoặc thu hồi cho vai trò này.
                  </p>
                </CardContent>
              </>
            ) : (
              <CardContent className="py-16 text-center text-muted-foreground">
                Chọn một vai trò ở danh sách bên trái để xem chi tiết.
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogHeader>
          <DialogTitle>
            {currentRole?.id ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Tên vai trò</Label>
            <Input
              value={currentRole?.name || ""}
              onChange={(e) =>
                setCurrentRole({ ...currentRole, name: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Mô tả</Label>
            <Input
              value={currentRole?.desc || ""}
              onChange={(e) =>
                setCurrentRole({ ...currentRole, desc: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave}>Lưu thông tin</Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
}
