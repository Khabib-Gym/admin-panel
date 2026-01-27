import type { PaginatedResponse, PaginationParams, SortParams } from '@/types/api';
import type { Class, ClassBooking } from '@/types/models';
import { apiDelete, apiGet, apiPatch, apiPost, type QueryParams } from './client';

export interface ClassListParams extends PaginationParams, SortParams {
  gym_id?: string;
  coach_id?: string;
  type?: string;
  status?: string;
  upcoming_only?: boolean;
  past_only?: boolean;
  start_date?: string;
  end_date?: string;
}

export interface CreateClassInput {
  gym_id: string;
  name: string;
  description?: string;
  type: 'fitness' | 'strength' | 'cardio' | 'hiit' | 'grappling' | 'boxing' | 'muay_thai' | 'mma';
  scheduled_at: string;
  duration_minutes: number;
  capacity: number;
  room?: string;
}

export type UpdateClassInput = Partial<CreateClassInput>;

export const classesApi = {
  list: (params?: ClassListParams) =>
    apiGet<PaginatedResponse<Class>>('/classes', { params: params as QueryParams }),

  getById: (id: string) => apiGet<Class>(`/classes/${id}`),

  create: (input: CreateClassInput) => apiPost<Class>('/classes', input),

  update: (id: string, input: UpdateClassInput) => apiPatch<Class>(`/classes/${id}`, input),

  delete: (id: string) => apiDelete<{ message: string }>(`/classes/${id}`),

  cancel: (id: string) => apiPost<Class>(`/classes/${id}/cancel`),

  start: (id: string) => apiPost<Class>(`/classes/${id}/start`),

  complete: (id: string) => apiPost<Class>(`/classes/${id}/complete`),

  // Bookings
  getBookings: (id: string, params?: PaginationParams) =>
    apiGet<PaginatedResponse<ClassBooking>>(`/classes/${id}/bookings`, {
      params: params as QueryParams,
    }),

  checkIn: (classId: string, bookingId: string) =>
    apiPost<ClassBooking>(`/classes/${classId}/bookings/${bookingId}/check-in`),

  markNoShow: (classId: string, bookingId: string) =>
    apiPost<ClassBooking>(`/classes/${classId}/bookings/${bookingId}/no-show`),
};
