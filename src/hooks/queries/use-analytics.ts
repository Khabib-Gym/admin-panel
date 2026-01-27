'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api/analytics';
import { queryKeys } from '@/lib/query/keys';

interface QueryOptions {
  enabled?: boolean;
}

export function useDashboardStats(options?: QueryOptions) {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard(),
    queryFn: () => analyticsApi.getDashboardStats(),
    enabled: options?.enabled ?? true,
  });
}

export function useCoachDashboardStats(options?: QueryOptions) {
  return useQuery({
    queryKey: [...queryKeys.coaches.analytics(), 'dashboard'],
    queryFn: () => analyticsApi.getCoachDashboardStats(),
    enabled: options?.enabled ?? true,
  });
}

export function useCoachAnalytics(options?: QueryOptions) {
  return useQuery({
    queryKey: queryKeys.coaches.analytics(),
    queryFn: () => analyticsApi.getCoachAnalytics(),
    enabled: options?.enabled ?? true,
  });
}

export function useRecentActivity(limit = 10, options?: QueryOptions) {
  return useQuery({
    queryKey: [...queryKeys.analytics.dashboard(), 'activity', limit],
    queryFn: () => analyticsApi.getRecentActivity(limit),
    enabled: options?.enabled ?? true,
  });
}

export function useVisitsChartData(period: 'week' | 'month' = 'week', options?: QueryOptions) {
  return useQuery({
    queryKey: [...queryKeys.analytics.dashboard(), 'charts', 'visits', period],
    queryFn: () => analyticsApi.getVisitsChartData(period),
    enabled: options?.enabled ?? true,
  });
}

export function useClassesByTypeChartData(options?: QueryOptions) {
  return useQuery({
    queryKey: [...queryKeys.analytics.dashboard(), 'charts', 'classes-by-type'],
    queryFn: () => analyticsApi.getClassesByTypeChartData(),
    enabled: options?.enabled ?? true,
  });
}
