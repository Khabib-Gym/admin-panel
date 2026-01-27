export const siteConfig = {
  name: 'Khabib Admin',
  description: 'Admin panel for Khabib Gym App',
  url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
} as const;
