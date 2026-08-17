import { Link } from "wouter";
import { Clock, EyeOff, MessageSquare, User, CheckCircle2 } from "lucide-react";
import type { CommentItem } from "@/features/comment/types/get-comments.response";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui";
import { Spinner } from "../../../shared/components/ui/spinner";

type LatestFeedbackCardProps = {
  items: CommentItem[];
  isLoading?: boolean;
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function statusMeta(item: CommentItem) {
  return item.staff_approve_item > 0
    ? {
        label: "Đã duyệt",
        variant: "success" as const,
        icon: CheckCircle2,
      }
    : {
        label: "Chờ duyệt",
        variant: "secondary" as const,
        icon: Clock,
      };
}

export function LatestFeedbackCard({
  items,
  isLoading,
}: LatestFeedbackCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Phản ánh mới nhất</CardTitle>
        <Link href="/feedback" className="text-sm text-primary hover:underline">
          Xem tất cả
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
            <Spinner className="h-4 w-4" />
            Đang tải phản ánh mới nhất...
          </div>
        ) : items.length === 0 ? (
          <p className="py-8 text-sm text-muted-foreground">
            Chưa có phản ánh nào được gửi lên hệ thống.
          </p>
        ) : (
          items.map((item) => {
            const meta = statusMeta(item);
            return (
              <div
                key={item.id}
                className="rounded-lg border border-border/70 p-3 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.annonymous === 1 ? (
                        <span className="inline-flex items-center gap-1">
                          <EyeOff className="h-3 w-3" />
                          Ẩn danh
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.name || "Không rõ người gửi"}
                        </span>
                      )}
                    </p>
                  </div>
                  <Badge variant={meta.variant} className="shrink-0 gap-1">
                    <meta.icon className="h-3 w-3" /> {meta.label}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  <span className="line-clamp-2">{item.content}</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {formatDateTime(item.time_create)}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
