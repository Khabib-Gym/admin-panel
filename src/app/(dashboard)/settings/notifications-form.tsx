'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useUpdateUserPreferences, useUserPreferences } from '@/hooks/queries/use-users';
import {
  type NotificationPreferencesFormValues,
  notificationPreferencesSchema,
} from '@/lib/validations/user';

export function NotificationsForm() {
  const { data: preferences, isLoading: isLoadingPreferences } = useUserPreferences();
  const { mutate: updatePreferences, isPending } = useUpdateUserPreferences();

  const form = useForm<NotificationPreferencesFormValues>({
    resolver: zodResolver(notificationPreferencesSchema),
    defaultValues: {
      push_notifications_enabled: true,
      email_notifications_enabled: true,
      workout_reminders_enabled: true,
    },
  });

  useEffect(() => {
    if (preferences) {
      form.reset({
        push_notifications_enabled: preferences.push_notifications_enabled,
        email_notifications_enabled: preferences.email_notifications_enabled,
        workout_reminders_enabled: preferences.workout_reminders_enabled,
      });
    }
  }, [preferences, form]);

  const onSubmit = (data: NotificationPreferencesFormValues) => {
    updatePreferences(data, {
      onSuccess: () => {
        toast.success('Notification preferences updated');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update preferences');
      },
    });
  };

  if (isLoadingPreferences) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="push_notifications_enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Push notifications</FormLabel>
                <FormDescription>Receive push notifications on your devices</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email_notifications_enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Email notifications</FormLabel>
                <FormDescription>Receive email updates about your account</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="workout_reminders_enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Workout reminders</FormLabel>
                <FormDescription>Get reminded about upcoming classes and sessions</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save preferences
        </Button>
      </form>
    </Form>
  );
}
