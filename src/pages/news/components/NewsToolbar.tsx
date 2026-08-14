import { CardHeader, Input } from "../../../shared/components/ui";
import { Search } from "lucide-react";
import { NewsCategoryFilter } from "./NewsCategoryFilter";
import type { CategoryItem } from "@/features/category-news/types/get-categories.response";

type NewsToolbarProps = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  categories?: CategoryItem[];
  categoryFilter?: number;
  onCategoryFilterChange: (value: number | undefined) => void;
};

export function NewsToolbar({
  searchTerm,
  onSearchTermChange,
  categories,
  categoryFilter,
  onCategoryFilterChange,
}: NewsToolbarProps) {
  return (
    <CardHeader className="flex flex-col gap-3 pb-3 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm tiêu đề bản tin..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <NewsCategoryFilter
          categories={categories}
          value={categoryFilter}
          onChange={onCategoryFilterChange}
        />
      </div>
      {/* Tạm ẩn bộ lọc trạng thái, sẽ mở lại sau
      <div className="flex flex-wrap items-center gap-2">
        <Select
          className="w-[150px]"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">Tất cả trạng thái</option>
          {statusOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </div>
      */}
    </CardHeader>
  );
}
