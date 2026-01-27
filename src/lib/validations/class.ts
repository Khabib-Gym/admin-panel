import { z } from 'zod';

export const CLASS_TYPES = [
  { value: 'fitness', label: 'Fitness' },
  { value: 'strength', label: 'Strength' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'hiit', label: 'HIIT' },
  { value: 'boxing', label: 'Boxing' },
  { value: 'muay_thai', label: 'Muay Thai' },
  { value: 'grappling', label: 'Grappling' },
  { value: 'mma', label: 'MMA' },
] as const;

export const classSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.enum(
    ['fitness', 'strength', 'cardio', 'hiit', 'boxing', 'muay_thai', 'grappling', 'mma'],
    {
      message: 'Please select a class type',
    },
  ),
  description: z.string().optional().or(z.literal('')),
  scheduled_at: z.string().min(1, 'Please select a date and time'),
  duration_minutes: z
    .number()
    .min(15, 'Minimum duration is 15 minutes')
    .max(180, 'Maximum duration is 3 hours'),
  capacity: z
    .number()
    .min(1, 'Minimum capacity is 1 participant')
    .max(100, 'Maximum capacity is 100 participants'),
  gym_id: z.string().min(1, 'Please select a gym'),
  room: z.string().optional().or(z.literal('')),
});

export type ClassFormValues = z.infer<typeof classSchema>;

export const defaultClassValues: ClassFormValues = {
  name: '',
  type: 'fitness',
  description: '',
  scheduled_at: '',
  duration_minutes: 60,
  capacity: 20,
  gym_id: '',
  room: '',
};
