import type { PaginatedResponse, PaginationParams, SortParams } from '@/types/api';
import type { Exercise } from '@/types/models';
import { apiDelete, apiGet, apiPatch, apiPost, type QueryParams } from './client';

export interface ExerciseListParams extends PaginationParams, SortParams {
  body_zone?: string;
  difficulty?: string;
  search?: string;
  active_only?: boolean;
}

export interface MusclesTargetedInput {
  primary?: string[];
  secondary?: string[];
}

export interface CreateExerciseInput {
  name: string;
  description?: string;
  instructions?: string[];
  video_url?: string;
  thumbnail_url?: string;
  body_zone: 'arms' | 'legs' | 'core' | 'back' | 'chest' | 'shoulders' | 'full_body';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  equipment_ids?: string[];
  muscles_targeted?: MusclesTargetedInput;
  duration_seconds?: number;
  is_active?: boolean;
}

export type UpdateExerciseInput = Partial<CreateExerciseInput>;

export const exercisesApi = {
  list: (params?: ExerciseListParams) =>
    apiGet<PaginatedResponse<Exercise>>('/exercises', { params: params as QueryParams }),

  getById: (id: string) => apiGet<Exercise>(`/exercises/${id}`),

  create: (data: CreateExerciseInput) => apiPost<Exercise>('/exercises', data),

  update: (id: string, data: UpdateExerciseInput) => apiPatch<Exercise>(`/exercises/${id}`, data),

  delete: (id: string) => apiDelete<{ message: string }>(`/exercises/${id}`),
};
