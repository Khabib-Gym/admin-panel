import { requireAdmin } from '@/lib/auth/guards';
import { GymAnalyticsView } from './gym-analytics';

interface GymAnalyticsPageProps {
  params: Promise<{ gymId: string }>;
}

export default async function GymAnalyticsPage({ params }: GymAnalyticsPageProps) {
  await requireAdmin();
  const { gymId } = await params;

  return <GymAnalyticsView gymId={gymId} />;
}
