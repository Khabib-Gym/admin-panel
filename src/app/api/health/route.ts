import { NextResponse } from 'next/server';

/**
 * Health check endpoint for ALB/ECS container health checks.
 * This endpoint must be fast and not require authentication.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  );
}
