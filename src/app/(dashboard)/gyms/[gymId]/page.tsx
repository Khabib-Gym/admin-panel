import { requireAdmin } from '@/lib/auth/guards';
import { GymDetails } from './gym-details';

interface GymDetailsPageProps {
  params: Promise<{ gymId: string }>;
}

export default async function GymDetailsPage({ params }: GymDetailsPageProps) {
  await requireAdmin();
  const { gymId } = await params;

  return <GymDetails gymId={gymId} />;
}
