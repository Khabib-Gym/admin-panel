import { AdminDashboard } from '@/components/dashboard/admin-dashboard';
import { CoachDashboard } from '@/components/dashboard/coach-dashboard';
import { requireAuth } from '@/lib/auth/guards';

export default async function DashboardPage() {
  const session = await requireAuth();
  const role = session.user.role;
  const userName = session.user.name?.split(' ')[0] || 'User';

  // Admins and super_admins see admin dashboard
  if (role === 'admin' || role === 'super_admin') {
    return <AdminDashboard userName={userName} />;
  }

  // Coaches see coach dashboard
  return <CoachDashboard userName={userName} />;
}
