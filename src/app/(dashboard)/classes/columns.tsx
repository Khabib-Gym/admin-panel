'use client';

import type { ColumnDef } from '@tanstack/react-table';
import {
  Calendar,
  CheckCircle,
  Eye,
  Pencil,
  Play,
  Trash,
  Users,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { DataTableRowActions, type RowAction } from '@/components/data-table/row-actions';
import { StatusBadge } from '@/components/shared/status-badge';
import { Badge } from '@/components/ui/badge';
import type { Class } from '@/types/models';

interface ColumnActionsProps {
  onEdit: (classItem: Class) => void;
  onDelete: (classItem: Class) => void;
  onStart: (classItem: Class) => void;
  onComplete: (classItem: Class) => void;
  onCancel: (classItem: Class) => void;
}

export function getClassColumns({
  onEdit,
  onDelete,
  onStart,
  onComplete,
  onCancel,
}: ColumnActionsProps): ColumnDef<Class>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <Link href={`/classes/${row.original.id}`} className="font-medium hover:underline">
          {row.getValue('name')}
        </Link>
      ),
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {(row.getValue('type') as string).replace('_', ' ')}
        </Badge>
      ),
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'scheduled_at',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date & Time" />,
      cell: ({ row }) => {
        const date = row.getValue('scheduled_at') as string;
        return (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{format(new Date(date), 'MMM d, yyyy h:mm a')}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'duration_minutes',
      header: 'Duration',
      cell: ({ row }) => `${row.getValue('duration_minutes')} min`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'current_bookings',
      header: 'Bookings',
      cell: ({ row }) => {
        const booked = row.original.current_bookings ?? 0;
        const capacity = row.original.capacity;
        const percentage = Math.round((booked / capacity) * 100);
        return (
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span>
              {booked}/{capacity}
            </span>
            <span className="text-xs text-muted-foreground">({percentage}%)</span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const classItem = row.original;
        const actions: RowAction[] = [
          {
            label: 'View Details',
            icon: Eye,
            onClick: () => {
              window.location.href = `/classes/${classItem.id}`;
            },
          },
          {
            label: 'Bookings',
            icon: Users,
            onClick: () => {
              window.location.href = `/classes/${classItem.id}/bookings`;
            },
          },
        ];

        // Add edit for scheduled classes
        if (classItem.status === 'scheduled') {
          actions.push({
            label: 'Edit',
            icon: Pencil,
            onClick: () => onEdit(classItem),
            separator: true,
          });
        }

        // Add status actions based on current status
        if (classItem.status === 'scheduled') {
          actions.push({
            label: 'Start Class',
            icon: Play,
            onClick: () => onStart(classItem),
          });
          actions.push({
            label: 'Cancel Class',
            icon: XCircle,
            onClick: () => onCancel(classItem),
            variant: 'destructive',
          });
        }

        if (classItem.status === 'in_progress') {
          actions.push({
            label: 'Complete Class',
            icon: CheckCircle,
            onClick: () => onComplete(classItem),
            separator: true,
          });
        }

        // Delete for scheduled only
        if (classItem.status === 'scheduled') {
          actions.push({
            label: 'Delete',
            icon: Trash,
            onClick: () => onDelete(classItem),
            variant: 'destructive',
            separator: true,
          });
        }

        return <DataTableRowActions actions={actions} />;
      },
    },
  ];
}
