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
  type PrivacyPreferencesFormValues,
  privacyPreferencesSchema,
} from '@/lib/validations/user';

export function PrivacyForm() {
  const { data: preferences, isLoading: isLoadingPreferences } = useUserPreferences();
  const { mutate: updatePreferences, isPending } = useUpdateUserPreferences();

  const form = useForm<PrivacyPreferencesFormValues>({
    resolver: zodResolver(privacyPreferencesSchema),
    defaultValues: {
      profile_public: true,
      show_on_leaderboard: true,
      allow_follows: true,
    },
  });

  useEffect(() => {
    if (preferences) {
      form.reset({
        profile_public: preferences.profile_public,
        show_on_leaderboard: preferences.show_on_leaderboard,
        allow_follows: preferences.allow_follows,
      });
    }
  }, [preferences, form]);

  const onSubmit = (data: PrivacyPreferencesFormValues) => {
    updatePreferences(data, {
      onSuccess: () => {
        toast.success('Privacy settings updated');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update settings');
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
          name="profile_public"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Public profile</FormLabel>
                <FormDescription>
                  Allow other users to view your profile information
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="show_on_leaderboard"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Show on leaderboard</FormLabel>
                <FormDescription>Display your ranking on gym leaderboards</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allow_follows"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Allow follows</FormLabel>
                <FormDescription>Let other users follow your activity</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save settings
        </Button>
      </form>
    </Form>
  );
}
