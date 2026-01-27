export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_active: boolean;
  profile_image_url?: string;
}

export type UserRole = 'member' | 'coach' | 'admin' | 'super_admin';

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: User;
}
