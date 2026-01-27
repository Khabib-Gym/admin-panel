'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAchievements, useDeleteAchievement } from '@/hooks/queries/use-achievements';
import { ACHIEVEMENT_CATEGORIES, REQUIREMENT_TYPES } from '@/lib/validations/achievement';
import { Trophy, Target, Star, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Achievement } from '@/types/models';

function AchievementCategoryBadge({ category }: { category: string }) {
  const categoryStyles: Record<string, string> = {
    visits: 'bg-blue-100 text-blue-800 border-blue-200',
    streaks: 'bg-orange-100 text-orange-800 border-orange-200',
    classes: 'bg-green-100 text-green-800 border-green-200',
    workouts: 'bg-purple-100 text-purple-800 border-purple-200',
    social: 'bg-pink-100 text-pink-800 border-pink-200',
    milestones: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  return (
    <Badge variant="outline" className={categoryStyles[category] || ''}>
      {category}
    </Badge>
  );
}

function getRequirementLabel(type: string): string {
  const found = REQUIREMENT_TYPES.find((t) => t.value === type);
  return found?.label || type;
}

interface AchievementRowProps {
  achievement: Achievement;
  onDelete: (achievement: Achievement) => void;
}

function AchievementRow({ achievement, onDelete }: AchievementRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            {achievement.icon_url ? (
              <img
                src={achievement.icon_url}
                alt={achievement.name}
                className="h-6 w-6 object-contain"
              />
            ) : (
              <Trophy className="h-5 w-5 text-primary" />
            )}
          </div>
          <div>
            <p className="font-medium">{achievement.name}</p>
            {achievement.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {achievement.description}
              </p>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <AchievementCategoryBadge category={achievement.category} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {getRequirementLabel(achievement.requirement_type)}: {achievement.requirement_value}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="font-medium">{achievement.points}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={achievement.is_active ? 'default' : 'secondary'}>
          {achievement.is_active ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/achievements/${achievement.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(achievement)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Achievement</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Requirement</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
      <Trophy className="h-12 w-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-semibold">No achievements yet</h3>
      <p className="mt-2 text-sm text-muted-foreground text-center">
        Create your first achievement to start gamifying your gym experience.
      </p>
    </div>
  );
}

export function AchievementsList() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null);
  const { data, isLoading, error } = useAchievements();
  const { mutate: deleteAchievement, isPending: isDeleting } = useDeleteAchievement();

  const handleDelete = () => {
    if (!deleteTarget) return;

    deleteAchievement(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Achievement deleted');
        setDeleteTarget(null);
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to delete achievement');
      },
    });
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        Failed to load achievements: {error.message}
      </div>
    );
  }

  const achievements = data?.items || [];
  const filteredAchievements =
    categoryFilter === 'all'
      ? achievements
      : achievements.filter((a) => a.category === categoryFilter);

  if (achievements.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {ACHIEVEMENT_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          {filteredAchievements.length} achievement{filteredAchievements.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Achievement</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Requirement</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAchievements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No achievements found for this category.
                </TableCell>
              </TableRow>
            ) : (
              filteredAchievements.map((achievement) => (
                <AchievementRow
                  key={achievement.id}
                  achievement={achievement}
                  onDelete={setDeleteTarget}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteTarget !== null} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Achievement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
              Users who have earned this achievement will lose it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              variant="destructive"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
