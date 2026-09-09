import { useMemo, useState } from "react";
import { AlertCircle, Ticket } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, Input } from "@/shared/components/ui";
import { Spinner } from "@/shared/components/ui/spinner";
import { cn } from "@/shared/lib/utils";
import type { QueueItem } from "@/features/queue/types/get-queue.response";

type QueueSidebarProps = {
  queues: QueueItem[];
  selectedQueueId: string;
  isLoading: boolean;
  isError: boolean;
  onSelectQueue: (queueId: string) => void;
};

export function QueueSidebar({
  queues,
  selectedQueueId,
  isLoading,
  isError,
  onSelectQueue,
}: QueueSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredQueues = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return query
      ? queues.filter((queue) => queue.queue_name.toLowerCase().includes(query))
      : queues;
  }, [queues, searchTerm]);

  return (
    <Card className="min-w-0">
      <CardHeader className="border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Danh sách quầy bốc số</CardTitle>
        </div>
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Tìm kiếm quầy..."
          className="mt-3"
        />
      </CardHeader>
      <CardContent className="pt-4">
        <div className="max-h-[620px] space-y-2 overflow-y-auto">
          {isLoading && queues.length === 0 && (
            <div className="flex justify-center py-8">
              <Spinner className="h-5 w-5" />
            </div>
          )}
          {isError && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Không tải được danh sách quầy.
            </div>
          )}
          {!isLoading && !isError && filteredQueues.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Không tìm thấy quầy nào.
            </p>
          )}
          {filteredQueues.map((queue) => {
            const isSelected = queue.queue_id === selectedQueueId;

            return (
              <button
                key={queue.queue_id}
                type="button"
                onClick={() => onSelectQueue(queue.queue_id)}
                className={cn(
                  "w-full rounded-lg border px-3 py-3 text-left transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-transparent hover:border-border hover:bg-slate-50",
                )}
              >
                <span className="block font-medium leading-snug">{queue.queue_name}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
