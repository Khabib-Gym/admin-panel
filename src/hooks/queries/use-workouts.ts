'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type CreateWorkoutTemplateInput,
  type UpdateWorkoutTemplateInput,
  type WorkoutListParams,
  workoutsApi,
} from '@/lib/api/workouts';
import { queryKeys } from '@/lib/query/keys';

export function useWorkoutTemplates(params?: WorkoutListParams) {
  return useQuery({
    queryKey: queryKeys.content.workouts.templates(),
    queryFn: () => workoutsApi.list(params),
  });
}

export function useWorkoutTemplate(id: string) {
  return useQuery({
    queryKey: queryKeys.content.workouts.template(id),
    queryFn: () => workoutsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateWorkoutTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkoutTemplateInput) => workoutsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.workouts.all });
    },
  });
}

export function useUpdateWorkoutTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkoutTemplateInput }) =>
      workoutsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.workouts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.content.workouts.template(id) });
    },
  });
}

export function useDeleteWorkoutTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => workoutsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.workouts.all });
    },
  });
}
