import { apiGet, type QueryParams } from './client';

export interface RevenueParams extends QueryParams {
  period_days?: number;
}

export interface RevenueEntry {
  date: string;
  membership_revenue: number;
  session_revenue: number;
  total_revenue: number;
}

export interface RevenueStats {
  coach_id: string;
  coach_name: string;
  hourly_rate: number | null;
  total_sessions_revenue: number;
  sessions_this_month: number;
  revenue_this_month: number;
  entries: RevenueEntry[];
  period_start: string;
  period_end: string;
}

export const revenueApi = {
  // Get current coach's revenue stats
  getMyStats: (params?: RevenueParams) => apiGet<RevenueStats>('/coaches/me/revenue', { params }),
};
