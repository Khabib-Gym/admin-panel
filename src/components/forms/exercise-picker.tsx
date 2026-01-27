'use client';

import { Check, Search } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useExercises } from '@/hooks/queries/use-exercises';
import type { Exercise } from '@/types/models';

interface ExercisePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (exercise: Exercise) => void;
  excludeIds?: string[];
}

export function ExercisePicker({
  open,
  onOpenChange,
  onSelect,
  excludeIds = [],
}: ExercisePickerProps) {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useExercises({ search, page_size: 50 });

  const exercises = (data?.items ?? []).filter((ex) => !excludeIds.includes(ex.id));

  const handleSelect = (exercise: Exercise) => {
    onSelect(exercise);
    onOpenChange(false);
    setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Exercise</DialogTitle>
          <DialogDescription>
            Search and select an exercise to add to your workout
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading exercises...</div>
          ) : exercises.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No exercises found</div>
          ) : (
            <div className="space-y-2">
              {exercises.map((exercise) => (
                <button
                  key={exercise.id}
                  type="button"
                  onClick={() => handleSelect(exercise)}
                  className="group w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{exercise.name}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          {exercise.body_zone.replace('_', ' ')}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {exercise.difficulty}
                        </Badge>
                        {[
                          ...(exercise.muscles_targeted?.primary ?? []),
                          ...(exercise.muscles_targeted?.secondary ?? []),
                        ]
                          .slice(0, 2)
                          .map((mg) => (
                            <Badge key={mg} variant="secondary" className="text-xs">
                              {mg.replace('_', ' ')}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    <Check className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
