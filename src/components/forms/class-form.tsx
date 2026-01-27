'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { useGyms } from '@/hooks/queries/use-gyms';
import {
  CLASS_TYPES,
  type ClassFormValues,
  classSchema,
  defaultClassValues,
} from '@/lib/validations/class';

interface ClassFormProps {
  initialData?: Partial<ClassFormValues>;
  onSubmit: (data: ClassFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function ClassForm({
  initialData,
  onSubmit,
  isLoading = false,
  submitLabel = 'Create Class',
}: ClassFormProps) {
  const { data: gymsData, isLoading: gymsLoading } = useGyms();

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: initialData ? { ...defaultClassValues, ...initialData } : defaultClassValues,
  });

  const gyms = gymsData?.items ?? [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Morning HIIT Session" />
                </FormControl>
                <FormDescription>A descriptive name for the class</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CLASS_TYPES.map((type) => (
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

          {/* Gym */}
          <FormField
            control={form.control}
            name="gym_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gym Location</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={gymsLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={gymsLoading ? 'Loading...' : 'Select gym'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gyms.map((gym) => (
                      <SelectItem key={gym.id} value={gym.id}>
                        {gym.name} - {gym.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Room */}
          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} placeholder="Studio A" />
                </FormControl>
                <FormDescription>Specific room or area</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date/Time */}
          <FormField
            control={form.control}
            name="scheduled_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date & Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Duration */}
          <FormField
            control={form.control}
            name="duration_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={15}
                    max={180}
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>Between 15 and 180 minutes</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Capacity */}
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>Maximum number of participants</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  placeholder="Describe what participants can expect from this class..."
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={isLoading}
          >
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
