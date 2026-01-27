'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface BreadcrumbsProps {
  className?: string;
}

const pathLabels: Record<string, string> = {
  gyms: 'Gyms',
  users: 'Users',
  classes: 'Classes',
  sessions: 'Sessions',
  availability: 'Availability',
  profile: 'Profile',
  revenue: 'Revenue',
  analytics: 'Analytics',
  content: 'Content',
  blog: 'Blog',
  exercises: 'Exercises',
  workouts: 'Workouts',
  'training-plans': 'Training Plans',
  achievements: 'Achievements',
  memberships: 'Memberships',
  settings: 'Settings',
  new: 'New',
  edit: 'Edit',
  bookings: 'Bookings',
  members: 'Members',
  attendance: 'Attendance',
  categories: 'Categories',
};

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname();

  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const label = pathLabels[segment] || segment;
    const isLast = index === segments.length - 1;

    // Check if segment is a UUID (entity ID)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);

    return {
      href,
      label: isUuid ? 'Details' : label,
      isLast,
    };
  });

  return (
    <nav className={cn('flex items-center space-x-1 text-sm', className)}>
      <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
        <Home className="h-4 w-4" />
      </Link>
      {breadcrumbs.map((crumb) => (
        <div key={crumb.href} className="flex items-center">
          <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
          {crumb.isLast ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
