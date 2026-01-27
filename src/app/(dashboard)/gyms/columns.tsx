'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { BarChart, MapPin, Pencil, Trash, Users } from 'lucide-react';
import Link from 'next/link';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { DataTableRowActions, type RowAction } from '@/components/data-table/row-actions';
import { Badge } from '@/components/ui/badge';
import type { Gym } from '@/types/models';

interface ColumnActionsProps {
  onEdit: (gym: Gym) => void;
  onDelete: (gym: Gym) => void;
  onNavigate: (path: string) => void;
}

export function getGymColumns({ onEdit, onDelete, onNavigate }: ColumnActionsProps): ColumnDef<Gym>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <Link href={`/gyms/${row.original.id}`} className="font-medium hover:underline">
          {row.getValue('name')}
        </Link>
      ),
    },
    {
      accessorKey: 'city',
      header: ({ column }) => <DataTableColumnHeader column={column} title="City" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          {row.getValue('city')}
        </div>
      ),
    },
    {
      accessorKey: 'country',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Country" />,
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.getValue('is_active') ? 'default' : 'secondary'}>
          {row.getValue('is_active') ? 'Active' : 'Inactive'}
        </Badge>
      ),
      filterFn: (row, id, value) => {
        if (value === 'all') return true;
        return row.getValue(id) === (value === 'active');
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const gym = row.original;
        const actions: RowAction[] = [
          {
            label: 'Edit',
            icon: Pencil,
            onClick: () => onEdit(gym),
          },
          {
            label: 'Analytics',
            icon: BarChart,
            onClick: () => onNavigate(`/analytics/${gym.id}`),
          },
          {
            label: 'Members',
            icon: Users,
            onClick: () => onNavigate(`/gyms/${gym.id}/members`),
          },
          {
            label: 'Delete',
            icon: Trash,
            onClick: () => onDelete(gym),
            variant: 'destructive',
            separator: true,
          },
        ];

        return <DataTableRowActions actions={actions} />;
      },
    },
  ];
}
