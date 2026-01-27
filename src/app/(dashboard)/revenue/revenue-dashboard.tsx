'use client';

import { format } from 'date-fns';
import { Calendar, DollarSign, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import { AreaChart } from '@/components/charts';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/loading-spinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMyRevenue } from '@/hooks/queries/use-revenue';

type PeriodOption = { value: number; label: string };

const PERIOD_OPTIONS: PeriodOption[] = [
  { value: 7, label: 'Last 7 Days' },
  { value: 30, label: 'Last 30 Days' },
  { value: 90, label: 'Last 90 Days' },
  { value: 365, label: 'Last Year' },
];

export function RevenueDashboard() {
  const [periodDays, setPeriodDays] = useState(30);

  const { data: stats, isLoading } = useMyRevenue({ period_days: periodDays });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!stats) {
    return (
      <EmptyState
        icon={DollarSign}
        title="No revenue data"
        description="Complete sessions and classes to see your earnings here."
      />
    );
  }

  // Prepare chart data from entries
  const revenueChartData =
    stats.entries?.map((entry) => ({
      name: format(new Date(entry.date), 'MMM d'),
      value: entry.total_revenue,
    })) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revenue</h1>
          <p className="text-muted-foreground">Track your earnings from sessions</p>
        </div>
        <Select value={periodDays.toString()} onValueChange={(v) => setPeriodDays(parseInt(v))}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIOD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.total_sessions_revenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time from sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue_this_month.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Revenue this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sessions This Month</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sessions_this_month}</div>
            <p className="text-xs text-muted-foreground">Completed sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hourly Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.hourly_rate ? `$${stats.hourly_rate}` : 'Not set'}
            </div>
            <p className="text-xs text-muted-foreground">Per session hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      {revenueChartData.length > 0 && (
        <AreaChart
          title="Revenue Over Time"
          description={`Revenue for the last ${periodDays} days`}
          data={revenueChartData}
          color="#10b981"
          valueFormatter={(v) => `$${v.toLocaleString()}`}
        />
      )}

      {/* Period Info */}
      <Card>
        <CardHeader>
          <CardTitle>Period Summary</CardTitle>
          <CardDescription>
            {format(new Date(stats.period_start), 'MMM d, yyyy')} -{' '}
            {format(new Date(stats.period_end), 'MMM d, yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Session Revenue</p>
              <p className="text-lg font-semibold">
                $
                {stats.entries?.reduce((sum, e) => sum + e.session_revenue, 0).toLocaleString() ??
                  0}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
              <p className="text-lg font-semibold">{stats.entries?.length ?? 0} days</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Daily</p>
              <p className="text-lg font-semibold">
                $
                {stats.entries && stats.entries.length > 0
                  ? (
                      stats.entries.reduce((sum, e) => sum + e.total_revenue, 0) /
                      stats.entries.length
                    ).toFixed(2)
                  : '0'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
