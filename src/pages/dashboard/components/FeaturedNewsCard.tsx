import { Link } from "wouter";
import { Star, ImageOff } from "lucide-react";
import type { NewsItem } from "@/features/news/types/get-news.response";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui";
import { Spinner } from "../../../shared/components/ui/spinner";

type FeaturedNewsCardProps = {
  items: NewsItem[];
  isLoading?: boolean;
  showViewAll?: boolean;
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export function FeaturedNewsCard({
  items,
  isLoading,
  showViewAll = true,
}: FeaturedNewsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Bản tin nổi bật</CardTitle>
        {showViewAll && (
          <Link href="/news" className="text-sm text-primary hover:underline">
            Xem tất cả
          </Link>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Spinner className="h-4 w-4" />
            Đang tải bản tin nổi bật...
          </div>
        ) : items.length === 0 ? (
          <p className="py-8 text-sm text-muted-foreground">
            Chưa có bản tin nào được đánh dấu nổi bật.
          </p>
        ) : (
          items.map((item, index) => (
            <Link
              key={item.id}
              href={`/news/${item.id}`}
              className="block rounded-lg border border-border/70 p-3 transition-colors hover:bg-slate-50"
            >
              <div className="flex gap-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageOff className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Star className="h-3 w-3" /> Nổi bật #{index + 1}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(item.time_create)}
                    </span>
                  </div>
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {item.short_describe}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
