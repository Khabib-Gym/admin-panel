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
import { useDeleteWorkoutTemplate, useWorkoutTemplates } from '@/hooks/queries/use-workouts';
import type { WorkoutTemplate } from '@/types/models';
import { getWorkoutColumns } from './columns';

export function WorkoutsList() {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<WorkoutTemplate | null>(null);

  const { data, isLoading, error } = useWorkoutTemplates();
  const { mutate: deleteWorkout, isPending: isDeleting } = useDeleteWorkoutTemplate();

  const handleDelete = (workout: WorkoutTemplate) => {
    setDeleteTarget(workout);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    deleteWorkout(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Workout template deleted');
        setDeleteTarget(null);
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to delete workout');
      },
    });
  };

  const columns = getWorkoutColumns({ onDelete: handleDelete });

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading workouts"
        description={error.message}
        action={{
          label: 'Retry',
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  const workouts = data?.items ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workout Templates</h1>
          <p className="text-muted-foreground">
            Create and manage workout templates for your training programs.
          </p>
        </div>
        <Button asChild>
          <Link href="/content/workouts/new">
            <Plus className="mr-2 h-4 w-4" />
            New Workout
          </Link>
        </Button>
      </div>

      {/* Table */}
      {workouts.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          title="No workout templates yet"
          description="Create your first workout template to get started."
          action={{
            label: 'Create Workout',
            onClick: () => router.push('/content/workouts/new'),
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={workouts}
          searchKey="name"
          searchPlaceholder="Search workouts..."
          filterableColumns={[
            {
              id: 'type',
              title: 'Type',
              options: [
                { label: 'Fitness', value: 'fitness' },
                { label: 'Strength', value: 'strength' },
                { label: 'Cardio', value: 'cardio' },
                { label: 'HIIT', value: 'hiit' },
                { label: 'Grappling', value: 'grappling' },
                { label: 'Boxing', value: 'boxing' },
                { label: 'Muay Thai', value: 'muay_thai' },
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
              id: 'is_premium',
              title: 'Access',
              options: [
                { label: 'Premium', value: 'true' },
                { label: 'Free', value: 'false' },
              ],
            },
          ]}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Workout Template"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
