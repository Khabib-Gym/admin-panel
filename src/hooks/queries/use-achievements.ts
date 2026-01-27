'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type AchievementListParams,
  achievementsApi,
  type UpdateAchievementInput,
} from '@/lib/api/achievements';
import { queryKeys } from '@/lib/query/keys';

export function useAchievements(params?: AchievementListParams) {
  return useQuery({
    queryKey: queryKeys.achievements.lists(),
    queryFn: () => achievementsApi.list(params),
  });
}

export function useAchievement(id: string) {
  return useQuery({
    queryKey: queryKeys.achievements.detail(id),
    queryFn: () => achievementsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: achievementsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
    },
  });
}

export function useUpdateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAchievementInput }) =>
      achievementsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements.detail(id) });
    },
  });
}

export function useDeleteAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: achievementsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
    },
  });
}
