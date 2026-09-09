import { useEffect, useMemo, useRef } from "react";
import { AlertCircle, Hash, RefreshCw } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui";
import { Spinner } from "@/shared/components/ui/spinner";
import { useInfiniteNumbersByQueueQuery } from "@/features/queue/hooks/queue.hook";
import { formatDateTime, PAGE_SIZE } from "../utils";

type NumberGridProps = {
  queueId: string;
  queueName: string;
};

export function NumberGrid({
  queueId,
  queueName,
}: NumberGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const numbersQuery = useInfiniteNumbersByQueueQuery(
    { queueId, sz: PAGE_SIZE },
    queueId !== "",
  );
  const items = useMemo(
    () => numbersQuery.data?.pages.flatMap((page) => page.content) ?? [],
    [numbersQuery.data],
  );

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !numbersQuery.hasNextPage || numbersQuery.isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void numbersQuery.fetchNextPage();
        }
      },
      { root: scrollContainerRef.current, rootMargin: "160px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [numbersQuery]);

  return (
    <Card className="min-w-0">
      <CardHeader className="border-b border-border pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Danh sách số đã bốc</CardTitle>
            </div>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {queueName || "Chọn một quầy để xem danh sách số"}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void numbersQuery.refetch()}
            disabled={numbersQuery.isFetching}
            className="w-full sm:w-auto"
          >
            {numbersQuery.isFetching && !numbersQuery.isFetchingNextPage ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Làm mới
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {numbersQuery.isLoading && (
          <div className="flex justify-center py-16">
            <Spinner className="h-6 w-6" />
          </div>
        )}
        {numbersQuery.isError && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Không tải được danh sách số đã bốc.
          </div>
        )}
        {!numbersQuery.isLoading && !numbersQuery.isError && items.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">
            Quầy này chưa có số nào được bốc.
          </p>
        )}
        {!numbersQuery.isLoading && !numbersQuery.isError && items.length > 0 && (
          <div ref={scrollContainerRef} className="max-h-[620px] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-3 2xl:grid-cols-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-border bg-white p-4 text-center shadow-sm"
                >
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Số thứ tự
                  </p>
                  <p className="mt-2 text-5xl font-bold tabular-nums leading-none text-foreground md:text-6xl">
                    {item.number}
                  </p>
                  <div className="mt-4 text-xs text-muted-foreground sm:text-sm">
                    <div className="border-t border-border pt-2 text-center">
                      {formatDateTime(item.time_create)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div ref={loadMoreRef} className="flex min-h-10 items-center justify-center">
              {numbersQuery.isFetchingNextPage && <Spinner className="h-4 w-4" />}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
