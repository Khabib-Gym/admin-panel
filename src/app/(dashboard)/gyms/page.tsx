import { requireAdmin } from '@/lib/auth/guards';
import { GymList } from './gym-list';

export default async function GymsPage() {
  await requireAdmin();

  return <GymList />;
}
