import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployments
  output: 'standalone',

  // Base path for running behind ALB with path-based routing
  // Remove this when using a custom domain (host-based routing)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // Disable x-powered-by header for security
  poweredByHeader: false,

  // Enable strict mode for better React practices
  reactStrictMode: true,

  // Enable gzip compression
  compress: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Optimize package imports for smaller bundles
    optimizePackageImports: ['lucide-react', '@tanstack/react-query', 'recharts', 'date-fns'],
  },
};

export default nextConfig;
