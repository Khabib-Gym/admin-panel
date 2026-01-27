import type { PaginatedResponse, PaginationParams, SortParams } from '@/types/api';
import type { Membership } from '@/types/models';
import { apiGet, apiPatch, apiPost, type QueryParams } from './client';

export interface MembershipListParams extends PaginationParams, SortParams {
  user_id?: string;
  gym_id?: string;
  status?: 'active' | 'paused' | 'expired' | 'cancelled';
  type?: 'basic' | 'premium' | 'vip' | 'trial';
  search?: string;
}

export interface UpdateMembershipInput {
  type?: 'basic' | 'premium' | 'vip' | 'trial';
  status?: 'active' | 'paused' | 'expired' | 'cancelled';
  expires_at?: string;
}

export interface CreateMembershipAdminInput {
  user_id: string;
  gym_id: string;
  type: 'basic' | 'premium' | 'vip' | 'trial';
  duration_days: number;
}

export const membershipsApi = {
  list: (params?: MembershipListParams) =>
    apiGet<PaginatedResponse<Membership>>('/memberships/admin/list', {
      params: params as QueryParams,
    }),

  getById: (id: string) => apiGet<Membership>(`/memberships/${id}`),

  // Admin create membership for any user
  create: (data: CreateMembershipAdminInput) =>
    apiPost<Membership>('/memberships/admin/create', data),

  // Get memberships for a specific user (admin view)
  getByUserId: (userId: string, params?: Omit<MembershipListParams, 'user_id'>) =>
    apiGet<PaginatedResponse<Membership>>('/admin/memberships', {
      params: { ...params, user_id: userId } as QueryParams,
    }),

  // Admin update - can change type, status, expires_at
  update: (id: string, input: UpdateMembershipInput) =>
    apiPatch<Membership>(`/memberships/${id}/admin`, input),

  // Status actions (admin endpoints - bypass ownership check)
  pause: (id: string) => apiPost<Membership>(`/memberships/${id}/pause/admin`),

  resume: (id: string) => apiPost<Membership>(`/memberships/${id}/resume/admin`),

  cancel: (id: string) => apiPost<Membership>(`/memberships/${id}/cancel/admin`),
};
