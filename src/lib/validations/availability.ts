import { z } from 'zod';

export const DAYS_OF_WEEK = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number]['value'];

export const availabilitySlotSchema = z
  .object({
    gym_id: z.string().min(1, 'Please select a gym'),
    day_of_week: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
    start_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
    end_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
    is_recurring: z.boolean().optional(),
  })
  .refine(
    (data) => {
      const start = parseInt(data.start_time.replace(':', ''));
      const end = parseInt(data.end_time.replace(':', ''));
      return end > start;
    },
    {
      message: 'End time must be after start time',
      path: ['end_time'],
    },
  );

export type AvailabilitySlotFormValues = z.infer<typeof availabilitySlotSchema>;
