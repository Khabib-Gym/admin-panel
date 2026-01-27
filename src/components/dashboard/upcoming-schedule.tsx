'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Class, PrivateSession } from '@/types/models';

type ScheduleItem = Class | PrivateSession;

interface UpcomingScheduleProps {
  items: ScheduleItem[];
  type: 'class' | 'session';
  isLoading?: boolean;
  emptyMessage?: string;
}

function isClass(item: ScheduleItem): item is Class {
  return 'capacity' in item;
}

export function UpcomingSchedule({
  items,
  type,
  isLoading,
  emptyMessage = 'No upcoming items',
}: UpcomingScheduleProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="h-12 w-12 rounded bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">{emptyMessage}</p>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {items.slice(0, 5).map((item) => {
          const scheduledAt = new Date(item.scheduled_at);
          const href = type === 'class' ? `/classes/${item.id}` : `/sessions/${item.id}`;

          return (
            <Link
              key={item.id}
              href={href}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {/* Date block */}
              <div className="flex flex-col items-center justify-center h-12 w-12 rounded bg-primary/10 text-primary">
                <span className="text-xs font-medium">{format(scheduledAt, 'MMM')}</span>
                <span className="text-lg font-bold leading-none">{format(scheduledAt, 'd')}</span>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">
                    {isClass(item) ? item.name : 'Private Session'}
                  </span>
                  {isClass(item) && (
                    <Badge variant="secondary" className="text-xs">
                      {item.type}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(scheduledAt, 'h:mm a')}
                  </span>
                  {isClass(item) ? (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {item.current_bookings}/{item.capacity}
                    </span>
                  ) : (
                    item.user && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {item.user.first_name} {item.user.last_name}
                      </span>
                    )
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </ScrollArea>
  );
}
