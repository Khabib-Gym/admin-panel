'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, Pause, Play, Ban, Edit } from 'lucide-react';
import {
  usePauseMembership,
  useResumeMembership,
  useCancelMembership,
} from '@/hooks/queries/use-memberships';
import { toast } from 'sonner';
import type { Membership } from '@/types/models';

interface MembershipActionsProps {
  membership: Membership;
  onEdit?: () => void;
}

export function MembershipActions({ membership, onEdit }: MembershipActionsProps) {
  const [confirmAction, setConfirmAction] = useState<'pause' | 'resume' | 'cancel' | null>(null);

  const { mutate: pause, isPending: isPausing } = usePauseMembership();
  const { mutate: resume, isPending: isResuming } = useResumeMembership();
  const { mutate: cancel, isPending: isCancelling } = useCancelMembership();

  const isPending = isPausing || isResuming || isCancelling;

  const handleAction = () => {
    if (!confirmAction) return;

    const actions = {
      pause: () =>
        pause(membership.id, {
          onSuccess: () => {
            toast.success('Membership paused');
            setConfirmAction(null);
          },
          onError: (error) => toast.error(error.message || 'Failed to pause membership'),
        }),
      resume: () =>
        resume(membership.id, {
          onSuccess: () => {
            toast.success('Membership resumed');
            setConfirmAction(null);
          },
          onError: (error) => toast.error(error.message || 'Failed to resume membership'),
        }),
      cancel: () =>
        cancel(membership.id, {
          onSuccess: () => {
            toast.success('Membership cancelled');
            setConfirmAction(null);
          },
          onError: (error) => toast.error(error.message || 'Failed to cancel membership'),
        }),
    };

    actions[confirmAction]();
  };

  const canPause = membership.status === 'active';
  const canResume = membership.status === 'paused';
  const canCancel = membership.status === 'active' || membership.status === 'paused';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onEdit && (
            <>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          {canPause && (
            <DropdownMenuItem onClick={() => setConfirmAction('pause')}>
              <Pause className="mr-2 h-4 w-4" />
              Pause Membership
            </DropdownMenuItem>
          )}
          {canResume && (
            <DropdownMenuItem onClick={() => setConfirmAction('resume')}>
              <Play className="mr-2 h-4 w-4" />
              Resume Membership
            </DropdownMenuItem>
          )}
          {canCancel && (
            <DropdownMenuItem
              onClick={() => setConfirmAction('cancel')}
              className="text-destructive focus:text-destructive"
            >
              <Ban className="mr-2 h-4 w-4" />
              Cancel Membership
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmAction !== null} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === 'pause' && 'Pause Membership'}
              {confirmAction === 'resume' && 'Resume Membership'}
              {confirmAction === 'cancel' && 'Cancel Membership'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === 'pause' &&
                'This will temporarily pause the membership. The member will not be able to access the gym until resumed.'}
              {confirmAction === 'resume' &&
                'This will resume the paused membership. The member will regain access to the gym.'}
              {confirmAction === 'cancel' &&
                'This will permanently cancel the membership. This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              disabled={isPending}
              variant={confirmAction === 'cancel' ? 'destructive' : 'default'}
            >
              {isPending ? 'Processing...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
