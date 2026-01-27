'use client';

import { Building2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from '@/components/data-table';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/loading-spinner';
import { Button } from '@/components/ui/button';
import { useDeleteGym, useGyms } from '@/hooks/queries/use-gyms';
import type { Gym } from '@/types/models';
import { getGymColumns } from './columns';

export function GymList() {
  const router = useRouter();
  const [deleteGym, setDeleteGym] = useState<Gym | null>(null);

  const { data, isLoading, error } = useGyms({ include_inactive: true });
  const { mutate: deleteMutation, isPending: isDeleting } = useDeleteGym();

  const handleEdit = (gym: Gym) => {
    router.push(`/gyms/${gym.id}/edit`);
  };

  const handleDelete = (gym: Gym) => {
    setDeleteGym(gym);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const confirmDelete = () => {
    if (!deleteGym) return;

    deleteMutation(deleteGym.id, {
      onSuccess: () => {
        toast.success('Gym deleted successfully');
        setDeleteGym(null);
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to delete gym');
      },
    });
  };

  const columns = getGymColumns({ onEdit: handleEdit, onDelete: handleDelete, onNavigate: handleNavigate });

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading gyms"
        description={error.message}
        action={{
          label: 'Retry',
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  const gyms = data?.items ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gyms</h1>
          <p className="text-muted-foreground">Manage gym locations and settings</p>
        </div>
        <Button asChild>
          <Link href="/gyms/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Gym
          </Link>
        </Button>
      </div>

      {/* Table */}
      {gyms.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No gyms yet"
          description="Get started by creating your first gym location."
          action={{
            label: 'Add Gym',
            onClick: () => router.push('/gyms/new'),
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={gyms}
          searchKey="name"
          searchPlaceholder="Search gyms..."
          filterableColumns={[
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
        open={!!deleteGym}
        onOpenChange={(open) => !open && setDeleteGym(null)}
        title="Delete Gym"
        description={`Are you sure you want to delete "${deleteGym?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
