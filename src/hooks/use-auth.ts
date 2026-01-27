'use client';

import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useCallback } from 'react';
import type { UserRole } from '@/types/auth';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const user = session?.user;
  const accessToken = session?.accessToken;

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push('/login');
  }, [router]);

  return {
    user,
    accessToken,
    isLoading,
    isAuthenticated,
    logout,
  };
}

export function useUser() {
  const { user, isLoading, isAuthenticated } = useAuth();
  return { user, isLoading, isAuthenticated };
}

export function useUserRole(): UserRole | null {
  const { user } = useAuth();
  return (user?.role as UserRole) || null;
}
