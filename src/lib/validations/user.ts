import { z } from 'zod';

export const userProfileSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(255, 'Email must be less than 255 characters'),
  phone: z
    .string()
    .max(20, 'Phone number must be less than 20 characters')
    .optional()
    .or(z.literal('')),
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;

export const roleChangeSchema = z.object({
  role: z.enum(['member', 'coach', 'admin', 'super_admin'], {
    message: 'Please select a role',
  }),
});

export type RoleChangeFormValues = z.infer<typeof roleChangeSchema>;

export const ROLES = [
  { value: 'member', label: 'Member' },
  { value: 'coach', label: 'Coach' },
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
] as const;

// Settings Schemas
export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be less than 128 characters'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const notificationPreferencesSchema = z.object({
  push_notifications_enabled: z.boolean(),
  email_notifications_enabled: z.boolean(),
  workout_reminders_enabled: z.boolean(),
});

export type NotificationPreferencesFormValues = z.infer<typeof notificationPreferencesSchema>;

export const privacyPreferencesSchema = z.object({
  profile_public: z.boolean(),
  show_on_leaderboard: z.boolean(),
  allow_follows: z.boolean(),
});

export type PrivacyPreferencesFormValues = z.infer<typeof privacyPreferencesSchema>;

export const accountProfileSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters'),
  phone: z
    .string()
    .max(20, 'Phone number must be less than 20 characters')
    .optional()
    .or(z.literal('')),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional().or(z.literal('')),
});

export type AccountProfileFormValues = z.infer<typeof accountProfileSchema>;
