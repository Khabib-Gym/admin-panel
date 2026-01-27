'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  BODY_ZONES,
  defaultExerciseValues,
  DIFFICULTY_LEVELS,
  EQUIPMENT,
  exerciseSchema,
  MUSCLES_TARGETED,
  type ExerciseFormValues,
} from '@/lib/validations/exercise';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

interface ExerciseFormProps {
  initialData?: ExerciseFormValues;
  onSubmit: (data: ExerciseFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function ExerciseForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Save',
}: ExerciseFormProps) {
  const form = useForm<ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: initialData ?? defaultExerciseValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exercise Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Barbell Bench Press" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of the exercise..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Instructions */}
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Step-by-step instructions (one per line)..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>How to perform the exercise correctly</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Body Zone */}
          <FormField
            control={form.control}
            name="body_zone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body Zone</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select body zone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BODY_ZONES.map((zone) => (
                      <SelectItem key={zone.value} value={zone.value}>
                        {zone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Difficulty */}
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

        {/* Primary Muscles Targeted */}
        <FormField
          control={form.control}
          name="muscles_targeted.primary"
          render={() => (
            <FormItem>
              <FormLabel>Primary Muscles</FormLabel>
              <FormDescription>Main muscles worked by this exercise</FormDescription>
              <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
                {MUSCLES_TARGETED.map((muscle) => (
                  <FormField
                    key={muscle.value}
                    control={form.control}
                    name="muscles_targeted.primary"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(muscle.value)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              if (checked) {
                                field.onChange([...current, muscle.value]);
                              } else {
                                field.onChange(current.filter((v) => v !== muscle.value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal">{muscle.label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Secondary Muscles Targeted */}
        <FormField
          control={form.control}
          name="muscles_targeted.secondary"
          render={() => (
            <FormItem>
              <FormLabel>Secondary Muscles</FormLabel>
              <FormDescription>Supporting muscles engaged during this exercise</FormDescription>
              <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
                {MUSCLES_TARGETED.map((muscle) => (
                  <FormField
                    key={muscle.value}
                    control={form.control}
                    name="muscles_targeted.secondary"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(muscle.value)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              if (checked) {
                                field.onChange([...current, muscle.value]);
                              } else {
                                field.onChange(current.filter((v) => v !== muscle.value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal">{muscle.label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Equipment */}
        <FormField
          control={form.control}
          name="equipment_ids"
          render={() => (
            <FormItem>
              <FormLabel>Equipment</FormLabel>
              <FormDescription>Select equipment needed (if any)</FormDescription>
              <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
                {EQUIPMENT.map((equip) => (
                  <FormField
                    key={equip.value}
                    control={form.control}
                    name="equipment_ids"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(equip.value)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              if (checked) {
                                field.onChange([...current, equip.value]);
                              } else {
                                field.onChange(current.filter((v) => v !== equip.value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer font-normal">{equip.label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Video URL */}
          <FormField
            control={form.control}
            name="video_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://youtube.com/..." {...field} />
                </FormControl>
                <FormDescription>Link to demonstration video</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Thumbnail URL */}
          <FormField
            control={form.control}
            name="thumbnail_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Duration */}
          <FormField
            control={form.control}
            name="duration_seconds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (seconds)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 30"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) =>
                      field.onChange(e.target.value ? parseInt(e.target.value) : undefined)
                    }
                  />
                </FormControl>
                <FormDescription>Optional: for timed exercises</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Active */}
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Active</FormLabel>
                  <FormDescription>Make this exercise available</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

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
    </Form>
  );
}
