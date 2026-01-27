import { requireRole } from '@/lib/auth/guards';
import { AnalyticsOverview } from './analytics-overview';

export default async function AnalyticsPage() {
  await requireRole('coach', 'admin', 'super_admin');

  return <AnalyticsOverview />;
}
