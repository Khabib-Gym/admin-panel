// User
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  height_cm?: number;
  weight_kg?: number;
  profile_image_url?: string;
  role: 'member' | 'coach' | 'admin' | 'super_admin';
  is_active: boolean;
  is_verified: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserWithStats extends User {
  stats?: {
    total_visits: number;
    total_classes: number;
    total_workouts: number;
    current_streak: number;
  };
}

// Gym
export interface Gym {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  timezone: string;
  phone?: string;
  email?: string;
  opening_hours?: Record<string, { open: string; close: string }>;
  amenities?: string[];
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Response from GET /gyms/:id (gym detail with stats)
export interface GymDetailResponse {
  gym: Gym;
  active_members: number;
  visits_today: number;
}

// Membership
export interface Membership {
  id: string;
  user_id: string;
  gym_id: string;
  type: 'basic' | 'premium' | 'vip' | 'trial';
  status: 'active' | 'paused' | 'expired' | 'cancelled';
  starts_at: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  user?: User;
  gym?: Gym;
}

// Class
export interface Class {
  id: string;
  gym_id: string;
  coach_id: string;
  name: string;
  description?: string;
  type: 'fitness' | 'strength' | 'cardio' | 'hiit' | 'grappling' | 'boxing' | 'muay_thai';
  scheduled_at: string;
  duration_minutes: number;
  capacity: number;
  current_bookings: number;
  room?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  gym?: Gym;
  coach?: CoachProfile;
}

// Booking
export interface ClassBooking {
  id: string;
  class_id: string;
  user_id: string;
  status: 'confirmed' | 'waitlisted' | 'cancelled' | 'attended' | 'no_show';
  booked_at: string;
  cancelled_at?: string;
  attended_at?: string;
  waitlist_position?: number;
  user?: User;
  class?: Class;
}

// Coach
export interface CoachProfile {
  id: string;
  user_id: string;
  bio?: string;
  specializations?: string[];
  certifications?: string[];
  years_experience?: number;
  hourly_rate?: number;
  is_accepting_clients: boolean;
  has_creator_badge: boolean;
  rating_average?: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

// Private Session
export interface PrivateSession {
  id: string;
  coach_id: string;
  user_id: string;
  gym_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  video_recap_url?: string;
  price?: number;
  created_at: string;
  updated_at: string;
  coach?: CoachProfile;
  user?: User;
  gym?: Gym;
}

// Coach Availability
export interface CoachAvailability {
  id: string;
  coach_id: string;
  gym_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
}

// Content
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category_id?: string;
  author_id: string;
  cover_image_url?: string;
  type: 'article' | 'video' | 'quote';
  is_published: boolean;
  published_at?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  category?: BlogCategory;
  author?: User;
}

// Exercise
export interface Exercise {
  id: string;
  name: string;
  description?: string;
  instructions?: string[];
  video_url?: string;
  thumbnail_url?: string;
  body_zone: 'arms' | 'legs' | 'core' | 'back' | 'chest' | 'shoulders' | 'full_body';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  equipment_ids?: string[];
  muscles_targeted?: string[];
  duration_seconds?: number;
  is_active: boolean;
}

// Workout Template
export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  type: 'fitness' | 'strength' | 'cardio' | 'hiit' | 'grappling' | 'boxing' | 'muay_thai';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  duration_minutes: number;
  rounds?: number;
  rest_between_rounds?: number;
  is_premium: boolean;
  created_by_id?: string;
  exercises?: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: string;
  template_id: string;
  exercise_id: string;
  order: number;
  sets?: number;
  reps?: number;
  duration_seconds?: number;
  rest_seconds?: number;
  exercise?: Exercise;
}

// Achievement
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon_url?: string;
  category: string;
  requirement_type: string;
  requirement_value: number;
  points: number;
  is_active: boolean;
}

// Analytics
export interface GymAnalytics {
  total_members: number;
  active_members: number;
  new_members_this_month: number;
  total_visits: number;
  visits_this_week: number;
  average_daily_visits: number;
  total_classes: number;
  classes_this_week: number;
  average_class_attendance: number;
  revenue_this_month?: number;
}

export interface CoachAnalytics {
  total_classes: number;
  classes_this_month: number;
  total_sessions: number;
  sessions_this_month: number;
  average_rating: number;
  total_ratings: number;
  revenue_this_month?: number;
}
