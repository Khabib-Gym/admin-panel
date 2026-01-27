import type { CoachProfile } from '@/types/models';
import { apiGet, apiPatch, type QueryParams } from './client';

export interface UpdateCoachProfileInput {
  bio?: string;
  specializations?: string[];
  certifications?: string[];
  hourly_rate?: number;
  is_accepting_clients?: boolean;
}

export interface CoachListParams extends QueryParams {
  gym_id?: string;
  specialization?: string;
  page?: number;
  page_size?: number;
}

// Response from GET /coaches/:id - includes flattened user info
export interface CoachDetailResponse {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  profile_image_url?: string;
  bio?: string;
  specializations?: string[];
  certifications?: { name: string; issuer?: string; year?: number }[];
  years_experience?: number;
  hourly_rate?: number;
  is_accepting_clients: boolean;
  has_creator_badge: boolean;
  rating_average: number;
  rating_count: number;
  created_at: string;
}

export const coachesApi = {
  // Get current coach's profile
  getMyProfile: () => apiGet<CoachProfile>('/coaches/me/profile'),

  // Update current coach's profile
  updateMyProfile: (data: UpdateCoachProfileInput) =>
    apiPatch<CoachProfile>('/coaches/me/profile', data),

  // Get a coach by ID (returns detailed response with user info)
  getById: (id: string) => apiGet<CoachDetailResponse>(`/coaches/${id}`),

  // List coaches
  list: (params?: CoachListParams) => apiGet<CoachProfile[]>('/coaches', { params }),
};
