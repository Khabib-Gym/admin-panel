import { requireCoach } from '@/lib/auth/guards';
import { ProfileContent } from './profile-content';

export default async function ProfilePage() {
  await requireCoach();

  return <ProfileContent />;
}
