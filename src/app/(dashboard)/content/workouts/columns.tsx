'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Copy, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { WorkoutTemplate } from '@/types/models';

interface WorkoutColumnsOptions {
  onDelete: (workout: WorkoutTemplate) => void;
  onDuplicate: (workout: WorkoutTemplate) => void;
}

export function getWorkoutColumns({ onDelete, onDuplicate }: WorkoutColumnsOptions): ColumnDef<WorkoutTemplate>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <Link
          href={`/content/workouts/${row.original.id}/edit`}
          className="font-medium hover:underline"
        >
          {row.getValue('name')}
        </Link>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        return (
          <Badge variant="outline" className="capitalize">
            {type.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'difficulty',
      header: 'Difficulty',
      cell: ({ row }) => {
        const difficulty = row.getValue('difficulty') as string;
        const colors: Record<string, string> = {
          beginner: 'bg-green-100 text-green-800',
          intermediate: 'bg-yellow-100 text-yellow-800',
          advanced: 'bg-orange-100 text-orange-800',
          elite: 'bg-red-100 text-red-800',
        };
        return (
          <Badge className={colors[difficulty] ?? ''} variant="secondary">
            {difficulty}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'duration_minutes',
      header: 'Duration',
      cell: ({ row }) => {
        const minutes = row.getValue('duration_minutes') as number;
        return <span>{minutes} min</span>;
      },
    },
    {
      accessorKey: 'exercises',
      header: 'Exercises',
      cell: ({ row }) => {
        const exercises = row.original.exercises ?? [];
        return <span>{exercises.length} exercises</span>;
      },
    },
    {
      accessorKey: 'is_premium',
      header: 'Premium',
      cell: ({ row }) => {
        const isPremium = row.getValue('is_premium') as boolean;
        return isPremium ? (
          <Badge variant="default">Premium</Badge>
        ) : (
          <Badge variant="secondary">Free</Badge>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const workout = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/content/workouts/${workout.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(workout)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(workout)}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
