'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { Building2, Calendar, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Membership } from '@/types/models';

interface UserMembershipsProps {
  memberships: Membership[];
  isLoading?: boolean;
}

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  active: 'default',
  paused: 'secondary',
  expired: 'destructive',
  cancelled: 'outline',
};

const typeLabels: Record<string, string> = {
  basic: 'Basic',
  premium: 'Premium',
  vip: 'VIP',
  trial: 'Trial',
};

export function UserMemberships({ memberships, isLoading }: UserMembershipsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Memberships</CardTitle>
          <CardDescription>Gym membership history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-4 border rounded-lg">
                <Skeleton className="h-10 w-10 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memberships</CardTitle>
        <CardDescription>
          {memberships.length === 0
            ? 'No gym memberships'
            : `${memberships.length} membership${memberships.length !== 1 ? 's' : ''}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {memberships.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>This user has no gym memberships</p>
          </div>
        ) : (
          <div className="space-y-4">
            {memberships.map((membership) => (
              <div
                key={membership.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{membership.gym?.name || 'Unknown Gym'}</p>
                    <Badge variant="outline" className="text-xs">
                      {typeLabels[membership.type] || membership.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {membership.expires_at
                        ? `Expires ${format(new Date(membership.expires_at), 'MMM d, yyyy')}`
                        : 'No expiry'}
                    </div>
                    <div className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      Started{' '}
                      {formatDistanceToNow(new Date(membership.starts_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <Badge variant={statusVariants[membership.status] || 'outline'}>
                  {membership.status.charAt(0).toUpperCase() + membership.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
