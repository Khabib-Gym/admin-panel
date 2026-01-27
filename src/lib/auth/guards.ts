import { redirect } from 'next/navigation';
import type { UserRole } from '@/types/auth';
import { auth } from './config';

export type Role = 'coach' | 'admin' | 'super_admin';

const ADMIN_ROLES: Role[] = ['coach', 'admin', 'super_admin'];

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return session;
}

export async function requireRole(...allowedRoles: Role[]) {
  const session = await requireAuth();

  const userRole = session.user.role as UserRole;

  // Members cannot access admin panel at all
  if (!ADMIN_ROLES.includes(userRole as Role)) {
    redirect('/login?error=unauthorized');
  }

  if (!allowedRoles.includes(userRole as Role)) {
    redirect('/unauthorized');
  }

  return session;
}

export async function requireCoach() {
  return requireRole('coach', 'admin', 'super_admin');
}

export async function requireAdmin() {
  return requireRole('admin', 'super_admin');
}

export async function requireSuperAdmin() {
  return requireRole('super_admin');
}
