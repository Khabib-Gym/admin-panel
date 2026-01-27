import { requireAdmin } from '@/lib/auth/guards';
import { GymMembers } from './gym-members';

interface GymMembersPageProps {
  params: Promise<{ gymId: string }>;
}

export default async function GymMembersPage({ params }: GymMembersPageProps) {
  await requireAdmin();
  const { gymId } = await params;

  return <GymMembers gymId={gymId} />;
}
