'use client';

import type { UserRole } from '@/types/auth';
import { useUserRole } from './use-auth';

const ROLE_HIERARCHY: Record<UserRole, number> = {
  member: 0,
  coach: 1,
  admin: 2,
  super_admin: 3,
};

export function usePermissions() {
  const role = useUserRole();

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!role) return false;
    return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[requiredRole];
  };

  const isCoach = hasRole('coach');
  const isAdmin = hasRole('admin');
  const isSuperAdmin = hasRole('super_admin');

  // Specific permission checks
  const canManageGyms = isAdmin;
  const canManageUsers = isAdmin;
  const canPromoteToAdmin = isSuperAdmin;
  const canManageClasses = isCoach;
  const canManageSessions = isCoach;
  const canViewAnalytics = isCoach;
  const canManageContent = isCoach;
  const canManageAchievements = isAdmin;
  const canManageMemberships = isAdmin;

  return {
    role,
    hasRole,
    isCoach,
    isAdmin,
    isSuperAdmin,
    // Specific permissions
    canManageGyms,
    canManageUsers,
    canPromoteToAdmin,
    canManageClasses,
    canManageSessions,
    canViewAnalytics,
    canManageContent,
    canManageAchievements,
    canManageMemberships,
  };
}
