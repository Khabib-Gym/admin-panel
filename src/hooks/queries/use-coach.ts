'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPatch, apiPost } from '@/lib/api/client';
import { type CoachDetailResponse, coachesApi } from '@/lib/api/coaches';
import { queryKeys } from '@/lib/query/keys';
import type { PaginatedResponse } from '@/types/api';
import type { Class, CoachAvailability, CoachProfile, PrivateSession } from '@/types/models';

export function useCoach(id: string) {
  return useQuery<CoachDetailResponse>({
    queryKey: queryKeys.coaches.detail(id),
    queryFn: () => coachesApi.getById(id),
    enabled: !!id,
  });
}

export function useCoachProfile() {
  return useQuery({
    queryKey: queryKeys.coaches.profile(),
    queryFn: () => apiGet<CoachProfile>('/coaches/me/profile'),
  });
}

export function useUpdateCoachProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CoachProfile>) =>
      apiPatch<CoachProfile>('/coaches/me/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.coaches.profile() });
    },
  });
}

export function useCoachAvailability() {
  return useQuery({
    queryKey: [...queryKeys.coaches.all, 'availability'],
    queryFn: () => apiGet<CoachAvailability[]>('/coaches/me/availability'),
  });
}

export function useSetCoachAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<CoachAvailability, 'id' | 'coach_id'>[]) =>
      apiPost<CoachAvailability[]>('/coaches/me/availability', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.coaches.all, 'availability'] });
    },
  });
}

export function useCoachUpcomingClasses() {
  return useQuery({
    queryKey: [...queryKeys.classes.all, 'coach', 'upcoming'],
    queryFn: () =>
      apiGet<PaginatedResponse<Class>>('/classes', {
        params: {
          upcoming_only: true,
          page_size: 10,
        },
      }),
  });
}

export function useCoachUpcomingSessions() {
  return useQuery({
    queryKey: [...queryKeys.sessions.all, 'coach', 'upcoming'],
    queryFn: () =>
      apiGet<PaginatedResponse<PrivateSession>>('/coaches/me/sessions', {
        params: {
          upcoming_only: true,
          page_size: 10,
        },
      }),
  });
}

export function useCoachRevenue() {
  return useQuery({
    queryKey: queryKeys.coaches.revenue(),
    queryFn: () =>
      apiGet<{
        total: number;
        this_month: number;
        last_month: number;
        by_month: Array<{ month: string; amount: number }>;
      }>('/coaches/me/revenue'),
  });
}
