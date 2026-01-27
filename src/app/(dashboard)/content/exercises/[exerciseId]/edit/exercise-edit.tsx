'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ExerciseForm } from '@/components/forms/exercise-form';
import { useExercise, useUpdateExercise } from '@/hooks/queries/use-exercises';
import type { ExerciseFormValues } from '@/lib/validations/exercise';

interface ExerciseEditProps {
  exerciseId: string;
}

export function ExerciseEdit({ exerciseId }: ExerciseEditProps) {
  const router = useRouter();
  const { data: exercise, isLoading } = useExercise(exerciseId);
  const { mutate: updateExercise, isPending } = useUpdateExercise();

  const handleSubmit = (data: ExerciseFormValues) => {
    // Convert instructions from newline-separated string to array
    const instructions = data.instructions
      ? data.instructions.split('\n').filter((line) => line.trim())
      : undefined;

    // Format muscles_targeted - only include if there are any muscles selected
    const hasMuscles =
      (data.muscles_targeted?.primary?.length ?? 0) > 0 ||
      (data.muscles_targeted?.secondary?.length ?? 0) > 0;
    const muscles_targeted = hasMuscles
      ? {
          primary: data.muscles_targeted?.primary ?? [],
          secondary: data.muscles_targeted?.secondary ?? [],
        }
      : undefined;

    updateExercise(
      {
        id: exerciseId,
        data: {
          name: data.name,
          description: data.description || undefined,
          instructions,
          video_url: data.video_url || undefined,
          thumbnail_url: data.thumbnail_url || undefined,
          body_zone: data.body_zone,
          difficulty: data.difficulty,
          muscles_targeted,
          equipment_ids: data.equipment_ids,
          duration_seconds: data.duration_seconds,
          is_active: data.is_active,
        },
      },
      {
        onSuccess: () => {
          toast.success('Exercise updated');
          router.push('/content/exercises');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to update exercise');
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

  if (!exercise) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Exercise not found</p>
      </div>
    );
  }

  const initialData: ExerciseFormValues = {
    name: exercise.name,
    description: exercise.description ?? '',
    instructions: exercise.instructions?.join('\n') ?? '',
    video_url: exercise.video_url ?? '',
    thumbnail_url: exercise.thumbnail_url ?? '',
    body_zone: exercise.body_zone,
    difficulty: exercise.difficulty,
    muscles_targeted: {
      primary: exercise.muscles_targeted?.primary ?? [],
      secondary: exercise.muscles_targeted?.secondary ?? [],
    },
    equipment_ids: exercise.equipment_ids ?? [],
    duration_seconds: exercise.duration_seconds ?? undefined,
    is_active: exercise.is_active,
  };

  return (
    <ExerciseForm
      initialData={initialData}
      onSubmit={handleSubmit}
      isLoading={isPending}
      submitLabel="Update Exercise"
    />
  );
}
