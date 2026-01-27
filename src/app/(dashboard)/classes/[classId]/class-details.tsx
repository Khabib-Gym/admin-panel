'use client';

import { format } from 'date-fns';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Pencil,
  Play,
  User,
  Users,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { PageLoader } from '@/components/shared/loading-spinner';
import { StatusBadge } from '@/components/shared/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  useCancelClass,
  useClass,
  useCompleteClass,
  useStartClass,
} from '@/hooks/queries/use-classes';

interface ClassDetailsProps {
  classId: string;
}

export function ClassDetails({ classId }: ClassDetailsProps) {
  const router = useRouter();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { data: classItem, isLoading, error } = useClass(classId);
  const { mutate: startMutation, isPending: isStarting } = useStartClass();
  const { mutate: completeMutation, isPending: isCompleting } = useCompleteClass();
  const { mutate: cancelMutation, isPending: isCancelling } = useCancelClass();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !classItem) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-semibold">Class not found</h2>
        <p className="text-muted-foreground mt-2">The class you're looking for doesn't exist.</p>
        <Button className="mt-4" onClick={() => router.push('/classes')}>
          Back to Classes
        </Button>
      </div>
    );
  }

  const handleStart = () => {
    startMutation(classId, {
      onSuccess: () => {
        toast.success('Class started');
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to start class');
      },
    });
  };

  const handleComplete = () => {
    completeMutation(classId, {
      onSuccess: () => {
        toast.success('Class completed');
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to complete class');
      },
    });
  };

  const handleCancel = () => {
    cancelMutation(classId, {
      onSuccess: () => {
        toast.success('Class cancelled');
        setShowCancelDialog(false);
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to cancel class');
      },
    });
  };

  const isScheduled = classItem.status === 'scheduled';
  const isInProgress = classItem.status === 'in_progress';
  const bookedCount = classItem.current_bookings ?? 0;
  const bookingPercentage = Math.round((bookedCount / classItem.capacity) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/classes')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{classItem.name}</h1>
              <StatusBadge status={classItem.status} />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <Badge variant="outline" className="capitalize">
                {classItem.type.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isScheduled && (
            <>
              <Button variant="outline" asChild>
                <Link href={`/classes/${classId}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <Button onClick={handleStart} disabled={isStarting}>
                <Play className="mr-2 h-4 w-4" />
                {isStarting ? 'Starting...' : 'Start Class'}
              </Button>
              <Button variant="destructive" onClick={() => setShowCancelDialog(true)}>
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          )}
          {isInProgress && (
            <Button onClick={handleComplete} disabled={isCompleting}>
              <CheckCircle className="mr-2 h-4 w-4" />
              {isCompleting ? 'Completing...' : 'Complete Class'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Class Information */}
        <Card>
          <CardHeader>
            <CardTitle>Class Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(classItem.scheduled_at), 'EEEE, MMMM d, yyyy')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Time & Duration</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(classItem.scheduled_at), 'h:mm a')} ({classItem.duration_minutes}{' '}
                  minutes)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Capacity</p>
                <p className="text-sm text-muted-foreground">
                  {bookedCount} / {classItem.capacity} booked ({bookingPercentage}%)
                </p>
              </div>
            </div>

            {classItem.room && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Room</p>
                  <p className="text-sm text-muted-foreground">{classItem.room}</p>
                </div>
              </div>
            )}

            {classItem.description && (
              <>
                <Separator />
                <div>
                  <p className="font-medium mb-1">Description</p>
                  <p className="text-sm text-muted-foreground">{classItem.description}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Coach & Gym Info */}
        <Card>
          <CardHeader>
            <CardTitle>Coach & Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Coach</p>
                <p className="text-sm text-muted-foreground">
                  {classItem.coach?.user?.first_name} {classItem.coach?.user?.last_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Gym</p>
                <p className="text-sm text-muted-foreground">{classItem.gym?.name}</p>
                {classItem.gym?.city && (
                  <p className="text-xs text-muted-foreground">
                    {classItem.gym.city}, {classItem.gym.country}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Quick View */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>
              {bookedCount} of {classItem.capacity} spots filled
            </CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/classes/${classId}/bookings`}>View All Bookings</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Progress value={bookingPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            {classItem.capacity - bookedCount} spots remaining
          </p>
        </CardContent>
      </Card>

      {/* Cancel Dialog */}
      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancel Class"
        description={`Are you sure you want to cancel "${classItem.name}"? All ${bookedCount} booked members will be notified.`}
        confirmLabel="Cancel Class"
        variant="destructive"
        isLoading={isCancelling}
        onConfirm={handleCancel}
      />
    </div>
  );
}
