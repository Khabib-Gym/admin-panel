import { requireAdmin } from '@/lib/auth/guards';
import { NewGym } from './new-gym';

export default async function NewGymPage() {
  await requireAdmin();

  return <NewGym />;
}
