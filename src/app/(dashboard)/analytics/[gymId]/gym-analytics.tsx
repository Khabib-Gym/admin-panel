'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/stat-card';
import { AreaChart, BarChart } from '@/components/charts';
import { PageLoader } from '@/components/shared/loading-spinner';
import { useGym, useGymAnalytics } from '@/hooks/queries/use-gyms';
import { ArrowLeft, Users, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface GymAnalyticsViewProps {
  gymId: string;
}

// Mock data - replace with real API when available
const mockVisitsData = [
  { name: 'Week 1', value: 245 },
  { name: 'Week 2', value: 312 },
  { name: 'Week 3', value: 298 },
  { name: 'Week 4', value: 356 },
];

const mockClassData = [
  { name: 'HIIT', value: 24 },
  { name: 'Strength', value: 18 },
  { name: 'Cardio', value: 15 },
  { name: 'Boxing', value: 12 },
];

export function GymAnalyticsView({ gymId }: GymAnalyticsViewProps) {
  const { data: gymData, isLoading: gymLoading } = useGym(gymId);
  const { data: analytics, isLoading: analyticsLoading } = useGymAnalytics(gymId);

  if (gymLoading || analyticsLoading) {
    return <PageLoader />;
  }

  if (!gymData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Gym not found</h2>
        <Button asChild className="mt-4">
          <Link href="/gyms">Back to Gyms</Link>
        </Button>
      </div>
    );
  }

  const gym = gymData.gym;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/gyms/${gymId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{gym.name} Analytics</h1>
          <p className="text-muted-foreground">
            Performance metrics for {gym.city}, {gym.country}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Members" value={analytics?.total_members ?? 0} icon={Users} />
        <StatCard
          title="Active Members"
          value={analytics?.active_members ?? 0}
          description={`${analytics?.new_members_this_month ?? 0} new this month`}
          icon={Users}
        />
        <StatCard
          title="Visits This Week"
          value={analytics?.visits_this_week ?? 0}
          icon={TrendingUp}
        />
        <StatCard
          title="Classes This Week"
          value={analytics?.classes_this_week ?? 0}
          icon={Calendar}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <AreaChart
          title="Visits Over Time"
          description="Weekly gym visits"
          data={mockVisitsData}
          color="#3b82f6"
        />
        <BarChart
          title="Popular Classes"
          description="Classes by attendance"
          data={mockClassData}
          color="#10b981"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Avg Daily Visits"
          value={analytics?.average_daily_visits?.toFixed(0) ?? 0}
          icon={TrendingUp}
        />
        <StatCard
          title="Avg Class Attendance"
          value={`${((analytics?.average_class_attendance ?? 0) * 100).toFixed(0)}%`}
          icon={Calendar}
        />
        <StatCard
          title="Revenue This Month"
          value={`$${analytics?.revenue_this_month?.toFixed(0) ?? 0}`}
          icon={DollarSign}
        />
      </div>
    </div>
  );
}
