'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ExerciseForm } from '@/components/forms/exercise-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateExercise } from '@/hooks/queries/use-exercises';
import type { CreateExerciseInput } from '@/lib/api/exercises';
import type { ExerciseFormValues } from '@/lib/validations/exercise';

export function NewExercise() {
  const router = useRouter();
  const { mutate: createExercise, isPending } = useCreateExercise();

  const handleSubmit = (data: ExerciseFormValues) => {
    // Convert instructions from string to array
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

    const input: CreateExerciseInput = {
      name: data.name,
      description: data.description || undefined,
      instructions,
      video_url: data.video_url || undefined,
      thumbnail_url: data.thumbnail_url || undefined,
      body_zone: data.body_zone,
      difficulty: data.difficulty,
      equipment_ids: data.equipment_ids?.length ? data.equipment_ids : undefined,
      muscles_targeted,
      duration_seconds: data.duration_seconds,
      is_active: data.is_active,
    };

    createExercise(input, {
      onSuccess: () => {
        toast.success('Exercise created successfully');
        router.push('/content/exercises');
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to create exercise');
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/content/exercises">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Exercise</h1>
          <p className="text-muted-foreground">Create a new exercise for the library</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Exercise Details</CardTitle>
          <CardDescription>Enter the details for the new exercise</CardDescription>
        </CardHeader>
        <CardContent>
          <ExerciseForm
            onSubmit={handleSubmit}
            isLoading={isPending}
            submitLabel="Create Exercise"
          />
        </CardContent>
      </Card>
    </div>
  );
}
