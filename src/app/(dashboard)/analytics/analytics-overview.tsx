'use client';

import { Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';
import { AreaChart, BarChart } from '@/components/charts';
import { StatCard } from '@/components/dashboard/stat-card';
import { PageLoader } from '@/components/shared/loading-spinner';
import {
  useClassesByTypeChartData,
  useCoachAnalytics,
  useDashboardStats,
  useVisitsChartData,
} from '@/hooks/queries/use-analytics';
import { usePermissions } from '@/hooks/use-permissions';

export function AnalyticsOverview() {
  const { isAdmin, isCoach } = usePermissions();

  // Admin-specific queries - only run for admins
  const { data: adminStats, isLoading: adminLoading } = useDashboardStats({ enabled: isAdmin });
  const { data: visitsData, isLoading: visitsLoading } = useVisitsChartData('week', {
    enabled: isAdmin,
  });
  const { data: classesData, isLoading: classesLoading } = useClassesByTypeChartData({
    enabled: isAdmin,
  });

  // Coach-specific queries - only run for coaches (non-admins)
  const { data: coachStats, isLoading: coachLoading } = useCoachAnalytics({
    enabled: !isAdmin && isCoach,
  });

  const isLoading = isAdmin ? adminLoading || visitsLoading || classesLoading : coachLoading;

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          {isAdmin ? 'Platform-wide performance metrics' : 'Your performance overview'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isAdmin ? (
          <>
            <StatCard title="Total Members" value={adminStats?.total_members ?? 0} icon={Users} />
            <StatCard title="Active Members" value={adminStats?.active_members ?? 0} icon={Users} />
            <StatCard
              title="Classes Today"
              value={adminStats?.total_classes_today ?? 0}
              icon={Calendar}
            />
            <StatCard
              title="Visits Today"
              value={adminStats?.total_visits_today ?? 0}
              icon={TrendingUp}
            />
          </>
        ) : (
          <>
            <StatCard
              title="Total Classes"
              value={coachStats?.total_classes ?? 0}
              icon={Calendar}
            />
            <StatCard
              title="Classes This Month"
              value={coachStats?.classes_this_month ?? 0}
              icon={Calendar}
            />
            <StatCard
              title="Average Rating"
              value={
                coachStats?.average_rating && coachStats.average_rating > 0
                  ? coachStats.average_rating.toFixed(1)
                  : 'N/A'
              }
              icon={TrendingUp}
            />
            <StatCard
              title="Revenue This Month"
              value={`$${coachStats?.revenue_this_month?.toFixed(0) ?? 0}`}
              icon={DollarSign}
            />
          </>
        )}
      </div>

      {/* Charts */}
      {isAdmin && (
        <div className="grid gap-4 md:grid-cols-2">
          <AreaChart
            title="Visits Over Time"
            description="Daily gym visits this week"
            data={visitsData?.data ?? []}
            color="#3b82f6"
          />
          <BarChart
            title="Classes by Type"
            description="Most popular class types"
            data={classesData?.data ?? []}
            color="#10b981"
          />
        </div>
      )}
    </div>
  );
}
