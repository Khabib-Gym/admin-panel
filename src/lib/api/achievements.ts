import type { PaginatedResponse, PaginationParams, SortParams, SuccessResponse } from '@/types/api';
import type { Achievement } from '@/types/models';
import { apiGet, apiPost, apiPatch, apiDelete, type QueryParams } from './client';

export interface AchievementListParams extends PaginationParams, SortParams {
  category?: string;
  is_active?: boolean;
}

export interface CreateAchievementInput {
  name: string;
  description?: string;
  icon_url?: string;
  category: string;
  requirement_type: string;
  requirement_value: number;
  points?: number;
  display_order?: number;
}

export interface UpdateAchievementInput {
  name?: string;
  description?: string;
  icon_url?: string;
  category?: string;
  requirement_type?: string;
  requirement_value?: number;
  points?: number;
  display_order?: number;
  is_active?: boolean;
}

export const achievementsApi = {
  list: (params?: AchievementListParams) =>
    apiGet<PaginatedResponse<Achievement>>('/achievements', { params: params as QueryParams }),

  getById: (id: string) => apiGet<Achievement>(`/achievements/${id}`),

  create: (data: CreateAchievementInput) => apiPost<Achievement>('/achievements', data),

  update: (id: string, data: UpdateAchievementInput) =>
    apiPatch<Achievement>(`/achievements/${id}`, data),

  delete: (id: string) => apiDelete<SuccessResponse>(`/achievements/${id}`),
};
