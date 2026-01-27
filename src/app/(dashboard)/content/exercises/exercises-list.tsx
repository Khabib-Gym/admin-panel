'use client';

import { Dumbbell, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/loading-spinner';
import { Button } from '@/components/ui/button';
import { useDeleteExercise, useExercises } from '@/hooks/queries/use-exercises';
import type { Exercise } from '@/types/models';
import { getExerciseColumns } from './columns';

export function ExercisesList() {
  const router = useRouter();
  const [deleteExercise, setDeleteExercise] = useState<Exercise | null>(null);

  const { data, isLoading, error } = useExercises({ active_only: false });
  const { mutate: deleteMutation, isPending: isDeleting } = useDeleteExercise();

  const handleEdit = (exercise: Exercise) => {
    router.push(`/content/exercises/${exercise.id}/edit`);
  };

  const handleDelete = (exercise: Exercise) => {
    setDeleteExercise(exercise);
  };

  const confirmDelete = () => {
    if (!deleteExercise) return;

    deleteMutation(deleteExercise.id, {
      onSuccess: () => {
        toast.success('Exercise deleted successfully');
        setDeleteExercise(null);
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to delete exercise');
      },
    });
  };

  const columns = getExerciseColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading exercises"
        description={error.message}
        action={{
          label: 'Retry',
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  const exercises = data?.items ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Exercise Library</h1>
          <p className="text-muted-foreground">Manage exercises for workouts and training plans</p>
        </div>
        <Button asChild>
          <Link href="/content/exercises/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Exercise
          </Link>
        </Button>
      </div>

      {/* Table */}
      {exercises.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          title="No exercises yet"
          description="Get started by adding your first exercise."
          action={{
            label: 'Add Exercise',
            onClick: () => router.push('/content/exercises/new'),
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={exercises}
          searchKey="name"
          searchPlaceholder="Search exercises..."
          filterableColumns={[
            {
              id: 'body_zone',
              title: 'Body Zone',
              options: [
                { label: 'Arms', value: 'arms' },
                { label: 'Legs', value: 'legs' },
                { label: 'Core', value: 'core' },
                { label: 'Back', value: 'back' },
                { label: 'Chest', value: 'chest' },
                { label: 'Shoulders', value: 'shoulders' },
                { label: 'Full Body', value: 'full_body' },
              ],
            },
            {
              id: 'difficulty',
              title: 'Difficulty',
              options: [
                { label: 'Beginner', value: 'beginner' },
                { label: 'Intermediate', value: 'intermediate' },
                { label: 'Advanced', value: 'advanced' },
                { label: 'Elite', value: 'elite' },
              ],
            },
            {
              id: 'is_active',
              title: 'Status',
              options: [
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ],
            },
          ]}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteExercise}
        onOpenChange={(open) => !open && setDeleteExercise(null)}
        title="Delete Exercise"
        description={`Are you sure you want to delete "${deleteExercise?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
