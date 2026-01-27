import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { MembershipStatusValue } from '@/types/models';

const statusStyles: Record<MembershipStatusValue, string> = {
  active: 'bg-green-100 text-green-800 border-green-200',
  paused: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  expired: 'bg-gray-100 text-gray-800 border-gray-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

interface MembershipStatusBadgeProps {
  status: MembershipStatusValue;
  className?: string;
}

export function MembershipStatusBadge({ status, className }: MembershipStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(statusStyles[status], 'capitalize', className)}>
      {status}
    </Badge>
  );
}
