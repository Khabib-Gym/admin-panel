import { requireAdmin } from '@/lib/auth/guards';
import { GymEdit } from './gym-edit';

interface GymEditPageProps {
  params: Promise<{ gymId: string }>;
}

export default async function GymEditPage({ params }: GymEditPageProps) {
  await requireAdmin();
  const { gymId } = await params;

  return <GymEdit gymId={gymId} />;
}
