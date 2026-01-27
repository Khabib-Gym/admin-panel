'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { PageLoader } from '@/components/shared/loading-spinner';
import { useSession, useCompleteSession, useCancelSession } from '@/hooks/queries/use-sessions';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Mail,
  CheckCircle,
  XCircle,
  DollarSign,
  Loader2,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

interface SessionDetailsProps {
  sessionId: string;
}

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  scheduled: 'outline',
  confirmed: 'default',
  in_progress: 'default',
  completed: 'secondary',
  cancelled: 'destructive',
  no_show: 'destructive',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={statusVariants[status] || 'outline'} className="text-sm">
      {status.replace(/_/g, ' ').toUpperCase()}
    </Badge>
  );
}

export function SessionDetails({ sessionId }: SessionDetailsProps) {
  const router = useRouter();
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [memberAttended, setMemberAttended] = useState(true);

  const { data: session, isLoading } = useSession(sessionId);
  const { mutate: complete, isPending: isCompleting } = useCompleteSession();
  const { mutate: cancel, isPending: isCancelling } = useCancelSession();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Session not found</h2>
        <Button className="mt-4" onClick={() => router.push('/sessions')} type="button">
          Back to Sessions
        </Button>
      </div>
    );
  }

  const handleComplete = () => {
    complete(
      {
        id: sessionId,
        data: {
          notes,
          member_attended: memberAttended,
        },
      },
      {
        onSuccess: () => {
          toast.success(memberAttended ? 'Session completed' : 'Session marked as no-show');
          setShowCompleteDialog(false);
          router.push('/sessions');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to complete session');
        },
      },
    );
  };

  const handleCancel = () => {
    cancel(
      { id: sessionId },
      {
        onSuccess: () => {
          toast.success('Session cancelled');
          setShowCancelDialog(false);
          router.push('/sessions');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to cancel session');
        },
      },
    );
  };

  const canComplete = ['scheduled', 'confirmed', 'in_progress'].includes(session.status);
  const canCancel = session.status === 'scheduled';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/sessions">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Session Details</h1>
              <StatusBadge status={session.status} />
            </div>
            <p className="text-muted-foreground">
              {format(new Date(session.scheduled_at), 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canComplete && (
            <Button onClick={() => setShowCompleteDialog(true)} type="button">
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete Session
            </Button>
          )}
          {canCancel && (
            <Button variant="destructive" onClick={() => setShowCancelDialog(true)} type="button">
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Member Info */}
        <Card>
          <CardHeader>
            <CardTitle>Member</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={session.user?.profile_image_url} />
                <AvatarFallback className="text-xl">
                  {session.user?.first_name?.[0]}
                  {session.user?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">
                  {session.user?.first_name} {session.user?.last_name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {session.user?.email}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Info */}
        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(session.scheduled_at), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Time & Duration</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(session.scheduled_at), 'h:mm a')} ({session.duration_minutes}{' '}
                  minutes)
                </p>
              </div>
            </div>

            {session.gym && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{session.gym.name}</p>
                </div>
              </div>
            )}

            {session.price && (
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Price</p>
                  <p className="text-sm text-muted-foreground">${session.price}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {(session.notes || session.video_recap_url) && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {session.notes && (
              <div>
                <p className="text-sm font-medium mb-1 flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Session Notes
                </p>
                <p className="text-sm text-muted-foreground">{session.notes}</p>
              </div>
            )}
            {session.video_recap_url && (
              <div>
                <p className="text-sm font-medium mb-1">Video Recap</p>
                <a
                  href={session.video_recap_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View Video
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Complete Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Session</DialogTitle>
            <DialogDescription>Add notes and mark attendance for this session</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="attended">Member Attended</Label>
              <Switch id="attended" checked={memberAttended} onCheckedChange={setMemberAttended} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Session Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about the session..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)} type="button">
              Cancel
            </Button>
            <Button onClick={handleComplete} disabled={isCompleting} type="button">
              {isCompleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation */}
      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancel Session"
        description={`Are you sure you want to cancel the session with ${session.user?.first_name}?`}
        confirmLabel="Cancel Session"
        variant="destructive"
        isLoading={isCancelling}
        onConfirm={handleCancel}
      />
    </div>
  );
}
