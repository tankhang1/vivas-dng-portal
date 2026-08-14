import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "../shared/components/Layout";
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
  cn,
} from "../shared/components/ui";
import { allPermissions, permissionGroups } from "../shared/data/mock";
import {
  useCreateDivisionProcessMutation,
  useDivisionsQuery,
  useEditDivisionProcessMutation,
  useRemoveDivisionProcessMutation,
} from "@/features/division/hooks/division.hook";
import type { GetDivisionsResponse } from "@/features/division/types/get-divisions.response";
import { QUERY_KEY } from "@/shared/api";
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckSquare,
  Square,
  Users,
  Layers3,
  ShieldCheck,
} from "lucide-react";

type RoleRecord = {
  id: string;
  name: string;
  desc: string;
  users: number;
  permissions: string[];
};

export default function Roles() {
  const queryClient = useQueryClient();
  const { data: divisionsData, isLoading: isDivisionsLoading } =
    useDivisionsQuery();
  const createDivisionMutation = useCreateDivisionProcessMutation();
  const editDivisionMutation = useEditDivisionProcessMutation();
  const removeDivisionMutation = useRemoveDivisionProcessMutation();
  const isSavingRole =
    createDivisionMutation.isPending || editDivisionMutation.isPending;
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const hasSeededRoles = useRef(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<any>(null);

  useEffect(() => {
    if (!hasSeededRoles.current && divisionsData?.content) {
      setRoles(
        divisionsData.content.map((division) => ({
          id: String(division.id),
          name: division.name,
          desc: division.note ?? "",
          users: 0,
          permissions: [],
        })),
      );
      hasSeededRoles.current = true;
    }
  }, [divisionsData]);

  const filtered = useMemo(
    () =>
      roles.filter((r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [roles, searchTerm],
  );

  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];
  const selectedPermissions = selectedRole?.permissions || [];
  const completion = allPermissions.length
    ? Math.round((selectedPermissions.length / allPermissions.length) * 100)
    : 0;

  useEffect(() => {
    // Keep a valid selection whenever the visible/filtered list changes.
    if (
      !filtered.some((r) => r.id === selectedRoleId) &&
      filtered.length > 0
    ) {
      setSelectedRoleId(filtered[0].id);
    }
  }, [filtered, selectedRoleId]);

  const handleOpenDialog = (role: any = null) => {
    setCurrentRole(
      role || { id: "", name: "", desc: "", users: 0, permissions: [] },
    );
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const name = (currentRole?.name ?? "").trim();
    if (!name) return;
    const desc = currentRole?.desc ?? "";

    try {
      if (currentRole.id) {
        await editDivisionMutation.mutateAsync({
          item: Number(currentRole.id),
          name,
          note: desc,
        });
        setRoles(
          roles.map((r) =>
            r.id === currentRole.id ? { ...r, name, desc } : r,
          ),
        );
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.DIVISIONS });
      } else {
        await createDivisionMutation.mutateAsync({ name, note: desc });
        await queryClient.invalidateQueries({ queryKey: QUERY_KEY.DIVISIONS });
        const refreshed = queryClient.getQueryData<GetDivisionsResponse>(
          QUERY_KEY.DIVISIONS,
        );
        const existingIds = new Set(roles.map((r) => r.id));
        const created = refreshed?.content.find(
          (division) => !existingIds.has(String(division.id)),
        );
        if (created) {
          const newRole: RoleRecord = {
            id: String(created.id),
            name: created.name,
            desc: created.note ?? "",
            users: 0,
            permissions: [],
          };
          setRoles([...roles, newRole]);
          setSelectedRoleId(newRole.id);
        }
      }
      setIsDialogOpen(false);
    } catch {
      window.alert("Lưu vai trò thất bại. Vui lòng thử lại.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vai trò này?")) return;
    try {
      await removeDivisionMutation.mutateAsync({ item: Number(id) });
      const remaining = roles.filter((r) => r.id !== id);
      setRoles(remaining);
      if (selectedRoleId === id) setSelectedRoleId(remaining[0]?.id ?? "");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.DIVISIONS });
    } catch {
      window.alert("Xóa vai trò thất bại. Vui lòng thử lại.");
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
    setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const replaceSelectedPermissions = (permissions: string[]) => {
    if (!selectedRole) return;
    const updated = {
      ...selectedRole,
      permissions,
    };
    setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const setGroupPermissions = (
    groupPermissions: readonly string[],
    enable: boolean,
  ) => {
    if (!selectedRole) return;
    const next = new Set(selectedRole.permissions);
    groupPermissions.forEach((perm) => {
      if (enable) {
        next.add(perm);
      } else {
        next.delete(perm);
      }
    });
    replaceSelectedPermissions(Array.from(next));
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex max-h-[420px] flex-col overflow-y-auto">
                {filtered.map((role) => {
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
                {filtered.length === 0 && (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    {isDivisionsLoading
                      ? "Đang tải danh sách vai trò..."
                      : "Không tìm thấy vai trò nào."}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            {selectedRole ? (
              <>
                <CardHeader className="space-y-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Shield className="h-5 w-5 text-primary" />
                          {selectedRole.name}
                        </CardTitle>
                        <Badge variant="secondary" className="shrink-0">
                          {selectedPermissions.length}/{allPermissions.length}{" "}
                          quyền
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedRole.desc || "Chưa có mô tả"}
                      </p>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Users className="h-3.5 w-3.5" /> {selectedRole.users}{" "}
                        người dùng đang giữ vai trò này
                      </div>
                    </div>
                    <div className="min-w-[260px] rounded-xl border bg-slate-50 p-4">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium">Mức độ cấp quyền</span>
                        <span className="text-muted-foreground">
                          {completion}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Vai trò này đang có {selectedPermissions.length} quyền
                        trong tổng {allPermissions.length} quyền khả dụng.
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-sm font-medium">Quyền hạn được cấp</p>
                      <p className="text-xs text-muted-foreground">
                        Chọn nhanh theo từng nhóm hoặc bật tắt từng quyền riêng
                        lẻ.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() =>
                          replaceSelectedPermissions(allPermissions)
                        }
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Chọn tất cả
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => replaceSelectedPermissions([])}
                      >
                        Bỏ chọn tất cả
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-2">
                    {permissionGroups.map((group) => {
                      const grantedCount = group.permissions.filter((perm) =>
                        selectedPermissions.includes(perm),
                      ).length;
                      const allGranted =
                        grantedCount === group.permissions.length;
                      const someGranted = grantedCount > 0 && !allGranted;

                      return (
                        <div
                          key={group.label}
                          className="rounded-xl border bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm"
                        >
                          <div className="mb-4 flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Layers3 className="h-4 w-4 text-primary" />
                                <h3 className="font-semibold text-foreground">
                                  {group.label}
                                </h3>
                              </div>
                              <p className="text-xs leading-relaxed text-muted-foreground">
                                {group.description}
                              </p>
                            </div>
                            <Badge
                              variant={
                                allGranted
                                  ? "default"
                                  : someGranted
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {grantedCount}/{group.permissions.length}
                            </Badge>
                          </div>

                          <div className="grid gap-2">
                            {group.permissions.map((perm) => {
                              const granted =
                                selectedPermissions.includes(perm);
                              return (
                                <button
                                  key={perm}
                                  type="button"
                                  onClick={() => togglePermission(perm)}
                                  className={cn(
                                    "flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-sm text-left transition-all",
                                    granted
                                      ? "border-primary/30 bg-primary/5 text-foreground shadow-sm"
                                      : "border-input bg-white text-muted-foreground hover:border-primary/20 hover:bg-primary/[0.03]",
                                  )}
                                >
                                  <span className="flex min-w-0 items-center gap-2">
                                    {granted ? (
                                      <CheckSquare className="h-4 w-4 shrink-0 text-primary" />
                                    ) : (
                                      <Square className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    )}
                                    <span className="truncate">{perm}</span>
                                  </span>
                                  <span
                                    className={cn(
                                      "rounded-full px-2 py-0.5 text-[11px] font-medium",
                                      granted
                                        ? "bg-primary/10 text-primary"
                                        : "bg-slate-100 text-muted-foreground",
                                    )}
                                  >
                                    {granted ? "Đã cấp" : "Chưa cấp"}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setGroupPermissions(group.permissions, true)
                              }
                            >
                              Chọn nhóm
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setGroupPermissions(group.permissions, false)
                              }
                            >
                              Bỏ nhóm
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
          <Button onClick={handleSave} disabled={isSavingRole}>
            {isSavingRole ? "Đang lưu..." : "Lưu thông tin"}
          </Button>
        </DialogFooter>
      </Dialog>
    </Layout>
  );
}
