'use client';

import { useQuery } from '@tanstack/react-query';
import { revenueApi, type RevenueParams } from '@/lib/api/revenue';
import { queryKeys } from '@/lib/query/keys';

export function useMyRevenue(params?: RevenueParams) {
  return useQuery({
    queryKey: [...queryKeys.coaches.revenue(), params],
    queryFn: () => revenueApi.getMyStats(params),
  });
}
