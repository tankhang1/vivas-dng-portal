import { Card, CardContent } from "../../../shared/components/ui";
import { Spinner } from "../../../shared/components/ui/spinner";
import { BookUser, MapPinned, Smile, Briefcase, type LucideIcon } from "lucide-react";
import type { GetDashboardResponse } from "@/features/dashboard/types/get-dashboard.response";

type StatsOverviewCardsProps = {
  dashboardData: GetDashboardResponse | undefined;
  isLoading: boolean;
};

type OverviewBlock = {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
};

export function StatsOverviewCards({
  dashboardData,
  isLoading,
}: StatsOverviewCardsProps) {
  const overviewBlocks: OverviewBlock[] = [
    {
      label: "Tổng diện tích",
      value: dashboardData
        ? `${dashboardData.total_acreage.toLocaleString("vi-VN")} ha`
        : "—",
      icon: MapPinned,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Chỉ số hài lòng",
      value: dashboardData ? `${dashboardData.satisfaction_index}%` : "—",
      icon: Smile,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Dịch vụ công",
      value: dashboardData
        ? dashboardData.total_public_service.toLocaleString("vi-VN")
        : "—",
      icon: Briefcase,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Tổng công dân",
      value: dashboardData
        ? dashboardData.total_citizen.toLocaleString("vi-VN")
        : "—",
      icon: BookUser,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {overviewBlocks.map((block) => (
        <Card key={block.label}>
          <CardContent className="flex items-center gap-4 pt-6">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${block.color}`}
            >
              <block.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold leading-tight">
                {isLoading ? <Spinner className="h-5 w-5" /> : block.value}
              </p>
              <p className="text-sm text-muted-foreground">{block.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
