import { Badge } from "../../../shared/components/ui";
import { FileEdit, Globe } from "lucide-react";
import type { NewsArticle } from "../types";

type StatusBadgeProps = {
  status: NewsArticle["status"];
};

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "published") {
    return (
      <Badge variant="success" className="gap-1 bg-green-100 text-green-800">
        <Globe className="h-3 w-3" /> Đã xuất bản
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1">
      <FileEdit className="h-3 w-3" /> Bản nháp
    </Badge>
  );
}
