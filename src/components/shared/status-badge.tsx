import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'confirmed'
  | 'waitlisted'
  | 'attended'
  | 'no_show'
  | 'paused'
  | 'expired';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  // General
  active: {
    label: 'Active',
    className: 'bg-green-100 text-green-700 hover:bg-green-100',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
  },
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
  },

  // Class status
  scheduled: {
    label: 'Scheduled',
    className: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-100 text-green-700 hover:bg-green-100',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-700 hover:bg-red-100',
  },

  // Booking status
  confirmed: {
    label: 'Confirmed',
    className: 'bg-green-100 text-green-700 hover:bg-green-100',
  },
  waitlisted: {
    label: 'Waitlisted',
    className: 'bg-orange-100 text-orange-700 hover:bg-orange-100',
  },
  attended: {
    label: 'Attended',
    className: 'bg-green-100 text-green-700 hover:bg-green-100',
  },
  no_show: {
    label: 'No Show',
    className: 'bg-red-100 text-red-700 hover:bg-red-100',
  },

  // Membership status
  paused: {
    label: 'Paused',
    className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
  },
  expired: {
    label: 'Expired',
    className: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  if (!config) {
    return (
      <Badge variant="secondary" className={className}>
        {status}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
