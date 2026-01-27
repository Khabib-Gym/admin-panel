'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { Eye, Mail, UserCog } from 'lucide-react';
import Link from 'next/link';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { DataTableRowActions, type RowAction } from '@/components/data-table/row-actions';
import { RoleBadge } from '@/components/shared/role-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/types/models';

interface ColumnActionsProps {
  onViewDetails: (user: User) => void;
  onChangeRole: (user: User) => void;
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function getUserColumns({
  onViewDetails,
  onChangeRole,
}: ColumnActionsProps): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user.profile_image_url}
                alt={`${user.first_name} ${user.last_name}`}
              />
              <AvatarFallback className="text-xs">
                {getInitials(user.first_name, user.last_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link href={`/users/${user.id}`} className="font-medium hover:underline">
                {user.first_name} {user.last_name}
              </Link>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                {user.email}
              </div>
            </div>
          </div>
        );
      },
      filterFn: (row, _id, value: string) => {
        const user = row.original;
        const searchValue = value.toLowerCase();
        return (
          user.first_name.toLowerCase().includes(searchValue) ||
          user.last_name.toLowerCase().includes(searchValue) ||
          user.email.toLowerCase().includes(searchValue)
        );
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => <RoleBadge role={row.getValue('role')} />,
      filterFn: (row, id, value: string) => {
        if (value === 'all') return true;
        return row.getValue(id) === value;
      },
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.getValue('is_active') ? 'default' : 'secondary'}>
          {row.getValue('is_active') ? 'Active' : 'Inactive'}
        </Badge>
      ),
      filterFn: (row, id, value: string) => {
        if (value === 'all') return true;
        return row.getValue(id) === (value === 'active');
      },
    },
    {
      accessorKey: 'is_verified',
      header: 'Verified',
      cell: ({ row }) => (
        <Badge variant={row.getValue('is_verified') ? 'default' : 'outline'}>
          {row.getValue('is_verified') ? 'Verified' : 'Unverified'}
        </Badge>
      ),
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Joined" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at'));
        return (
          <span className="text-muted-foreground">
            {formatDistanceToNow(date, { addSuffix: true })}
          </span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const user = row.original;
        const actions: RowAction[] = [
          {
            label: 'View Details',
            icon: Eye,
            onClick: () => onViewDetails(user),
          },
          {
            label: 'Change Role',
            icon: UserCog,
            onClick: () => onChangeRole(user),
          },
        ];

        return <DataTableRowActions actions={actions} />;
      },
    },
  ];
}
