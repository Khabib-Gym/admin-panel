'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { GripVertical, Loader2, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { DIFFICULTY_LEVELS } from '@/lib/validations/exercise';
import {
  defaultWorkoutTemplateValues,
  WORKOUT_TYPES,
  workoutTemplateSchema,
  type WorkoutTemplateFormValues,
} from '@/lib/validations/workout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { Exercise } from '@/types/models';
import { ExercisePicker } from './exercise-picker';

interface WorkoutTemplateFormProps {
  initialData?: WorkoutTemplateFormValues;
  onSubmit: (data: WorkoutTemplateFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function WorkoutTemplateForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Save',
}: WorkoutTemplateFormProps) {
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  const form = useForm<WorkoutTemplateFormValues>({
    resolver: zodResolver(workoutTemplateSchema),
    defaultValues: initialData ?? defaultWorkoutTemplateValues,
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'exercises',
  });

  const handleAddExercise = (exercise: Exercise) => {
    append({
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      order: fields.length,
      sets: 3,
      reps: 10,
      rest_seconds: 60,
    });
  };

  const moveExercise = (from: number, to: number) => {
    if (to >= 0 && to < fields.length) {
      move(from, to);
      // Update order values
      fields.forEach((_, index) => {
        form.setValue(`exercises.${index}.order`, index);
      });
    }
  };

  const excludeIds = fields.map((f) => f.exercise_id);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workout Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Full Body Strength" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the workout..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {WORKOUT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DIFFICULTY_LEVELS.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rounds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rounds (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 3"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rest_between_rounds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rest between rounds (sec)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 60"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_premium"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Premium Content</FormLabel>
                    <FormDescription>Only available to premium members</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Exercises */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Exercises</CardTitle>
            <Button type="button" onClick={() => setShowExercisePicker(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
          </CardHeader>
          <CardContent>
            {fields.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No exercises added yet. Click &quot;Add Exercise&quot; to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3"
                  >
                    <div className="flex flex-col gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => moveExercise(index, index - 1)}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => moveExercise(index, index + 1)}
                        disabled={index === fields.length - 1}
                      >
                        ↓
                      </Button>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="font-medium">{field.exercise_name || 'Exercise'}</span>
                      </div>
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        <FormField
                          control={form.control}
                          name={`exercises.${index}.sets`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Sets</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="h-8"
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value ? parseInt(e.target.value) : undefined,
                                    )
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`exercises.${index}.reps`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Reps</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="h-8"
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value ? parseInt(e.target.value) : undefined,
                                    )
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`exercises.${index}.duration_seconds`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Duration (s)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="h-8"
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value ? parseInt(e.target.value) : undefined,
                                    )
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`exercises.${index}.rest_seconds`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Rest (s)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="h-8"
                                  {...field}
                                  value={field.value ?? ''}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value ? parseInt(e.target.value) : undefined,
                                    )
                                  }
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <FormField
              control={form.control}
              name="exercises"
              render={() => <FormMessage className="mt-2" />}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>

      <ExercisePicker
        open={showExercisePicker}
        onOpenChange={setShowExercisePicker}
        onSelect={handleAddExercise}
        excludeIds={excludeIds}
      />
    </Form>
  );
}
