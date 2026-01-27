import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Role = 'member' | 'coach' | 'admin' | 'super_admin';

interface RoleBadgeProps {
  role: Role;
  className?: string;
}

const roleConfig: Record<Role, { label: string; className: string }> = {
  member: {
    label: 'Member',
    className: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
  },
  coach: {
    label: 'Coach',
    className: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  },
  admin: {
    label: 'Admin',
    className: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
  },
  super_admin: {
    label: 'Super Admin',
    className: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  },
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = roleConfig[role];

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
