import type { CoachAnalytics, GymAnalytics } from '@/types/models';
import { apiGet } from './client';

export interface DashboardStats {
  // Member statistics
  total_members: number;
  active_members: number;
  new_members_this_month: number;

  // Gym statistics
  total_gyms: number;
  active_gyms: number;

  // Class statistics
  total_classes_today: number;
  total_classes_this_week: number;

  // Visit statistics
  total_visits_today: number;
  total_visits_this_week: number;

  // Session statistics
  total_sessions_today: number;
  total_sessions_this_week: number;

  // Coach statistics
  total_coaches: number;
  active_coaches: number;
}

export interface CoachDashboardStats {
  classes_this_week: number;
  total_classes: number;
  sessions_this_week: number;
  total_sessions: number;
  average_rating: number;
  total_ratings: number;
  revenue_this_month: number;
}

export interface RecentActivityItem {
  id: string;
  type: 'booking' | 'class' | 'session' | 'member';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

export interface RecentActivityResponse {
  items: RecentActivityItem[];
  total_count: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface VisitsChartResponse {
  data: ChartDataPoint[];
  total_visits: number;
  period: 'week' | 'month';
}

export interface ClassesByTypeResponse {
  data: ChartDataPoint[];
  total_classes: number;
}

export const analyticsApi = {
  getDashboardStats: () => apiGet<DashboardStats>('/admin/dashboard/stats'),

  getCoachDashboardStats: () => apiGet<CoachDashboardStats>('/coaches/me/dashboard'),

  getGymAnalytics: (gymId: string) => apiGet<GymAnalytics>(`/admin/gyms/${gymId}/analytics`),

  getCoachAnalytics: () => apiGet<CoachAnalytics>('/coaches/me/analytics'),

  getRecentActivity: (limit?: number) =>
    apiGet<RecentActivityResponse>('/admin/dashboard/activity', { params: { limit } }),

  getVisitsChartData: (period: 'week' | 'month' = 'week') =>
    apiGet<VisitsChartResponse>('/admin/dashboard/charts/visits', { params: { period } }),

  getClassesByTypeChartData: () =>
    apiGet<ClassesByTypeResponse>('/admin/dashboard/charts/classes-by-type'),
};
