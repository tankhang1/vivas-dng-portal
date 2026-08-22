import { useMemo } from "react";
import { Layout } from "../../shared/components/Layout";
import { useDashboardQuery } from "@/features/dashboard/hooks/dashboard.hook";
import { mockRoutingRules } from "../../shared/data/mock";
import { DashboardHeader } from "./components/DashboardHeader";
import { StatsOverviewCards } from "./components/StatsOverviewCards";
import { StaffByFieldChart } from "./components/StaffByFieldChart";
import { RecentNewsCard } from "./components/RecentNewsCard";
import { FeaturedNewsCard } from "./components/FeaturedNewsCard";
import { LatestFeedbackCard } from "./components/LatestFeedbackCard";
import {
  useAllNewsQuery,
  useNewsIndexQuery,
} from "@/features/news/hooks/news.hook";
import { useSearchCommentsQuery } from "@/features/comment/hooks/comment.hook";
import { useAuth } from "@/shared/providers";

const DASHBOARD_ITEM_LIMIT = 4;

export default function Dashboard() {
  const { isAdminRole } = useAuth();
  const { data: dashboardData, isLoading: isDashboardLoading } =
    useDashboardQuery();
  const { data: recentNewsData, isLoading: isRecentNewsLoading } =
    useAllNewsQuery({
      sz: DASHBOARD_ITEM_LIMIT,
      nu: 0,
    });
  const { data: featuredNewsData, isLoading: isFeaturedNewsLoading } =
    useNewsIndexQuery({
      sz: DASHBOARD_ITEM_LIMIT,
      nu: 0,
    });
  const { data: commentsData, isLoading: isCommentsLoading } =
    useSearchCommentsQuery({
      sz: DASHBOARD_ITEM_LIMIT,
      nu: 0,
    });

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

  const recentNews = recentNewsData?.content ?? [];
  const featuredNews = featuredNewsData?.content ?? [];
  const latestFeedback = commentsData?.content ?? [];

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <DashboardHeader />

        <StatsOverviewCards
          dashboardData={dashboardData}
          isLoading={isDashboardLoading}
        />

        {/* <div className="grid gap-6 lg:grid-cols-1">
          <StaffByFieldChart data={staffByField} />
        </div> */}

        <div className="grid gap-6 xl:grid-cols-3">
          <RecentNewsCard
            items={recentNews}
            isLoading={isRecentNewsLoading}
            showViewAll={isAdminRole}
          />
          <FeaturedNewsCard
            items={featuredNews}
            isLoading={isFeaturedNewsLoading}
            showViewAll={isAdminRole}
          />
          <LatestFeedbackCard
            items={latestFeedback}
            isLoading={isCommentsLoading}
          />
        </div>
      </div>
    </Layout>
  );
}
