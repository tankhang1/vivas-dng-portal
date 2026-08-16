import { useDeferredValue, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Layout } from "../../shared/components/Layout";
import { Button, Card, CardContent, Pagination } from "../../shared/components/ui";
import {
  useRemoveNewsProcessMutation,
  useSearchNewsQuery,
} from "@/features/news/hooks/news.hook";
import { useNewsCategoriesQuery } from "@/features/category-news/hooks/category-news.hook";
import { type NewsArticle } from "./types";
import { NewsDetailDialog } from "./NewsDetailDialog";
import { NewsToolbar } from "./components/NewsToolbar";
import { NewsTable } from "./components/NewsTable";
import { newsItemToArticle } from "./dto/news-item-adapter";
import { Plus } from "lucide-react";

const PAGE_SIZE = 5;

export default function NewsPage() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDeferredValue(searchTerm);
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>(
    undefined,
  );
  const [page, setPage] = useState(1);
  const [detailArticle, setDetailArticle] = useState<NewsArticle | null>(null);

  const { data, isLoading, isFetching, isError, refetch } = useSearchNewsQuery({
    key: debouncedSearch || undefined,
    category_item: categoryFilter,
    sz: PAGE_SIZE,
    nu: page - 1,
  });

  const { data: categoriesData } = useNewsCategoriesQuery({ sz: 100, nu: 0 });
  const categoryNameById = useMemo(() => {
    const map = new Map<number, string>();
    categoriesData?.content.forEach((category) => {
      map.set(category.id, category.name);
    });
    return map;
  }, [categoriesData]);

  const items = data?.content ?? [];
  const rows = useMemo(
    () =>
      items.map((item) => ({
        item,
        article: newsItemToArticle(item),
      })),
    [items],
  );
  const totalPages = Math.max(1, data?.page.totalPages ?? 1);
  const totalItems = data?.page.totalElements ?? 0;
  const showInitialLoading = isLoading && rows.length === 0;
  const showRefetchOverlay = isFetching && !showInitialLoading;

  const removeNewsMutation = useRemoveNewsProcessMutation();

  const goToCreate = () => navigate("/news/new");
  const goToEdit = (id: string) => navigate(`/news/${id}/edit`);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bản tin này?")) return;
    try {
      await removeNewsMutation.mutateAsync({ news_item: Number(id) });
      setDetailArticle((current) => (current?.id === id ? null : current));
      refetch();
    } catch {
      window.alert("Xóa bản tin thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Tin tức & Thông báo
            </h1>
            <p className="mt-1 text-muted-foreground">
              Quản lý bài viết, thông báo hiển thị trên Cổng thông tin điện tử.
            </p>
          </div>
          <Button onClick={goToCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Tạo mới
          </Button>
        </div>

        <Card>
          <NewsToolbar
            searchTerm={searchTerm}
            onSearchTermChange={(value) => {
              setSearchTerm(value);
              setPage(1);
            }}
            categories={categoriesData?.content}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={(value) => {
              setCategoryFilter(value);
              setPage(1);
            }}
          />
          <CardContent>
            <NewsTable
              rows={rows}
              categoryNameById={categoryNameById}
              isError={isError}
              showInitialLoading={showInitialLoading}
              showRefetchOverlay={showRefetchOverlay}
              onView={setDetailArticle}
              onEdit={goToEdit}
              onDelete={handleDelete}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={totalItems}
              pageSize={PAGE_SIZE}
            />
          </CardContent>
        </Card>
      </div>

      <NewsDetailDialog
        open={Boolean(detailArticle)}
        article={detailArticle}
        onOpenChange={(open) => {
          if (!open) setDetailArticle(null);
        }}
        onEdit={(id) => navigate(`/news/${id}/edit`)}
        onDelete={handleDelete}
      />
    </Layout>
  );
}
