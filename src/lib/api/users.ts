import { apiGet, apiPatch, type QueryParams } from './client';
import type { User, UserWithStats } from '@/types/models';
import type { PaginatedResponse, PaginationParams, SortParams } from '@/types/api';

export interface UserListParams extends PaginationParams, SortParams {
  role?: 'member' | 'coach' | 'admin' | 'super_admin';
  is_active?: boolean;
  search?: string;
}

export interface UpdateUserInput {
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_active?: boolean;
}

export interface UpdateUserRoleInput {
  role: 'member' | 'coach' | 'admin' | 'super_admin';
}

export const usersApi = {
  list: (params?: UserListParams) =>
    apiGet<PaginatedResponse<User>>('/admin/users', { params: params as QueryParams }),

  getById: (id: string) => apiGet<UserWithStats>(`/users/${id}`),

  update: (id: string, input: UpdateUserInput) =>
    apiPatch<User>(`/admin/users/${id}`, input),

  updateRole: (id: string, input: UpdateUserRoleInput) =>
    apiPatch<User>(`/admin/users/${id}/role`, input),

  // Current user
  getMe: () => apiGet<UserWithStats>('/users/me'),

  updateMe: (input: UpdateUserInput) => apiPatch<User>('/users/me', input),
};
