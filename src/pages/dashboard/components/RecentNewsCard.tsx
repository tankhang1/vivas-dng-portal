import { Card, CardContent, CardHeader, CardTitle, Badge } from "../../../shared/components/ui";
import { Globe, FileEdit } from "lucide-react";
import { Link } from "wouter";
import type { NewsItem } from "@/features/news/types/get-news.response";
import { Spinner } from "../../../shared/components/ui/spinner";

type RecentNewsCardProps = {
  items: NewsItem[];
  isLoading?: boolean;
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export function RecentNewsCard({ items, isLoading }: RecentNewsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Bản tin gần đây</CardTitle>
        <Link href="/news" className="text-sm text-primary hover:underline">
          Xem tất cả
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isLoading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Spinner className="h-4 w-4" />
            Đang tải bản tin gần đây...
          </div>
        ) : items.length === 0 ? (
          <p className="py-8 text-sm text-muted-foreground">
            Chưa có bản tin nào.
          </p>
        ) : items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.staff_name || "Ban biên tập"} · {formatDateTime(item.time_create)}
              </p>
            </div>
            {item.status === 1 ? (
              <Badge
                variant="success"
                className="shrink-0 gap-1 bg-green-100 text-green-800"
              >
                <Globe className="h-3 w-3" /> Xuất bản
              </Badge>
            ) : (
              <Badge variant="secondary" className="shrink-0 gap-1">
                <FileEdit className="h-3 w-3" /> Nháp
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
