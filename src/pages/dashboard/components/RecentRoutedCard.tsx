import { Card, CardContent, CardHeader, CardTitle, Badge } from "../../../shared/components/ui";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import type { mockRoutedItems } from "../../../shared/data/mock";

type RecentRoutedCardProps = {
  items: (typeof mockRoutedItems)[number][];
};

export function RecentRoutedCard({ items }: RecentRoutedCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Thông tin điều phối gần đây</CardTitle>
        <Link href="/routing" className="text-sm text-primary hover:underline">
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
              <p className="truncate text-sm font-medium">
                {item.sender} — {item.field}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>{item.routedDepartment}</span>
                <ArrowRight className="h-3 w-3" />
                <span>{item.routedStaff}</span>
              </div>
            </div>
            <Badge
              variant="success"
              className="shrink-0 gap-1 bg-green-100 text-green-800"
            >
              <CheckCircle2 className="h-3 w-3" /> Đã điều phối
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
