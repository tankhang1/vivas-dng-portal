import { useMemo } from "react";
import { Layout } from "../../shared/components/Layout";
import { useDashboardQuery } from "@/features/dashboard/hooks/dashboard.hook";
import { mockNews, mockRoutedItems, mockRoutingRules } from "../../shared/data/mock";
import { DashboardHeader } from "./components/DashboardHeader";
import { StatsOverviewCards } from "./components/StatsOverviewCards";
import { StaffByFieldChart } from "./components/StaffByFieldChart";
import { RecentNewsCard } from "./components/RecentNewsCard";
import { RecentRoutedCard } from "./components/RecentRoutedCard";

export default function Dashboard() {
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useDashboardQuery();

  const staffByField = useMemo(() => {
    const counts = new Map<string, number>();
    mockRoutingRules.forEach((rule) => {
      if (!rule.staff) return;
      counts.set(rule.field, (counts.get(rule.field) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([name, soLuong]) => ({
      name,
      soLuong,
    }));
  }, []);

  const recentNews = [...mockNews].slice(-4).reverse();
  const recentRouted = [...mockRoutedItems].slice(0, 4);

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <DashboardHeader />

        <StatsOverviewCards
          dashboardData={dashboardData}
          isLoading={isDashboardLoading}
        />

        <div className="grid gap-6 lg:grid-cols-1">
          <StaffByFieldChart data={staffByField} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <RecentNewsCard items={recentNews} />
          <RecentRoutedCard items={recentRouted} />
        </div>
      </div>
    </Layout>
  );
}
