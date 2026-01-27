import { z } from 'zod';

export const achievementSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  icon_url: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  category: z.enum(['visits', 'streaks', 'classes', 'workouts', 'social', 'milestones'], {
    message: 'Category is required',
  }),
  requirement_type: z.enum(
    [
      'total_visits',
      'streak_length',
      'classes_attended',
      'workouts_completed',
      'followers_count',
      'khabib_score',
    ],
    {
      message: 'Requirement type is required',
    },
  ),
  requirement_value: z.number().min(1, 'Requirement value must be at least 1'),
  points: z.number().min(0, 'Points must be non-negative').optional(),
  display_order: z.number().min(0, 'Display order must be non-negative').optional(),
});

export type AchievementFormValues = z.infer<typeof achievementSchema>;

export const ACHIEVEMENT_CATEGORIES = [
  { value: 'visits', label: 'Visits' },
  { value: 'streaks', label: 'Streaks' },
  { value: 'classes', label: 'Classes' },
  { value: 'workouts', label: 'Workouts' },
  { value: 'social', label: 'Social' },
  { value: 'milestones', label: 'Milestones' },
] as const;

export const REQUIREMENT_TYPES = [
  { value: 'total_visits', label: 'Total Visits' },
  { value: 'streak_length', label: 'Streak Length (days)' },
  { value: 'classes_attended', label: 'Classes Attended' },
  { value: 'workouts_completed', label: 'Workouts Completed' },
  { value: 'followers_count', label: 'Followers Count' },
  { value: 'khabib_score', label: 'Khabib Score' },
] as const;
