import { requireAdmin } from '@/lib/auth/guards';
import { UserDetails } from './user-details';

interface UserDetailsPageProps {
  params: Promise<{ userId: string }>;
}

export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
  await requireAdmin();
  const { userId } = await params;

  return <UserDetails userId={userId} />;
}
