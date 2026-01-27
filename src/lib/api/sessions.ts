import type { PaginatedResponse } from '@/types/api';
import type { PrivateSession } from '@/types/models';
import { apiGet, apiPost, type QueryParams } from './client';

export interface SessionListParams extends QueryParams {
  status?: string;
  upcoming_only?: boolean;
  page?: number;
  page_size?: number;
}

export interface CompleteSessionInput {
  notes?: string;
  member_attended?: boolean;
}

export const sessionsApi = {
  // Get current coach's sessions
  getMySessions: (params?: SessionListParams) =>
    apiGet<PaginatedResponse<PrivateSession>>('/coaches/me/sessions', { params }),

  // Get a session by ID
  getById: (id: string) => apiGet<PrivateSession>(`/sessions/${id}`),

  // Complete a session
  complete: (id: string, data: CompleteSessionInput) =>
    apiPost<PrivateSession>(`/sessions/${id}/complete`, data),

  // Cancel a session
  cancel: (id: string, reason?: string) =>
    apiPost<PrivateSession>(`/sessions/${id}/cancel`, { reason }),
};
