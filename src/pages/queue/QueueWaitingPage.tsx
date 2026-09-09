import { useEffect, useState } from "react";

import { Layout } from "@/shared/components/Layout";
import { useQueueQuery } from "@/features/queue/hooks/queue.hook";
import { NumberGrid } from "./components/NumberGrid";
import { QueueSidebar } from "./components/QueueSidebar";

export default function QueueWaitingPage() {
  const [selectedQueueId, setSelectedQueueId] = useState("");
  const queueQuery = useQueueQuery();
  const queues = queueQuery.data ?? [];
  const selectedQueue = queues.find((queue) => queue.queue_id === selectedQueueId);

  useEffect(() => {
    if (!selectedQueueId && queues.length > 0) {
      setSelectedQueueId(queues[0].queue_id);
    }
  }, [queues, selectedQueueId]);

  return (
    <Layout>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Bốc số chờ</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi danh sách số đã bốc theo từng quầy tiếp nhận.
          </p>
        </div>

        <div className="grid min-w-0 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <QueueSidebar
            queues={queues}
            selectedQueueId={selectedQueueId}
            isLoading={queueQuery.isLoading}
            isError={queueQuery.isError}
            onSelectQueue={setSelectedQueueId}
          />
          <NumberGrid
            queueId={selectedQueueId}
            queueName={selectedQueue?.queue_name ?? ""}
          />
        </div>
      </div>
    </Layout>
  );
}
