import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from "../../../shared/components/ui";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import type { DepartmentRecord } from "../types";

const isSameText = (value: string, query: string) =>
  value.toLowerCase().includes(query.toLowerCase());

type DepartmentTreeSidebarProps = {
  childrenByParentId: Map<string, DepartmentRecord[]>;
  selectedDepartmentId: string;
  onSelect: (id: string) => void;
};

export function DepartmentTreeSidebar({
  childrenByParentId,
  selectedDepartmentId,
  onSelect,
}: DepartmentTreeSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const rootDepartments = childrenByParentId.get("__root__") ?? [];

  const filteredTree = useMemo(() => {
    if (!searchTerm.trim()) return rootDepartments;

    const query = searchTerm.trim().toLowerCase();

    const matchesNode = (department: DepartmentRecord): boolean => {
      if (
        isSameText(department.name, query) ||
        isSameText(department.code, query) ||
        isSameText(department.manager, query)
      ) {
        return true;
      }

      return (childrenByParentId.get(department.id) ?? []).some(matchesNode);
    };

    return rootDepartments.filter(matchesNode);
  }, [childrenByParentId, rootDepartments, searchTerm]);

  const renderTree = (items: DepartmentRecord[], depth = 0) => {
    return items.map((department) => {
      const childItems = childrenByParentId.get(department.id) ?? [];
      const isSelected = department.id === selectedDepartmentId;
      const hasChildren = childItems.length > 0;

      return (
        <div key={department.id} className="space-y-1">
          <button
            type="button"
            onClick={() => onSelect(department.id)}
            className={[
              "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
              isSelected
                ? "border-primary bg-primary/5 text-primary"
                : "border-transparent bg-transparent hover:border-border hover:bg-slate-50",
            ].join(" ")}
            style={{ paddingLeft: `${12 + depth * 18}px` }}
          >
            <span className="text-muted-foreground">
              {hasChildren ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </span>
            <span className="min-w-0 flex-1 truncate font-medium">
              {department.name}
            </span>
          </button>

          {hasChildren && (
            <div className="space-y-1">{renderTree(childItems, depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <Card className="h-fit">
      <CardHeader className="border-b border-border pb-3">
        <div>
          <CardTitle className="text-lg">Cơ cấu phòng ban</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Chọn một phòng ban để xem chi tiết ở bên phải.
          </p>
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, mã hoặc trưởng bộ phận..."
            className="pl-9"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-4">
        {filteredTree.length > 0 ? (
          renderTree(filteredTree)
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Không tìm thấy phòng ban nào.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
