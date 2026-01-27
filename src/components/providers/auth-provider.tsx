'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

// Get the basePath from Next.js config (available at build time via NEXT_PUBLIC_BASE_PATH)
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function AuthProvider({ children }: AuthProviderProps) {
  // SessionProvider needs to know where auth API routes are
  // With Next.js basePath, auth routes are at {basePath}/api/auth
  return (
    <SessionProvider basePath={basePath ? `${basePath}/api/auth` : '/api/auth'}>
      {children}
    </SessionProvider>
  );
}
