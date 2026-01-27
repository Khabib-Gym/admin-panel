'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGyms } from '@/hooks/queries/use-gyms';
import { useCreateMembershipAdmin } from '@/hooks/queries/use-memberships';
import { useUsers } from '@/hooks/queries/use-users';
import { cn } from '@/lib/utils';
import { MembershipType } from '@/types/models';

const createMembershipSchema = z.object({
  user_id: z.string().min(1, 'User is required'),
  gym_id: z.string().min(1, 'Gym is required'),
  type: z.enum(['basic', 'premium', 'vip', 'trial'], {
    message: 'Membership type is required',
  }),
  duration_days: z
    .number()
    .min(1, 'Duration must be at least 1 day')
    .max(365, 'Duration cannot exceed 365 days'),
});

type CreateMembershipFormValues = z.infer<typeof createMembershipSchema>;

interface CreateMembershipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMembershipDialog({ open, onOpenChange }: CreateMembershipDialogProps) {
  const [userSearchOpen, setUserSearchOpen] = useState(false);
  const [gymSearchOpen, setGymSearchOpen] = useState(false);

  const { mutate: createMembership, isPending } = useCreateMembershipAdmin();
  const { data: usersData, isLoading: loadingUsers } = useUsers({ page_size: 100 });
  const { data: gymsData, isLoading: loadingGyms } = useGyms({ page_size: 100 });

  const users = usersData?.items || [];
  const gyms = gymsData?.items || [];

  const form = useForm<CreateMembershipFormValues>({
    resolver: zodResolver(createMembershipSchema),
    defaultValues: {
      user_id: '',
      gym_id: '',
      type: 'basic',
      duration_days: 30,
    },
  });

  const handleSubmit = (data: CreateMembershipFormValues) => {
    createMembership(
      {
        user_id: data.user_id,
        gym_id: data.gym_id,
        type: data.type,
        duration_days: data.duration_days,
      },
      {
        onSuccess: () => {
          toast.success('Membership created successfully');
          form.reset();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to create membership');
        },
      },
    );
  };

  const selectedUser = users.find((u) => u.id === form.watch('user_id'));
  const selectedGym = gyms.find((g) => g.id === form.watch('gym_id'));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Membership</DialogTitle>
          <DialogDescription>Create a new membership for a user at a gym.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* User Select */}
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>User</FormLabel>
                  <Popover open={userSearchOpen} onOpenChange={setUserSearchOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={userSearchOpen}
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {selectedUser
                            ? `${selectedUser.first_name} ${selectedUser.last_name} (${selectedUser.email})`
                            : 'Select user...'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Search users..." />
                        <CommandList>
                          <CommandEmpty>
                            {loadingUsers ? 'Loading...' : 'No users found.'}
                          </CommandEmpty>
                          <CommandGroup>
                            {users.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={`${user.first_name} ${user.last_name} ${user.email}`}
                                onSelect={() => {
                                  form.setValue('user_id', user.id);
                                  setUserSearchOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value === user.id ? 'opacity-100' : 'opacity-0',
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>
                                    {user.first_name} {user.last_name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {user.email}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gym Select */}
            <FormField
              control={form.control}
              name="gym_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Gym</FormLabel>
                  <Popover open={gymSearchOpen} onOpenChange={setGymSearchOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={gymSearchOpen}
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {selectedGym
                            ? `${selectedGym.name} (${selectedGym.city})`
                            : 'Select gym...'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Search gyms..." />
                        <CommandList>
                          <CommandEmpty>
                            {loadingGyms ? 'Loading...' : 'No gyms found.'}
                          </CommandEmpty>
                          <CommandGroup>
                            {gyms.map((gym) => (
                              <CommandItem
                                key={gym.id}
                                value={`${gym.name} ${gym.city}`}
                                onSelect={() => {
                                  form.setValue('gym_id', gym.id);
                                  setGymSearchOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value === gym.id ? 'opacity-100' : 'opacity-0',
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span>{gym.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {gym.city}, {gym.country}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Membership Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Membership Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(MembershipType).map(([key, value]) => (
                          <SelectItem key={value} value={value}>
                            {key.charAt(0) + key.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration */}
              <FormField
                control={form.control}
                name="duration_days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={365}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                      />
                    </FormControl>
                    <FormDescription>1-365 days</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Membership
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
