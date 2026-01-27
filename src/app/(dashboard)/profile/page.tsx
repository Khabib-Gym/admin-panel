import { auth } from '@/lib/auth/config';
import { requireAuth } from '@/lib/auth/guards';
import { AdminProfileContent } from './admin-profile-content';
import { ProfileContent } from './profile-content';

export default async function ProfilePage() {
  await requireAuth();
  const session = await auth();

  const userRole = session?.user?.role;
  const isCoach = userRole === 'coach';

  // Coaches see their coach profile with specializations, hourly rate, etc.
  // Admins and Super Admins see a simpler profile page
  if (isCoach) {
    return <ProfileContent />;
  }

  return <AdminProfileContent />;
}
