import type { CoachAvailability } from '@/types/models';
import { apiDelete, apiGet, apiPost } from './client';

export interface AvailabilitySlotInput {
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_recurring?: boolean;
}

export interface SetAvailabilityInput {
  gym_id: string;
  slots: AvailabilitySlotInput[];
}

export const availabilityApi = {
  // Get current coach's availability slots
  getMyAvailability: (gymId?: string) =>
    apiGet<CoachAvailability[]>('/coaches/me/availability', {
      params: gymId ? { gym_id: gymId } : undefined,
    }),

  // Set availability for a gym (replaces existing slots for that gym)
  setAvailability: (data: SetAvailabilityInput) =>
    apiPost<CoachAvailability[]>('/coaches/me/availability', data),

  // Delete availability (optionally for a specific gym)
  deleteAvailability: (gymId?: string) =>
    apiDelete<{ message: string }>('/coaches/me/availability', {
      params: gymId ? { gym_id: gymId } : undefined,
    }),
};
