'use client';

import { Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/loading-spinner';
import { RoleChangeDialog } from '@/components/users/role-change-dialog';
import { useUsers } from '@/hooks/queries/use-users';
import type { User } from '@/types/models';
import { getUserColumns } from './columns';

export function UserList() {
  const router = useRouter();
  const [roleChangeUser, setRoleChangeUser] = useState<User | null>(null);

  const { data, isLoading, error } = useUsers();

  const handleViewDetails = (user: User) => {
    router.push(`/users/${user.id}`);
  };

  const handleChangeRole = (user: User) => {
    setRoleChangeUser(user);
  };

  const columns = getUserColumns({
    onViewDetails: handleViewDetails,
    onChangeRole: handleChangeRole,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading users"
        description={error.message}
        action={{
          label: 'Retry',
          onClick: () => window.location.reload(),
        }}
      />
    );
  }

  const users = data?.items ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and roles</p>
        </div>
      </div>

      {/* Table */}
      {users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="No users match your search criteria."
        />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          searchKey="name"
          searchPlaceholder="Search by name or email..."
          filterableColumns={[
            {
              id: 'role',
              title: 'Role',
              options: [
                { label: 'Member', value: 'member' },
                { label: 'Coach', value: 'coach' },
                { label: 'Admin', value: 'admin' },
                { label: 'Super Admin', value: 'super_admin' },
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

      {/* Role Change Dialog */}
      {roleChangeUser && (
        <RoleChangeDialog
          user={roleChangeUser}
          open={!!roleChangeUser}
          onOpenChange={(open) => !open && setRoleChangeUser(null)}
        />
      )}
    </div>
  );
}
