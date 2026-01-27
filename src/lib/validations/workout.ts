import { z } from 'zod';

export const WORKOUT_TYPES = [
  { value: 'fitness', label: 'Fitness' },
  { value: 'strength', label: 'Strength' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'hiit', label: 'HIIT' },
  { value: 'grappling', label: 'Grappling' },
  { value: 'boxing', label: 'Boxing' },
  { value: 'muay_thai', label: 'Muay Thai' },
] as const;

export const workoutExerciseSchema = z.object({
  exercise_id: z.string().min(1, 'Select an exercise'),
  exercise_name: z.string().optional(), // For display purposes
  order: z.number(),
  sets: z.number().min(1).max(20).optional(),
  reps: z.number().min(1).max(100).optional(),
  duration_seconds: z.number().min(0).optional(),
  rest_seconds: z.number().min(0).max(600).optional(),
});

export const workoutTemplateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional().or(z.literal('')),
  type: z.enum(['fitness', 'strength', 'cardio', 'hiit', 'grappling', 'boxing', 'muay_thai']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'elite']),
  duration_minutes: z
    .number()
    .min(5, 'Minimum duration is 5 minutes')
    .max(180, 'Maximum duration is 3 hours'),
  rounds: z.number().min(1).max(20).optional(),
  rest_between_rounds: z.number().min(0).max(300).optional(),
  is_premium: z.boolean(),
  exercises: z.array(workoutExerciseSchema),
});

export type WorkoutExerciseFormValues = z.infer<typeof workoutExerciseSchema>;
export type WorkoutTemplateFormValues = z.infer<typeof workoutTemplateSchema>;

export const defaultWorkoutExerciseValues: WorkoutExerciseFormValues = {
  exercise_id: '',
  order: 0,
  sets: 3,
  reps: 10,
  rest_seconds: 60,
};

export const defaultWorkoutTemplateValues: WorkoutTemplateFormValues = {
  name: '',
  description: '',
  type: 'fitness',
  difficulty: 'beginner',
  duration_minutes: 30,
  rounds: undefined,
  rest_between_rounds: undefined,
  is_premium: false,
  exercises: [],
};
