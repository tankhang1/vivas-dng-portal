import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Waypoints } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, Input } from "@/shared/components/ui";
import { Spinner } from "@/shared/components/ui/spinner";
import type { CategoryItem } from "@/features/category-news/types/get-categories.response";

type CategorySidebarProps = {
  categories: Array<Pick<CategoryItem, "id" | "name">>;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  selectedCategoryId: number | "";
  onSelectCategory: (categoryId: number) => void;
  onLoadMore: () => void;
};

export function CategorySidebar({
  categories,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  selectedCategoryId,
  onSelectCategory,
  onLoadMore,
}: CategorySidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const filteredCategories = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return query
      ? categories.filter((category) => category.name.toLowerCase().includes(query))
      : categories;
  }, [categories, searchTerm]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { root: scrollContainerRef.current, rootMargin: "160px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  return (
    <Card className="min-w-0">
      <CardHeader className="border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Waypoints className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Danh mục đặt lịch hẹn</CardTitle>
        </div>
        <div className="relative mt-3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm danh mục..."
            className="pl-9"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div ref={scrollContainerRef} className="max-h-[620px] space-y-2 overflow-y-auto">
          {isLoading && categories.length === 0 && (
            <div className="flex justify-center py-8">
              <Spinner className="h-5 w-5" />
            </div>
          )}
          {!isLoading && filteredCategories.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Không tìm thấy danh mục nào.
            </p>
          )}
          {filteredCategories.map((category) => {
            const isSelected = category.id === selectedCategoryId;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => onSelectCategory(category.id)}
                className={[
                  "w-full rounded-lg border px-3 py-3 text-left transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-transparent hover:border-border hover:bg-slate-50",
                ].join(" ")}
              >
                <span className="font-medium">{category.name}</span>
              </button>
            );
          })}
          <div ref={loadMoreRef} className="flex min-h-10 items-center justify-center">
            {isFetchingNextPage && <Spinner className="h-4 w-4" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
