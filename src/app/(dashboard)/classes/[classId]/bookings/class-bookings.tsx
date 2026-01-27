'use client';

import { format } from 'date-fns';
import { ArrowLeft, CheckCircle, Clock, Users, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/loading-spinner';
import { StatusBadge } from '@/components/shared/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useCheckInBooking,
  useClass,
  useClassBookings,
  useMarkNoShow,
} from '@/hooks/queries/use-classes';
import type { ClassBooking } from '@/types/models';

interface ClassBookingsProps {
  classId: string;
}

export function ClassBookings({ classId }: ClassBookingsProps) {
  const router = useRouter();
  const [noShowBooking, setNoShowBooking] = useState<ClassBooking | null>(null);

  const { data: classItem, isLoading: classLoading } = useClass(classId);
  const { data: bookingsData, isLoading: bookingsLoading } = useClassBookings(classId);

  const { mutate: checkIn, isPending: isCheckingIn } = useCheckInBooking();
  const { mutate: markNoShow, isPending: isMarkingNoShow } = useMarkNoShow();

  const isLoading = classLoading || bookingsLoading;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!classItem) {
    return (
      <EmptyState
        title="Class not found"
        description="The class you're looking for doesn't exist."
        action={{
          label: 'Back to Classes',
          onClick: () => router.push('/classes'),
        }}
      />
    );
  }

  const allBookings = bookingsData?.items ?? [];
  const confirmedBookings = allBookings.filter((b) => b.status === 'confirmed');
  const attendedBookings = allBookings.filter((b) => b.status === 'attended');
  const waitlistedBookings = allBookings
    .filter((b) => b.status === 'waitlisted')
    .sort((a, b) => (a.waitlist_position ?? 0) - (b.waitlist_position ?? 0));
  const cancelledBookings = allBookings.filter(
    (b) => b.status === 'cancelled' || b.status === 'no_show',
  );

  const handleCheckIn = (booking: ClassBooking) => {
    checkIn(
      { classId, bookingId: booking.id },
      {
        onSuccess: () => {
          toast.success(`${booking.user?.first_name} checked in`);
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to check in');
        },
      },
    );
  };

  const handleNoShow = () => {
    if (!noShowBooking) return;

    markNoShow(
      { classId, bookingId: noShowBooking.id },
      {
        onSuccess: () => {
          toast.success('Marked as no show');
          setNoShowBooking(null);
        },
        onError: (err) => {
          toast.error(err.message || 'Failed to mark as no show');
        },
      },
    );
  };

  const renderBookingItem = (booking: ClassBooking, showActions = true) => (
    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={booking.user?.profile_image_url} />
          <AvatarFallback>
            {booking.user?.first_name?.[0]}
            {booking.user?.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">
            {booking.user?.first_name} {booking.user?.last_name}
          </p>
          <p className="text-sm text-muted-foreground">{booking.user?.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <StatusBadge status={booking.status} />

        {showActions &&
          booking.status === 'confirmed' &&
          (classItem.status === 'scheduled' || classItem.status === 'in_progress') && (
            <>
              <Button
                size="sm"
                onClick={() => handleCheckIn(booking)}
                disabled={isCheckingIn}
              >
                <CheckCircle className="mr-1 h-4 w-4" />
                Check In
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setNoShowBooking(booking)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}

        {booking.status === 'attended' && booking.attended_at && (
          <span className="text-xs text-muted-foreground">
            <Clock className="inline h-3 w-3 mr-1" />
            {format(new Date(booking.attended_at), 'h:mm a')}
          </span>
        )}

        {booking.status === 'waitlisted' && booking.waitlist_position && (
          <span className="text-xs text-muted-foreground">#{booking.waitlist_position}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/classes/${classId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            {classItem.name} - {format(new Date(classItem.scheduled_at), 'MMM d, yyyy h:mm a')}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{confirmedBookings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attended</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{attendedBookings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Waitlisted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{waitlistedBookings.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {confirmedBookings.length + attendedBookings.length}/{classItem.capacity}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="confirmed">
        <TabsList>
          <TabsTrigger value="confirmed">Confirmed ({confirmedBookings.length})</TabsTrigger>
          <TabsTrigger value="attended">Attended ({attendedBookings.length})</TabsTrigger>
          <TabsTrigger value="waitlist">Waitlist ({waitlistedBookings.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="confirmed" className="space-y-4 mt-4">
          {confirmedBookings.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No confirmed bookings"
              description="Members who book will appear here."
            />
          ) : (
            confirmedBookings.map((booking) => renderBookingItem(booking))
          )}
        </TabsContent>

        <TabsContent value="attended" className="space-y-4 mt-4">
          {attendedBookings.length === 0 ? (
            <EmptyState
              icon={CheckCircle}
              title="No check-ins yet"
              description="Start the class to begin check-ins."
            />
          ) : (
            attendedBookings.map((booking) => renderBookingItem(booking, false))
          )}
        </TabsContent>

        <TabsContent value="waitlist" className="space-y-4 mt-4">
          {waitlistedBookings.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No waitlist"
              description="Members on the waitlist will appear here."
            />
          ) : (
            waitlistedBookings.map((booking) => renderBookingItem(booking, false))
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4 mt-4">
          {cancelledBookings.length === 0 ? (
            <EmptyState
              icon={XCircle}
              title="No cancellations"
              description="Cancelled bookings will appear here."
            />
          ) : (
            cancelledBookings.map((booking) => renderBookingItem(booking, false))
          )}
        </TabsContent>
      </Tabs>

      {/* No Show Confirmation */}
      <ConfirmDialog
        open={!!noShowBooking}
        onOpenChange={(open) => !open && setNoShowBooking(null)}
        title="Mark as No Show"
        description={`Are you sure you want to mark ${noShowBooking?.user?.first_name} ${noShowBooking?.user?.last_name} as a no show?`}
        confirmLabel="Mark No Show"
        variant="destructive"
        isLoading={isMarkingNoShow}
        onConfirm={handleNoShow}
      />
    </div>
  );
}
