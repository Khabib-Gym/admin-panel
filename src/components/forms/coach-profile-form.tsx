'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  coachProfileSchema,
  type CoachProfileFormValues,
  SPECIALIZATIONS,
} from '@/lib/validations/coach';
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

interface CoachProfileFormProps {
  initialData?: Partial<CoachProfileFormValues>;
  onSubmit: (data: CoachProfileFormValues) => void;
  isLoading?: boolean;
}

export function CoachProfileForm({
  initialData,
  onSubmit,
  isLoading = false,
}: CoachProfileFormProps) {
  const form = useForm<CoachProfileFormValues>({
    resolver: zodResolver(coachProfileSchema),
    defaultValues: {
      bio: initialData?.bio ?? '',
      specializations: initialData?.specializations ?? [],
      certifications: initialData?.certifications ?? [],
      hourly_rate: initialData?.hourly_rate ?? undefined,
      is_accepting_clients: initialData?.is_accepting_clients ?? true,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell members about yourself, your experience, and training philosophy..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description visible to members (max 1000 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Specializations */}
        <FormField
          control={form.control}
          name="specializations"
          render={() => (
            <FormItem>
              <FormLabel>Specializations</FormLabel>
              <FormDescription>Select your areas of expertise</FormDescription>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {SPECIALIZATIONS.map((spec) => (
                  <FormField
                    key={spec.value}
                    control={form.control}
                    name="specializations"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(spec.value)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              if (checked) {
                                field.onChange([...current, spec.value]);
                              } else {
                                field.onChange(current.filter((v) => v !== spec.value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">{spec.label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hourly Rate */}
        <FormField
          control={form.control}
          name="hourly_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hourly Rate ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="50.00"
                  {...field}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? parseFloat(value) : undefined);
                  }}
                />
              </FormControl>
              <FormDescription>Your rate for private sessions</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Availability */}
        <FormField
          control={form.control}
          name="is_accepting_clients"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Available for Bookings</FormLabel>
                <FormDescription>Members can book private sessions with you</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
