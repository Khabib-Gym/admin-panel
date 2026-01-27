import { apiGet, apiPost, apiPatch, apiDelete, type QueryParams } from './client';
import type { Gym, GymWithStats, GymAnalytics, User, Membership } from '@/types/models';
import type { PaginatedResponse, PaginationParams, SortParams } from '@/types/api';

export interface GymListParams extends PaginationParams, SortParams {
  city?: string;
  country?: string;
  is_active?: boolean;
  include_inactive?: boolean;
  search?: string;
}

export interface CreateGymInput {
  name: string;
  slug: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  phone?: string;
  email?: string;
  opening_hours?: Record<string, { open: string; close: string }>;
  amenities?: string[];
  image_url?: string;
}

export interface UpdateGymInput extends Partial<CreateGymInput> {
  is_active?: boolean;
}

export const gymsApi = {
  list: (params?: GymListParams) =>
    apiGet<PaginatedResponse<Gym>>('/gyms', { params: params as QueryParams }),

  getById: (id: string) => apiGet<GymWithStats>(`/gyms/${id}`),

  getBySlug: (slug: string) => apiGet<Gym>(`/gyms/slug/${slug}`),

  create: (input: CreateGymInput) => apiPost<Gym>('/gyms', input),

  update: (id: string, input: UpdateGymInput) => apiPatch<Gym>(`/gyms/${id}`, input),

  delete: (id: string) => apiDelete<{ message: string }>(`/gyms/${id}`),

  getAnalytics: (id: string) => apiGet<GymAnalytics>(`/admin/gyms/${id}/analytics`),

  getMembers: (id: string, params?: PaginationParams) =>
    apiGet<PaginatedResponse<{ user: User; membership: Membership }>>(
      `/admin/gyms/${id}/members`,
      { params: params as QueryParams },
    ),
};
