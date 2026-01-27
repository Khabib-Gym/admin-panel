import { requireRole } from '@/lib/auth/guards';
import { MembershipsList } from './memberships-list';

export default async function MembershipsPage() {
  await requireRole('admin', 'super_admin');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Memberships</h1>
        <p className="text-muted-foreground">Manage gym memberships across all gyms</p>
      </div>
      <MembershipsList />
    </div>
  );
}
