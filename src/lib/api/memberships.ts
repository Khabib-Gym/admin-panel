import type { PaginatedResponse, PaginationParams, SortParams } from '@/types/api';
import type { Membership } from '@/types/models';
import { apiGet, apiPatch, type QueryParams } from './client';

export interface MembershipListParams extends PaginationParams, SortParams {
  user_id?: string;
  gym_id?: string;
  status?: 'active' | 'paused' | 'expired' | 'cancelled';
  type?: 'basic' | 'premium' | 'vip' | 'trial';
}

export interface UpdateMembershipInput {
  type?: 'basic' | 'premium' | 'vip' | 'trial';
  status?: 'active' | 'paused' | 'expired' | 'cancelled';
  expires_at?: string;
}

export const membershipsApi = {
  list: (params?: MembershipListParams) =>
    apiGet<PaginatedResponse<Membership>>('/admin/memberships', { params: params as QueryParams }),

  getById: (id: string) => apiGet<Membership>(`/memberships/${id}`),

  // Get memberships for a specific user (admin view)
  getByUserId: (userId: string, params?: Omit<MembershipListParams, 'user_id'>) =>
    apiGet<PaginatedResponse<Membership>>('/admin/memberships', {
      params: { ...params, user_id: userId } as QueryParams,
    }),

  update: (id: string, input: UpdateMembershipInput) =>
    apiPatch<Membership>(`/memberships/${id}/admin`, input),
};
