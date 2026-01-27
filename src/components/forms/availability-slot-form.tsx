'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  availabilitySlotSchema,
  type AvailabilitySlotFormValues,
  DAYS_OF_WEEK,
} from '@/lib/validations/availability';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useGyms } from '@/hooks/queries/use-gyms';

interface AvailabilitySlotFormProps {
  initialData?: Partial<AvailabilitySlotFormValues>;
  onSubmit: (data: AvailabilitySlotFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AvailabilitySlotForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: AvailabilitySlotFormProps) {
  const { data: gymsData } = useGyms();
  const gyms = gymsData?.items ?? [];

  const form = useForm<AvailabilitySlotFormValues>({
    resolver: zodResolver(availabilitySlotSchema),
    defaultValues: {
      gym_id: initialData?.gym_id ?? '',
      day_of_week: initialData?.day_of_week ?? 'monday',
      start_time: initialData?.start_time ?? '09:00',
      end_time: initialData?.end_time ?? '17:00',
      is_recurring: initialData?.is_recurring ?? true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Gym (required) */}
        <FormField
          control={form.control}
          name="gym_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gym</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a gym" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {gyms.map((gym) => (
                    <SelectItem key={gym.id} value={gym.id}>
                      {gym.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Day of Week */}
        <FormField
          control={form.control}
          name="day_of_week"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Day</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Start Time */}
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Time */}
          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Recurring */}
        <FormField
          control={form.control}
          name="is_recurring"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <FormLabel>Recurring Weekly</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
