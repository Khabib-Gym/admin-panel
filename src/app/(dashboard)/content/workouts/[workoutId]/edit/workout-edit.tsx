'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { WorkoutTemplateForm } from '@/components/forms/workout-template-form';
import { useUpdateWorkoutTemplate, useWorkoutTemplate } from '@/hooks/queries/use-workouts';
import type { WorkoutTemplateFormValues } from '@/lib/validations/workout';

interface WorkoutEditProps {
  workoutId: string;
}

export function WorkoutEdit({ workoutId }: WorkoutEditProps) {
  const router = useRouter();
  const { data: workout, isLoading } = useWorkoutTemplate(workoutId);
  const { mutate: updateWorkout, isPending } = useUpdateWorkoutTemplate();

  const handleSubmit = (data: WorkoutTemplateFormValues) => {
    const exercises = data.exercises.map((ex, index) => ({
      exercise_id: ex.exercise_id,
      order: index,
      sets: ex.sets,
      reps: ex.reps,
      duration_seconds: ex.duration_seconds,
      rest_seconds: ex.rest_seconds,
    }));

    updateWorkout(
      {
        id: workoutId,
        data: {
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
      },
      {
        onSuccess: () => {
          toast.success('Workout template updated');
          router.push('/content/workouts');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to update workout template');
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Workout template not found</p>
      </div>
    );
  }

  const initialData: WorkoutTemplateFormValues = {
    name: workout.name,
    description: workout.description ?? '',
    type: workout.type,
    difficulty: workout.difficulty,
    duration_minutes: workout.duration_minutes,
    rounds: workout.rounds ?? undefined,
    rest_between_rounds: workout.rest_between_rounds ?? undefined,
    is_premium: workout.is_premium ?? false,
    exercises:
      workout.exercises?.map((ex) => ({
        exercise_id: ex.exercise_id,
        exercise_name: ex.exercise?.name ?? '',
        order: ex.order,
        sets: ex.sets ?? undefined,
        reps: ex.reps ?? undefined,
        duration_seconds: ex.duration_seconds ?? undefined,
        rest_seconds: ex.rest_seconds ?? undefined,
      })) ?? [],
  };

  return (
    <WorkoutTemplateForm
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={isPending}
      submitLabel="Update Workout"
    />
  );
}
