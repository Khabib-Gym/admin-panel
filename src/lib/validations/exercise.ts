import { z } from 'zod';

export const BODY_ZONES = [
  { value: 'arms', label: 'Arms' },
  { value: 'legs', label: 'Legs' },
  { value: 'core', label: 'Core' },
  { value: 'back', label: 'Back' },
  { value: 'chest', label: 'Chest' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'full_body', label: 'Full Body' },
] as const;

export const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'elite', label: 'Elite' },
] as const;

export const MUSCLES_TARGETED = [
  { value: 'biceps', label: 'Biceps' },
  { value: 'triceps', label: 'Triceps' },
  { value: 'forearms', label: 'Forearms' },
  { value: 'chest', label: 'Chest' },
  { value: 'upper_back', label: 'Upper Back' },
  { value: 'lower_back', label: 'Lower Back' },
  { value: 'lats', label: 'Lats' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'abs', label: 'Abs' },
  { value: 'obliques', label: 'Obliques' },
  { value: 'glutes', label: 'Glutes' },
  { value: 'quadriceps', label: 'Quadriceps' },
  { value: 'hamstrings', label: 'Hamstrings' },
  { value: 'calves', label: 'Calves' },
  { value: 'hip_flexors', label: 'Hip Flexors' },
] as const;

export const EQUIPMENT = [
  { value: 'barbell', label: 'Barbell' },
  { value: 'dumbbell', label: 'Dumbbell' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'cable', label: 'Cable Machine' },
  { value: 'machine', label: 'Machine' },
  { value: 'bodyweight', label: 'Bodyweight' },
  { value: 'resistance_band', label: 'Resistance Band' },
  { value: 'medicine_ball', label: 'Medicine Ball' },
  { value: 'pull_up_bar', label: 'Pull-up Bar' },
  { value: 'bench', label: 'Bench' },
] as const;

// Muscles targeted structure for the API
export const musclesTargetedSchema = z.object({
  primary: z.array(z.string()),
  secondary: z.array(z.string()),
});

export type MusclesTargeted = z.infer<typeof musclesTargetedSchema>;

export const exerciseSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional().or(z.literal('')),
  instructions: z.string().optional().or(z.literal('')), // Will be split by newlines
  video_url: z.string().url().optional().or(z.literal('')),
  thumbnail_url: z.string().url().optional().or(z.literal('')),
  body_zone: z.enum(['arms', 'legs', 'core', 'back', 'chest', 'shoulders', 'full_body']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'elite']),
  equipment_ids: z.array(z.string()).optional(),
  muscles_targeted: musclesTargetedSchema,
  duration_seconds: z.number().min(0).optional(),
  is_active: z.boolean(),
});

export type ExerciseFormValues = z.infer<typeof exerciseSchema>;

export const defaultExerciseValues: ExerciseFormValues = {
  name: '',
  description: '',
  instructions: '',
  video_url: '',
  thumbnail_url: '',
  body_zone: 'full_body',
  difficulty: 'beginner',
  equipment_ids: [],
  muscles_targeted: { primary: [], secondary: [] },
  duration_seconds: undefined,
  is_active: true,
};
