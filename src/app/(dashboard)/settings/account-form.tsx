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
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCurrentUser, useUpdateCurrentUser } from '@/hooks/queries/use-users';
import { type AccountProfileFormValues, accountProfileSchema } from '@/lib/validations/user';

export function AccountForm() {
  const { data: userData, isLoading: isLoadingUser } = useCurrentUser();
  const { mutate: updateProfile, isPending } = useUpdateCurrentUser();

  const form = useForm<AccountProfileFormValues>({
    resolver: zodResolver(accountProfileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      bio: '',
    },
  });

  useEffect(() => {
    if (userData?.user) {
      form.reset({
        first_name: userData.user.first_name || '',
        last_name: userData.user.last_name || '',
        phone: userData.user.phone || '',
        bio: userData.user.bio || '',
      });
    }
  }, [userData, form]);

  const onSubmit = (data: AccountProfileFormValues) => {
    updateProfile(
      {
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone || undefined,
      },
      {
        onSuccess: () => {
          toast.success('Profile updated successfully');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to update profile');
        },
      },
    );
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input placeholder="+1 (555) 000-0000" {...field} />
              </FormControl>
              <FormDescription>Optional. Used for account recovery.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little about yourself..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Brief description for your profile. Max 500 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Email:</span>
          <span className="font-medium text-foreground">{userData?.user?.email}</span>
          <span className="text-xs">(cannot be changed)</span>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </form>
    </Form>
  );
}
