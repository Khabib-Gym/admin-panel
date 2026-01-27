import { z } from 'zod';

export const coachProfileSchema = z.object({
  bio: z.string().max(1000, 'Bio must be less than 1000 characters').optional(),
  specializations: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  hourly_rate: z.number().min(0, 'Hourly rate must be positive').optional(),
  is_accepting_clients: z.boolean().optional(),
});

export type CoachProfileFormValues = z.infer<typeof coachProfileSchema>;

export const SPECIALIZATIONS = [
  { value: 'strength_training', label: 'Strength Training' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'hiit', label: 'HIIT' },
  { value: 'boxing', label: 'Boxing' },
  { value: 'muay_thai', label: 'Muay Thai' },
  { value: 'bjj', label: 'Brazilian Jiu-Jitsu' },
  { value: 'wrestling', label: 'Wrestling' },
  { value: 'mma', label: 'MMA' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'crossfit', label: 'CrossFit' },
  { value: 'nutrition', label: 'Nutrition' },
  { value: 'functional_training', label: 'Functional Training' },
  { value: 'mobility', label: 'Mobility & Flexibility' },
] as const;
