import { Card, CardContent, CardHeader, CardTitle, Badge } from "../../../shared/components/ui";
import { Globe, FileEdit } from "lucide-react";
import { Link } from "wouter";
import type { mockNews } from "../../../shared/data/mock";

type RecentNewsCardProps = {
  items: (typeof mockNews)[number][];
};

export function RecentNewsCard({ items }: RecentNewsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Bản tin gần đây</CardTitle>
        <Link href="/news" className="text-sm text-primary hover:underline">
          Xem tất cả
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">
                {item.source} · {item.date}
              </p>
            </div>
            {item.status === "published" ? (
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
