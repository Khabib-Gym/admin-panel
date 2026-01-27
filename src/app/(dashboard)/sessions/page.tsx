import { requireCoach } from '@/lib/auth/guards';
import { SessionsList } from './sessions-list';

export default async function SessionsPage() {
  await requireCoach();

  return <SessionsList />;
}
