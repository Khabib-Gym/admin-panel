'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { PageLoader } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { useMySessions, useCancelSession } from '@/hooks/queries/use-sessions';
import { format, isAfter, startOfDay } from 'date-fns';
import { Calendar, Clock, MapPin, XCircle, Eye, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import type { PrivateSession } from '@/types/models';

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
    <Badge variant={statusVariants[status] || 'outline'}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}

export function SessionsList() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [cancelSession, setCancelSession] = useState<PrivateSession | null>(null);

  const { data, isLoading } = useMySessions({
    upcoming_only: activeTab === 'upcoming',
    page_size: 50,
  });
  const { mutate: cancel, isPending: isCancelling } = useCancelSession();

  if (isLoading) {
    return <PageLoader />;
  }

  const sessions = data?.items ?? [];
  const today = startOfDay(new Date());

  const upcomingSessions = sessions.filter(
    (s) =>
      isAfter(new Date(s.scheduled_at), today) &&
      !['completed', 'cancelled', 'no_show'].includes(s.status),
  );

  const pastSessions = sessions.filter(
    (s) =>
      !isAfter(new Date(s.scheduled_at), today) ||
      ['completed', 'cancelled', 'no_show'].includes(s.status),
  );

  const displaySessions = activeTab === 'upcoming' ? upcomingSessions : pastSessions;

  const handleCancel = () => {
    if (!cancelSession) return;

    cancel(
      { id: cancelSession.id },
      {
        onSuccess: () => {
          toast.success('Session cancelled');
          setCancelSession(null);
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to cancel session');
        },
      },
    );
  };

  const renderSessionCard = (session: PrivateSession) => (
    <Card key={session.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={session.user?.profile_image_url} />
              <AvatarFallback>
                {session.user?.first_name?.[0]}
                {session.user?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">
                  {session.user?.first_name} {session.user?.last_name}
                </h3>
                <StatusBadge status={session.status} />
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(session.scheduled_at), 'MMM d, yyyy')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {format(new Date(session.scheduled_at), 'h:mm a')}
                </span>
                <span className="flex items-center gap-1">{session.duration_minutes} min</span>
              </div>
              {session.gym && (
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {session.gym.name}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {session.price && (
              <Badge variant="outline" className="gap-1">
                <DollarSign className="h-3 w-3" />
                {session.price}
              </Badge>
            )}
            <Button variant="outline" size="sm" asChild>
              <Link href={`/sessions/${session.id}`}>
                <Eye className="mr-1 h-4 w-4" />
                View
              </Link>
            </Button>
            {session.status === 'scheduled' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCancelSession(session)}
                type="button"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Private Sessions</h1>
        <p className="text-muted-foreground">Manage your private training sessions</p>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'upcoming' | 'past')}
      >
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingSessions.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastSessions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {displaySessions.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No upcoming sessions"
              description="Your scheduled private sessions will appear here."
            />
          ) : (
            displaySessions.map(renderSessionCard)
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-4">
          {displaySessions.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No past sessions"
              description="Completed sessions will appear here."
            />
          ) : (
            displaySessions.map(renderSessionCard)
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Confirmation */}
      <ConfirmDialog
        open={!!cancelSession}
        onOpenChange={(open) => !open && setCancelSession(null)}
        title="Cancel Session"
        description={`Are you sure you want to cancel the session with ${cancelSession?.user?.first_name}? They will be notified.`}
        confirmLabel="Cancel Session"
        variant="destructive"
        isLoading={isCancelling}
        onConfirm={handleCancel}
      />
    </div>
  );
}
