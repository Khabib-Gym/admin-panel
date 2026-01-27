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
