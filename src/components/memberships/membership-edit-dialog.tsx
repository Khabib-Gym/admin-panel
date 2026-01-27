'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
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
import { useUpdateMembershipAdmin } from '@/hooks/queries/use-memberships';
import type { Membership } from '@/types/models';

const membershipEditSchema = z.object({
  type: z.enum(['basic', 'premium', 'vip', 'trial']),
  status: z.enum(['active', 'paused', 'expired', 'cancelled']),
  expires_at: z.string().optional(),
});

type MembershipEditFormValues = z.infer<typeof membershipEditSchema>;

interface MembershipEditDialogProps {
  membership: Membership | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MembershipEditDialog({
  membership,
  open,
  onOpenChange,
}: MembershipEditDialogProps) {
  const { mutate: update, isPending } = useUpdateMembershipAdmin();

  const form = useForm<MembershipEditFormValues>({
    resolver: zodResolver(membershipEditSchema),
    defaultValues: {
      type: 'basic',
      status: 'active',
      expires_at: '',
    },
  });

  // Reset form when membership changes
  useEffect(() => {
    if (membership) {
      form.reset({
        type: membership.type,
        status: membership.status,
        expires_at: membership.expires_at?.slice(0, 10) ?? '',
      });
    }
  }, [membership, form]);

  const handleSubmit = (data: MembershipEditFormValues) => {
    if (!membership) return;

    update(
      {
        id: membership.id,
        data: {
          type: data.type,
          status: data.status,
          expires_at: data.expires_at || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success('Membership updated');
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to update membership');
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Membership</DialogTitle>
          <DialogDescription>Update membership type, status, or expiration date.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expires_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiration Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
