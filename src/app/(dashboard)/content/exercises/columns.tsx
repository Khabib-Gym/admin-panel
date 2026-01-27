'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash, Video } from 'lucide-react';
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
import type { Exercise } from '@/types/models';

interface GetExerciseColumnsProps {
  onEdit: (exercise: Exercise) => void;
  onDelete: (exercise: Exercise) => void;
}

const difficultyVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  beginner: 'secondary',
  intermediate: 'default',
  advanced: 'destructive',
  elite: 'outline',
};

export function getExerciseColumns({
  onEdit,
  onDelete,
}: GetExerciseColumnsProps): ColumnDef<Exercise>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.video_url && <Video className="h-4 w-4 text-muted-foreground" />}
          <span className="font-medium">{row.getValue('name')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'body_zone',
      header: 'Body Zone',
      cell: ({ row }) => {
        const zone = row.getValue('body_zone') as string;
        return <Badge variant="outline">{zone.replace('_', ' ')}</Badge>;
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'difficulty',
      header: 'Difficulty',
      cell: ({ row }) => {
        const difficulty = row.getValue('difficulty') as string;
        return (
          <Badge variant={difficultyVariant[difficulty] ?? 'default'}>
            {difficulty}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'muscles_targeted',
      header: 'Muscles',
      cell: ({ row }) => {
        const musclesData = row.original.muscles_targeted;
        // Combine primary and secondary muscles for display
        const allMuscles = [
          ...(musclesData?.primary ?? []),
          ...(musclesData?.secondary ?? []),
        ];
        if (allMuscles.length === 0)
          return <span className="text-muted-foreground">-</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {allMuscles.slice(0, 2).map((m) => (
              <Badge key={m} variant="secondary" className="text-xs">
                {m.replace('_', ' ')}
              </Badge>
            ))}
            {allMuscles.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{allMuscles.length - 2}
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('is_active') as boolean;
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        const isActive = row.getValue(id) as boolean;
        return value.includes(isActive ? 'active' : 'inactive');
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const exercise = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(exercise)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {exercise.video_url && (
                <DropdownMenuItem asChild>
                  <Link href={exercise.video_url} target="_blank">
                    <Video className="mr-2 h-4 w-4" />
                    View Video
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(exercise)}
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
