'use client';

import { Calendar, Clock, DollarSign, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { PageLoader } from '@/components/shared/loading-spinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCoachDashboardStats } from '@/hooks/queries/use-analytics';
import { useCoachUpcomingClasses, useCoachUpcomingSessions } from '@/hooks/queries/use-coach';
import { StatCard } from './stat-card';
import { UpcomingSchedule } from './upcoming-schedule';

interface CoachDashboardProps {
  userName: string;
}

export function CoachDashboard({ userName }: CoachDashboardProps) {
  const { data: stats, isLoading: statsLoading } = useCoachDashboardStats();
  const { data: classesData, isLoading: classesLoading } = useCoachUpcomingClasses();
  const { data: sessionsData, isLoading: sessionsLoading } = useCoachUpcomingSessions();

  if (statsLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userName}! Here's your schedule overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/availability">Manage Availability</Link>
          </Button>
          <Button asChild>
            <Link href="/classes/new">Create Class</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Classes This Week"
          value={stats?.classes_this_week ?? 0}
          description={`${stats?.total_classes ?? 0} total classes`}
          icon={Calendar}
        />
        <StatCard
          title="Sessions This Week"
          value={stats?.sessions_this_week ?? 0}
          description={`${stats?.total_sessions ?? 0} total sessions`}
          icon={Clock}
        />
        <StatCard
          title="Average Rating"
          value={
            stats?.average_rating && stats.average_rating > 0
              ? stats.average_rating.toFixed(1)
              : 'N/A'
          }
          description={`${stats?.total_ratings ?? 0} ratings`}
          icon={Star}
        />
        <StatCard
          title="Revenue This Month"
          value={`$${stats?.revenue_this_month?.toFixed(0) ?? 0}`}
          description="From private sessions"
          icon={DollarSign}
        />
      </div>

      {/* Schedule Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Upcoming Classes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Classes</CardTitle>
              <CardDescription>Your scheduled classes</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/classes">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <UpcomingSchedule
              items={classesData?.items ?? []}
              type="class"
              isLoading={classesLoading}
              emptyMessage="No upcoming classes"
            />
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Private training sessions</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/sessions">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <UpcomingSchedule
              items={sessionsData?.items ?? []}
              type="session"
              isLoading={sessionsLoading}
              emptyMessage="No upcoming sessions"
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/profile">
              <Users className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/revenue">
              <DollarSign className="mr-2 h-4 w-4" />
              View Revenue
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/content/workouts">
              <Calendar className="mr-2 h-4 w-4" />
              Workout Templates
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
