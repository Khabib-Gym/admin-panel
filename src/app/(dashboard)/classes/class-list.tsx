'use client';

import { Calendar, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/loading-spinner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useCancelClass,
  useClasses,
  useCompleteClass,
  useDeleteClass,
  useStartClass,
} from '@/hooks/queries/use-classes';
import type { Class } from '@/types/models';
import { getClassColumns } from './columns';

export function ClassList() {
  const router = useRouter();
  const [deleteClass, setDeleteClass] = useState<Class | null>(null);
  const [cancelClass, setCancelClass] = useState<Class | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const { data, isLoading, error } = useClasses({
    upcoming_only: activeTab === 'upcoming',
  });

  const { mutate: deleteMutation, isPending: isDeleting } = useDeleteClass();
  const { mutate: startMutation } = useStartClass();
  const { mutate: completeMutation } = useCompleteClass();
  const { mutate: cancelMutation, isPending: isCancelling } = useCancelClass();

  const handleEdit = (classItem: Class) => {
    router.push(`/classes/${classItem.id}/edit`);
  };

  const handleDelete = (classItem: Class) => {
    setDeleteClass(classItem);
  };

  const handleStart = (classItem: Class) => {
    startMutation(classItem.id, {
      onSuccess: () => {
        toast.success('Class started');
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to start class');
      },
    });
  };

  const handleComplete = (classItem: Class) => {
    completeMutation(classItem.id, {
      onSuccess: () => {
        toast.success('Class completed');
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to complete class');
      },
    });
  };

  const handleCancel = (classItem: Class) => {
    setCancelClass(classItem);
  };

  const confirmDelete = () => {
    if (!deleteClass) return;

    deleteMutation(deleteClass.id, {
      onSuccess: () => {
        toast.success('Class deleted successfully');
        setDeleteClass(null);
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to delete class');
      },
    });
  };

  const confirmCancel = () => {
    if (!cancelClass) return;

    cancelMutation(cancelClass.id, {
      onSuccess: () => {
        toast.success('Class cancelled');
        setCancelClass(null);
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to cancel class');
      },
    });
  };

  const columns = getClassColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onStart: handleStart,
    onComplete: handleComplete,
    onCancel: handleCancel,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading classes"
        description={error.message}
        action={{
          label: 'Retry',
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  const classes = data?.items ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">Manage class schedules and bookings</p>
        </div>
        <Button asChild>
          <Link href="/classes/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Class
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'upcoming' | 'past')}
        className="w-fit"
      >
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Table */}
      {classes.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={activeTab === 'upcoming' ? 'No upcoming classes' : 'No past classes'}
          description={
            activeTab === 'upcoming'
              ? 'Get started by scheduling your first class.'
              : 'Past classes will appear here.'
          }
          action={
            activeTab === 'upcoming'
              ? {
                  label: 'Create Class',
                  onClick: () => router.push('/classes/new'),
                }
              : undefined
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={classes}
          searchKey="name"
          searchPlaceholder="Search classes..."
          filterableColumns={[
            {
              id: 'type',
              title: 'Type',
              options: [
                { label: 'Fitness', value: 'fitness' },
                { label: 'Strength', value: 'strength' },
                { label: 'Cardio', value: 'cardio' },
                { label: 'HIIT', value: 'hiit' },
                { label: 'Boxing', value: 'boxing' },
                { label: 'Muay Thai', value: 'muay_thai' },
                { label: 'Grappling', value: 'grappling' },
                { label: 'MMA', value: 'mma' },
              ],
            },
            {
              id: 'status',
              title: 'Status',
              options: [
                { label: 'Scheduled', value: 'scheduled' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'Completed', value: 'completed' },
                { label: 'Cancelled', value: 'cancelled' },
              ],
            },
          ]}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteClass}
        onOpenChange={(open) => !open && setDeleteClass(null)}
        title="Delete Class"
        description={`Are you sure you want to delete "${deleteClass?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />

      {/* Cancel Confirmation */}
      <ConfirmDialog
        open={!!cancelClass}
        onOpenChange={(open) => !open && setCancelClass(null)}
        title="Cancel Class"
        description={`Are you sure you want to cancel "${cancelClass?.name}"? All booked members will be notified.`}
        confirmLabel="Cancel Class"
        variant="destructive"
        isLoading={isCancelling}
        onConfirm={confirmCancel}
      />
    </div>
  );
}
