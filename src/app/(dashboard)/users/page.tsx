import { requireAdmin } from '@/lib/auth/guards';
import { UserList } from './user-list';

export default async function UsersPage() {
  await requireAdmin();

  return <UserList />;
}
