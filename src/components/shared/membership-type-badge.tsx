import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { MembershipTypeValue } from '@/types/models';

const typeStyles: Record<MembershipTypeValue, string> = {
  basic: 'bg-slate-100 text-slate-800 border-slate-200',
  premium: 'bg-blue-100 text-blue-800 border-blue-200',
  vip: 'bg-purple-100 text-purple-800 border-purple-200',
  trial: 'bg-orange-100 text-orange-800 border-orange-200',
};

interface MembershipTypeBadgeProps {
  type: MembershipTypeValue;
  className?: string;
}

export function MembershipTypeBadge({ type, className }: MembershipTypeBadgeProps) {
  return (
    <Badge variant="outline" className={cn(typeStyles[type], 'uppercase text-xs', className)}>
      {type}
    </Badge>
  );
}
