import { requireCoach } from '@/lib/auth/guards';
import { RevenueDashboard } from './revenue-dashboard';

export default async function RevenuePage() {
  await requireCoach();

  return <RevenueDashboard />;
}
