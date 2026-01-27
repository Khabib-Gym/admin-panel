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
