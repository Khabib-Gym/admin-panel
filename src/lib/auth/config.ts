import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Trust the host header when running behind ALB/reverse proxy
  // Without this, CSRF validation fails with "Bad request"
  trustHost: true,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validated = loginSchema.safeParse(credentials);
        if (!validated.success) {
          console.error('[Auth] Validation failed:', validated.error.issues);
          return null;
        }

        try {
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`;
          console.log('[Auth] Attempting login to:', apiUrl);

          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: validated.data.email,
              password: validated.data.password,
            }),
          });

          console.log('[Auth] Response status:', response.status);

          if (!response.ok) {
            const errorBody = await response.text();
            console.error('[Auth] Response not OK:', response.status, errorBody);
            return null;
          }

          const result = await response.json();
          console.log('[Auth] Response structure:', {
            success: result.success,
            hasData: !!result.data,
            userRole: result.data?.user?.role,
          });

          if (!result.success) {
            console.error('[Auth] API returned success: false');
            return null;
          }

          const { access_token, refresh_token, user } = result.data;

          // Validate user has admin-level access
          if (!['coach', 'admin', 'super_admin'].includes(user.role)) {
            console.error('[Auth] User role not allowed:', user.role);
            return null; // Members cannot access admin panel
          }

          console.log('[Auth] Login successful for:', user.email, 'role:', user.role);

          return {
            id: user.id,
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            role: user.role,
            accessToken: access_token,
            refreshToken: refresh_token,
          };
        } catch (error) {
          console.error('[Auth] Exception during login:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
});
