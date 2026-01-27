import { z } from 'zod';

export const gymSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  timezone: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  opening_hours: z
    .record(
      z.string(),
      z.object({
        open: z.string(),
        close: z.string(),
      }),
    )
    .optional(),
  amenities: z.array(z.string()).optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  is_active: z.boolean(),
});

export type GymFormValues = z.infer<typeof gymSchema>;

export const defaultGymValues: GymFormValues = {
  name: '',
  slug: '',
  address: '',
  city: '',
  country: '',
  timezone: 'UTC',
  phone: '',
  email: '',
  image_url: '',
  is_active: true,
};
