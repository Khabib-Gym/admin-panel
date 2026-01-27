// API endpoint constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USERS: '/users',
  GYMS: '/gyms',
  CLASSES: '/classes',
  COACHES: '/coaches',
  MEMBERSHIPS: '/memberships',
  ADMIN: '/admin',
} as const;

// Pagination
export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export interface Pagination {
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

// Common response types
export interface SuccessResponse {
  message: string;
}

// Sort params
export interface SortParams {
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// API Error types
export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
}
