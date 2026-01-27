import {
  BarChart3,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Dumbbell,
  FileText,
  LayoutDashboard,
  type LucideIcon,
  Settings,
  Trophy,
  User,
  Users,
} from 'lucide-react';

export type UserRole = 'coach' | 'admin' | 'super_admin';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
  children?: NavItem[];
}

export const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    roles: ['coach', 'admin', 'super_admin'],
  },
  {
    title: 'Gyms',
    href: '/gyms',
    icon: Building2,
    roles: ['admin', 'super_admin'],
  },
  {
    title: 'Users',
    href: '/users',
    icon: Users,
    roles: ['admin', 'super_admin'],
  },
  {
    title: 'Classes',
    href: '/classes',
    icon: Calendar,
    roles: ['coach', 'admin', 'super_admin'],
  },
  {
    title: 'Sessions',
    href: '/sessions',
    icon: Clock,
    roles: ['coach'],
  },
  {
    title: 'Availability',
    href: '/availability',
    icon: Clock,
    roles: ['coach'],
  },
  {
    title: 'My Profile',
    href: '/profile',
    icon: User,
    roles: ['coach'],
  },
  {
    title: 'Revenue',
    href: '/revenue',
    icon: DollarSign,
    roles: ['coach'],
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['coach', 'admin', 'super_admin'],
  },
  {
    title: 'Content',
    href: '/content',
    icon: FileText,
    roles: ['coach', 'admin', 'super_admin'],
    children: [
      {
        title: 'Blog Posts',
        href: '/content/blog',
        icon: FileText,
        roles: ['admin', 'super_admin'],
      },
      {
        title: 'Exercises',
        href: '/content/exercises',
        icon: Dumbbell,
        roles: ['admin', 'super_admin'],
      },
      {
        title: 'Workout Templates',
        href: '/content/workouts',
        icon: Dumbbell,
        roles: ['coach', 'admin', 'super_admin'],
      },
      {
        title: 'Training Plans',
        href: '/content/training-plans',
        icon: FileText,
        roles: ['coach', 'admin', 'super_admin'],
      },
    ],
  },
  {
    title: 'Achievements',
    href: '/achievements',
    icon: Trophy,
    roles: ['admin', 'super_admin'],
  },
  {
    title: 'Memberships',
    href: '/memberships',
    icon: Users,
    roles: ['admin', 'super_admin'],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['coach', 'admin', 'super_admin'],
  },
];

export function getNavigationForRole(role: string): NavItem[] {
  return navigationItems
    .filter((item) => item.roles.includes(role as UserRole))
    .map((item) => ({
      ...item,
      children: item.children?.filter((child) => child.roles.includes(role as UserRole)),
    }));
}
