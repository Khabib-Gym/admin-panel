'use client';

import { Calendar, Mail, MapPin, Pencil, Phone, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { StatCard } from '@/components/dashboard/stat-card';
import { PageLoader } from '@/components/shared/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGym, useGymAnalytics } from '@/hooks/queries/use-gyms';

interface GymDetailsProps {
  gymId: string;
}

export function GymDetails({ gymId }: GymDetailsProps) {
  const { data: gymData, isLoading: gymLoading } = useGym(gymId);
  const { data: analytics } = useGymAnalytics(gymId);

  if (gymLoading) {
    return <PageLoader />;
  }

  if (!gymData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Gym not found</h2>
        <p className="text-muted-foreground mt-2">The gym you're looking for doesn't exist.</p>
        <Button asChild className="mt-4">
          <Link href="/gyms">Back to Gyms</Link>
        </Button>
      </div>
    );
  }

  const gym = gymData.gym;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{gym.name}</h1>
            <Badge variant={gym.is_active ? 'default' : 'secondary'}>
              {gym.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            {gym.city}, {gym.country}
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/gyms/${gymId}/members`}>
              <Users className="mr-2 h-4 w-4" />
              Members
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/gyms/${gymId}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Members" value={gymData.active_members} icon={Users} />
        <StatCard
          title="Visits This Week"
          value={analytics?.visits_this_week ?? 0}
          icon={TrendingUp}
        />
        <StatCard
          title="Classes This Week"
          value={analytics?.classes_this_week ?? 0}
          icon={Calendar}
        />
        <StatCard
          title="Avg Daily Visits"
          value={analytics?.average_daily_visits ?? 0}
          icon={TrendingUp}
        />
      </div>

      {/* Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Address</div>
              <div>{gym.address}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">City</div>
              <div>{gym.city}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Country</div>
              <div>{gym.country}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Timezone</div>
              <div>{gym.timezone}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {gym.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{gym.phone}</span>
              </div>
            )}
            {gym.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{gym.email}</span>
              </div>
            )}
            {!gym.phone && !gym.email && (
              <p className="text-sm text-muted-foreground">No contact information</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
