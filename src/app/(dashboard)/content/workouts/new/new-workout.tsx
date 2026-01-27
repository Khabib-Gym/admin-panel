'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { WorkoutTemplateForm } from '@/components/forms/workout-template-form';
import { useCreateWorkoutTemplate } from '@/hooks/queries/use-workouts';
import type { WorkoutTemplateFormValues } from '@/lib/validations/workout';

export function NewWorkout() {
  const router = useRouter();
  const { mutate: createWorkout, isPending } = useCreateWorkoutTemplate();

  const handleSubmit = (data: WorkoutTemplateFormValues) => {
    const exercises = data.exercises.map((ex, index) => ({
      exercise_id: ex.exercise_id,
      order: index + 1,
      sets: ex.sets,
      reps: ex.reps,
      duration_seconds: ex.duration_seconds,
      rest_seconds: ex.rest_seconds,
    }));

    createWorkout(
      {
        name: data.name,
        description: data.description || undefined,
        type: data.type,
        difficulty: data.difficulty,
        duration_minutes: data.duration_minutes,
        rounds: data.rounds,
        rest_between_rounds: data.rest_between_rounds,
        is_premium: data.is_premium,
        exercises,
      },
      {
        onSuccess: () => {
          toast.success('Workout template created');
          router.push('/content/workouts');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to create workout template');
        },
      },
    );
  };

  return (
    <WorkoutTemplateForm
      onSubmit={handleSubmit}
      isLoading={isPending}
      submitLabel="Create Workout"
    />
  );
}
