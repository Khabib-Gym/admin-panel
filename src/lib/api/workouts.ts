import type { PaginatedResponse, PaginationParams, SortParams } from '@/types/api';
import type { WorkoutTemplate } from '@/types/models';
import { apiDelete, apiGet, apiPatch, apiPost, type QueryParams } from './client';

export interface WorkoutListParams extends PaginationParams, SortParams {
  type?: string;
  difficulty?: string;
  search?: string;
  is_premium?: boolean;
}

export interface WorkoutExerciseInput {
  exercise_id: string;
  order: number;
  sets?: number;
  reps?: number;
  duration_seconds?: number;
  rest_seconds?: number;
}

export interface CreateWorkoutTemplateInput {
  name: string;
  description?: string;
  type: 'fitness' | 'strength' | 'cardio' | 'hiit' | 'grappling' | 'boxing' | 'muay_thai';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  duration_minutes: number;
  rounds?: number;
  rest_between_rounds?: number;
  is_premium?: boolean;
  exercises?: WorkoutExerciseInput[];
}

export type UpdateWorkoutTemplateInput = Partial<CreateWorkoutTemplateInput>;

export const workoutsApi = {
  list: (params?: WorkoutListParams) =>
    apiGet<PaginatedResponse<WorkoutTemplate>>('/workout-templates', {
      params: params as QueryParams,
    }),

  getById: (id: string) => apiGet<WorkoutTemplate>(`/workout-templates/${id}`),

  create: (data: CreateWorkoutTemplateInput) =>
    apiPost<WorkoutTemplate>('/workout-templates', data),

  update: (id: string, data: UpdateWorkoutTemplateInput) =>
    apiPatch<WorkoutTemplate>(`/workout-templates/${id}`, data),

  delete: (id: string) => apiDelete<{ message: string }>(`/workout-templates/${id}`),

  duplicate: (id: string) => apiPost<WorkoutTemplate>(`/workout-templates/${id}/duplicate`),
};
