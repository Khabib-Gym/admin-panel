'use client';

import { Activity, Calendar, Dumbbell, Flame } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { UserStats } from '@/types/models';

interface UserActivityProps {
  stats?: UserStats;
  isLoading?: boolean;
}

interface StatItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  description?: string;
}

function StatItem({ icon: Icon, label, value, description }: StatItemProps) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}

export function UserActivity({ stats, isLoading }: UserActivityProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Summary</CardTitle>
          <CardDescription>User engagement metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const statItems = [
    {
      icon: Activity,
      label: 'Total Visits',
      value: stats?.total_visits ?? 0,
      description: 'Gym check-ins',
    },
    {
      icon: Calendar,
      label: 'Classes Attended',
      value: stats?.total_classes ?? 0,
      description: 'Group sessions',
    },
    {
      icon: Dumbbell,
      label: 'Workouts Generated',
      value: stats?.total_workouts_generated ?? 0,
      description: 'AI-generated workouts',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: stats?.current_streak ?? 0,
      description: 'Days in a row',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Summary</CardTitle>
        <CardDescription>User engagement metrics</CardDescription>
      </CardHeader>
      <CardContent>
        {!stats ? (
          <div className="text-center py-6 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No activity data available</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {statItems.map((item) => (
              <StatItem key={item.label} {...item} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
