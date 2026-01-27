'use client';

import { Building2, Calendar, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStats, useRecentActivity } from '@/hooks/queries/use-analytics';
import { useGyms } from '@/hooks/queries/use-gyms';
import { GymSummary } from './gym-summary';
import { RecentActivity } from './recent-activity';
import { StatCard } from './stat-card';

interface AdminDashboardProps {
  userName: string;
}

export function AdminDashboard({ userName }: AdminDashboardProps) {
  const { data: gymsData, isLoading: gymsLoading } = useGyms({ page_size: 5 });
  const { data: stats } = useDashboardStats();
  const { data: activityData, isLoading: activityLoading } = useRecentActivity(10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userName}! Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/gyms/new">Add Gym</Link>
          </Button>
          <Button asChild>
            <Link href="/classes/new">Create Class</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Gyms"
          value={stats?.total_gyms ?? 0}
          description={`${stats?.active_gyms ?? 0} active`}
          icon={Building2}
        />
        <StatCard
          title="Total Members"
          value={stats?.active_members ?? 0}
          description={`${stats?.new_members_this_month ?? 0} new this month`}
          icon={Users}
        />
        <StatCard
          title="Classes Today"
          value={stats?.total_classes_today ?? 0}
          description={`${stats?.total_classes_this_week ?? 0} this week`}
          icon={Calendar}
        />
        <StatCard
          title="Visits Today"
          value={stats?.total_visits_today ?? 0}
          description={`${stats?.total_visits_this_week ?? 0} this week`}
          icon={TrendingUp}
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RecentActivity activities={activityData?.items ?? []} isLoading={activityLoading} />
        <GymSummary gyms={gymsData?.items ?? []} isLoading={gymsLoading} />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/gyms">
              <Building2 className="mr-2 h-4 w-4" />
              Manage Gyms
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/users">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/classes">
              <Calendar className="mr-2 h-4 w-4" />
              View All Classes
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/analytics">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Analytics
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
