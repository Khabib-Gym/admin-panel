'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  exercisesApi,
  type CreateExerciseInput,
  type ExerciseListParams,
  type UpdateExerciseInput,
} from '@/lib/api/exercises';
import { queryKeys } from '@/lib/query/keys';

export function useExercises(params?: ExerciseListParams) {
  return useQuery({
    queryKey: queryKeys.content.exercises.list((params as Record<string, unknown>) || {}),
    queryFn: () => exercisesApi.list(params),
  });
}

export function useExercise(id: string) {
  return useQuery({
    queryKey: queryKeys.content.exercises.detail(id),
    queryFn: () => exercisesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExerciseInput) => exercisesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.exercises.all });
    },
  });
}

export function useUpdateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExerciseInput }) =>
      exercisesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.exercises.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.content.exercises.detail(id) });
    },
  });
}

export function useDeleteExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => exercisesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.exercises.all });
    },
  });
}
