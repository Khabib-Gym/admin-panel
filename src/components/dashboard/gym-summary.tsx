'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, MapPin } from 'lucide-react';
import type { Gym } from '@/types/models';

interface GymSummaryProps {
  gyms: Gym[];
  isLoading?: boolean;
}

export function GymSummary({ gyms, isLoading }: GymSummaryProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gym Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-lg animate-pulse"
              >
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-32" />
                  <div className="h-3 bg-muted rounded w-24" />
                </div>
                <div className="h-8 bg-muted rounded w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gym Overview</CardTitle>
          <CardDescription>Performance by location</CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/gyms">
            View All
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {gyms.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No gyms found. Create your first gym to get started.
          </p>
        ) : (
          <div className="space-y-4">
            {gyms.slice(0, 5).map((gym) => (
              <Link
                key={gym.id}
                href={`/gyms/${gym.id}`}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{gym.name}</span>
                    <Badge variant={gym.is_active ? 'default' : 'secondary'}>
                      {gym.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {gym.city}, {gym.country}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
