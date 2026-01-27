import type { PaginatedResponse, PaginationParams, SortParams } from '@/types/api';
import type { AdminUserDetail, User, UserPreferences, UserWithStats } from '@/types/models';
import { apiGet, apiPatch, apiPost, type QueryParams } from './client';

export interface UserListParams extends PaginationParams, SortParams {
  role?: 'member' | 'coach' | 'admin' | 'super_admin';
  is_active?: boolean;
  search?: string;
}

export interface UpdateUserInput {
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
  is_active?: boolean;
}

export interface UpdateUserRoleInput {
  new_role: 'member' | 'coach' | 'admin' | 'super_admin';
  reason?: string;
}

export interface UpdatePreferencesInput {
  push_notifications_enabled?: boolean;
  email_notifications_enabled?: boolean;
  workout_reminders_enabled?: boolean;
  profile_public?: boolean;
  show_on_leaderboard?: boolean;
  allow_follows?: boolean;
}

export interface ChangePasswordInput {
  current_password: string;
  new_password: string;
}

export const usersApi = {
  list: (params?: UserListParams) =>
    apiGet<PaginatedResponse<User>>('/admin/users', { params: params as QueryParams }),

  getById: (id: string) => apiGet<AdminUserDetail>(`/admin/users/${id}`),

  update: (id: string, input: UpdateUserInput) => apiPatch<User>(`/admin/users/${id}`, input),

  updateRole: (id: string, input: UpdateUserRoleInput) =>
    apiPatch<User>(`/admin/users/${id}/role`, input),

  // Current user
  getMe: () => apiGet<UserWithStats>('/users/me'),

  updateMe: (input: UpdateUserInput) => apiPatch<User>('/users/me', input),

  // Preferences
  getPreferences: () => apiGet<UserPreferences>('/users/me/preferences'),

  updatePreferences: (input: UpdatePreferencesInput) =>
    apiPatch<UserPreferences>('/users/me/preferences', input),

  // Password
  changePassword: (input: ChangePasswordInput) =>
    apiPost<{ message: string }>('/auth/change-password', input),
};
