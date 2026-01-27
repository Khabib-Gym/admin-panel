'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gymsApi, type GymListParams, type CreateGymInput, type UpdateGymInput } from '@/lib/api/gyms';
import { queryKeys } from '@/lib/query/keys';

export function useGyms(params?: GymListParams) {
  return useQuery({
    queryKey: queryKeys.gyms.list(params as Record<string, unknown> || {}),
    queryFn: () => gymsApi.list(params),
  });
}

export function useGym(id: string) {
  return useQuery({
    queryKey: queryKeys.gyms.detail(id),
    queryFn: () => gymsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateGym() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGymInput) => gymsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gyms.all });
    },
  });
}

export function useUpdateGym() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGymInput }) => gymsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gyms.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.gyms.detail(id) });
    },
  });
}

export function useDeleteGym() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => gymsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gyms.all });
    },
  });
}

export function useGymAnalytics(id: string) {
  return useQuery({
    queryKey: queryKeys.gyms.analytics(id),
    queryFn: () => gymsApi.getAnalytics(id),
    enabled: !!id,
  });
}
