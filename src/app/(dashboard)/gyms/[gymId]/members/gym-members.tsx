'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { RoleBadge } from '@/components/shared/role-badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { PageLoader } from '@/components/shared/loading-spinner';
import { useGym } from '@/hooks/queries/use-gyms';
import { gymsApi } from '@/lib/api/gyms';
import { queryKeys } from '@/lib/query/keys';
import { ArrowLeft, User } from 'lucide-react';
import { format } from 'date-fns';
import type { ColumnDef } from '@tanstack/react-table';
import type { User as UserType, Membership } from '@/types/models';

interface GymMembersProps {
  gymId: string;
}

interface MemberRow {
  user: UserType;
  membership: Membership;
}

const columns: ColumnDef<MemberRow>[] = [
  {
    id: 'name',
    accessorFn: (row) => `${row.user.first_name} ${row.user.last_name}`,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <Link
        href={`/users/${row.original.user.id}`}
        className="flex items-center gap-2 font-medium hover:underline"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          <User className="h-4 w-4" />
        </div>
        {row.original.user.first_name} {row.original.user.last_name}
      </Link>
    ),
  },
  {
    id: 'email',
    accessorFn: (row) => row.user.email,
    header: 'Email',
  },
  {
    id: 'role',
    accessorFn: (row) => row.user.role,
    header: 'Role',
    cell: ({ row }) => <RoleBadge role={row.original.user.role} />,
  },
  {
    id: 'type',
    accessorFn: (row) => row.membership.type,
    header: 'Membership',
    cell: ({ row }) => <span className="capitalize">{row.original.membership.type}</span>,
  },
  {
    id: 'status',
    accessorFn: (row) => row.membership.status,
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.membership.status} />,
  },
  {
    id: 'expires_at',
    accessorFn: (row) => row.membership.expires_at,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Expires" />,
    cell: ({ row }) => format(new Date(row.original.membership.expires_at), 'MMM d, yyyy'),
  },
];

export function GymMembers({ gymId }: GymMembersProps) {
  const { data: gymData, isLoading: gymLoading } = useGym(gymId);

  const { data: membersData, isLoading: membersLoading } = useQuery({
    queryKey: queryKeys.gyms.members(gymId),
    queryFn: () => gymsApi.getMembers(gymId),
    enabled: !!gymId,
  });

  if (gymLoading || membersLoading) {
    return <PageLoader />;
  }

  if (!gymData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Gym not found</h2>
        <Button asChild className="mt-4">
          <Link href="/gyms">Back to Gyms</Link>
        </Button>
      </div>
    );
  }

  const gym = gymData.gym;
  const members = membersData?.items ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/gyms/${gymId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{gym.name} Members</h1>
            <p className="text-muted-foreground">{members.length} total members</p>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <DataTable
        columns={columns}
        data={members}
        searchKey="email"
        searchPlaceholder="Search by email..."
        filterableColumns={[
          {
            id: 'status',
            title: 'Status',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Paused', value: 'paused' },
              { label: 'Expired', value: 'expired' },
              { label: 'Cancelled', value: 'cancelled' },
            ],
          },
        ]}
      />
    </div>
  );
}
